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
            const result = []
            for (let value of findObj(tags, tag.name)) result.push(value)
            return result
        }
        // 获取指定分类的文章列表
        const getPostsByCategories = cat => {
            const result = []
            for (let value of findObj(categories, cat.name)) result.push(value)
            return result
        }
        /**
         * 获取和指定文章相关的文章列表，根据有关程度从大到小排序
         * @param post
         * @return {[{post, value}]} 其中value是有关程度，post是文章对象
         */
        const handle = post => {
            const map = new Map()
            const plusValue = (post, plus = 1) => {
                if (map.has(post)) map.set(post, map.get(post) + plus)
                else map.set(post, plus)
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
            map.forEach((value, key) => result.push({post: key, value: value}))
            result.sort((a, b) => b.value - a.value)
            return result
        }

        for (let post of list) {
            const info = handle(post)
            const json = []
            for (let value of info) {
                if (value.post.abbrlink === post.abbrlink) continue
                if (json.length === maxCount) break
                json.push(value.post.abbrlink.toString())
            }
            //如果相关推荐数量不够就随机推一些文章上去
            for (; json.length !== maxCount;) {
                const index = Math.floor(Math.random() * list.length)
                const abbrlink = list[index].abbrlink.toString()
                if (abbrlink === post.abbrlink.toString() || json.indexOf(abbrlink) > -1) continue
                json.push(abbrlink)
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