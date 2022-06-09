const logger = require('hexo-log')()

hexo.extend.generator.register('buildPostJson', async () => {
    const resultJson = {}
    const config = hexo.theme.config
    const list = hexo.locals.get('posts').data
    const sort = config.aside.card_recent_post.sort
    const date_type = config.related_post.date_type

    const buildAbbrlinkInfo = () => {
        const writeTime = sort === date_type ?
            (json, post) => json.time = (sort === 'updated' && post.updated ? post.updated : post.date) :
            (json, post) => {
                if (sort === 'updated') {
                    json.sort = post.updated ? post.updated : post.date
                    json.date = post.date
                } else {
                    json.sort = post.date
                    json.date = post.updated ? post.updated : post.date
                }
            }
        const json = {}
        for (let post of list) {
            const info = {}
            info.title = post.title
            writeTime(info, post)
            info.img = post.cover
            json[post.abbrlink] = info
        }
        resultJson.info = json
    }

    /** 构建最新文章信息 */
    const buildRecentJsonInfo = () => {
        if (!(config.aside.enable && config.aside.card_recent_post.enable)) return
        const getTime = sort === 'updated' ? post => post.updated ? post.updated : post.date : post => post.date
        const sorted = []
        for (let post of list) sorted.push(post)
        sorted.sort((a, b) => getTime(b) - getTime(a))
        sorted.length = Math.min(sorted.length, config.aside.card_recent_post.limit)
        resultJson.recent = []
        for (let post of sorted) {
            resultJson.recent.push(post.abbrlink.toString())
        }
    }

    /** 构建相关推荐信息 */
    const buildRelatedJsonInfo = () => {
        if (!config.related_post.enable) return
        resultJson.related = {}
        const maxCount = config.related_post.limit
        resultJson.related.list = {}
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
            const plusValue = (value, plus = 1) => {
                if (map.has(value)) map.set(value, map.get(value) + plus)
                else map.set(value, plus)
            }
            for (let tag of post.tags.data) {
                const list = getPostsByTags(tag)
                for (let value of list) plusValue(value)
            }
            for (let cat of post.categories.data) {
                const list = getPostsByCategories(cat)
                for (let value of list) plusValue(value, 2)
            }
            const result = []
            map.forEach((value, key) => result.push({post: key, count: value}))
            result.sort((a, b) => b.count - a.count)
            return result
        }

        for (let post of list) {
            const info = handle(post)
            const json = []
            for (let value of info) {
                if (json.length === maxCount) break
                json.push(value.post.abbrlink.toString())
            }
            resultJson.related.list[post.abbrlink] = json
        }
    }

    const tasks = [buildAbbrlinkInfo, buildRecentJsonInfo, buildRelatedJsonInfo]
    await Promise.all(tasks.map(it => new Promise(resolve => {
        it()
        resolve()
    })))
    logger.info(`文章JSON构建成功(${list.length})`)
    return {
        path: 'postsInfo.json',
        data: JSON.stringify(resultJson)
    }
})