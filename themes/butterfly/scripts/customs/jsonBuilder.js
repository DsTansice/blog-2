const logger = require('hexo-log')()

hexo.extend.generator.register('buildPostJson', async () => {
    const resultJson = {}
    const config = hexo.theme.config
    const list = hexo.locals.get('posts').data

    /** 构建最新文章信息 */
    const buildRecentJsonInfo = () => {
        if (!(config.aside.enable && config.aside.card_recent_post.enable)) return
        const getTime = config.aside.card_recent_post.sort === 'updated' ?
            post => post.updated ? post.updated : post.date : post => post.date
        const sorted = []
        for (let post of list) sorted.push(post)
        sorted.sort((a, b) => getTime(b) - getTime(a))
        sorted.length = Math.min(sorted.length, config.aside.card_recent_post.limit)
        resultJson.recent = []
        for (let post of sorted) {
            const info = {}
            info.abbrlink = post.abbrlink.toString()
            info.title = post.title
            info.img = post.cover
            info.time = getTime(post)
            resultJson.recent.push(info)
        }
    }

    /** 构建相关推荐信息 */
    const buildRelatedJsonInfo = () => {
        if (!config.related_post.enable) return
        resultJson.related = {}
        const maxCount = config.related_post.limit
        resultJson.related.count = maxCount
        resultJson.related.list = {}
        const getTime = config.related_post.date_type === 'updated' ?
            post => post.updated ? post.updated : post.date : post => post.date
        const categories = hexo.locals.get('categories').data
        const tags = hexo.locals.get('tags').data
        // 查找对象
        const findObj = (src, dist) => {
            for (let value of src) {
                if (value.name === dist) return value.posts.data
            }
            return []
        }
        // 获取指定标签的文章列表
        const getPostsByTags = tag => {
            const result = new Set()
            for (let value of findObj(tags, tag.name)) result.add(value)
            return result
        }
        // 获取指定分类的文章列表
        const getPostsByCategories = cat => {
            const result = new Set()
            for (let value of findObj(categories, cat.name)) result.add(value)
            return result
        }

        // 处理文章
        const handle = post => {
            const map = new Map()
            const plusValue = value => {
                if (map.has(value)) map.set(value, map.get(value) + 1)
                else map.set(value, 1)
            }
            for (let tag of post.tags.data) {
                const list = getPostsByTags(tag)
                for (let value of list) plusValue(value)
            }
            for (let cat of post.categories.data) {
                const list = getPostsByCategories(cat)
                for (let value of list) plusValue(value)
            }
            const result = []
            map.forEach((value, key) => result.push({post: key, count: value}))
            result.sort((a, b) => b.count - a.count)
            return result
        }
        for (let post of list) {
            const info = handle(post)
            const json = {}
            json.list = []
            let amount = 0
            let preCount = -1
            for (let value of info) {
                if (value.count !== preCount) {
                    if (amount === maxCount) break
                    ++amount
                    preCount = value.count
                }
                const info = {
                    abbrlink: value.post.abbrlink.toString(),
                    title: value.post.title,
                    time: getTime(value.post),
                    img: value.post.cover
                }
                json.list.push(info)
            }
            resultJson.related.list[post.abbrlink] = json
        }
    }

    const tasks = [buildRecentJsonInfo, buildRelatedJsonInfo]
    await Promise.all(tasks.map(it => new Promise(resolve => {
        it()
        resolve()
    })))
    logger.info('文章JSON构建成功')
    return {
        path: 'postsInfo.json',
        data: JSON.stringify(resultJson)
    }
})