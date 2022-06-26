'use strict'

const logger = require('hexo-log')()
const axios = require('axios')
const fs = require('hexo-fs')
const {source_dir} = require("hexo/lib/hexo/default_config")

const options = {
    options: [
        { name: '-u, --update', desc: 'Update data' },
        { name: '-d, --delete', desc: 'Delete data' }
    ]
}

hexo.extend.console.register('bangumi', '番剧JSON文件的相关操作', options, async args => {
    const path = `${source_dir}/bilibili.json`
    if (args.u) await writeJSON(path)
    else if (args.d) {
        if (fs.existsSync(path)) {
            fs.deleteFile(path)
            logger.info("成功删除JSON文件")
        }
    } else {
        logger.info("未知参数，目前仅支持 -u 以及 -d")
    }
})

async function writeJSON(path) {
    const config = hexo.config.bilibili || hexo.theme.config.bilibili
    if (!(config && config.enable)) return
    const readJson = (json, list) => {
        for (let element of json) {
            if (!element.index) element.index = 0
            list.push(element)
        }
    }
    const data = {
        vmid: config.vmid,
        extra: config.extra || 'extra_bangumis'
    }
    const wantWatch = await getBiliJson(data.vmid, 1)
    const watching = await getBiliJson(data.vmid, 2)
    const watched = await getBiliJson(data.vmid, 3)
    const extraPath = `./source/_data/${data.extra}.json`
    if (fs.existsSync(extraPath)) {
        const extra = JSON.parse(fs.readFileSync(extraPath))
        for (let key in extra) {
            switch (key) {
                case 'watchedExtra':
                case 'watched':
                    readJson(extra[key], watched)
                    break
                case 'watchingExtra':
                case 'watching':
                    readJson(extra[key], watching)
                    break
                case 'wantWatchExtra':
                case 'wantWatch':
                    readJson(extra[key], wantWatch)
                    break
            }
        }
    }
    const info = {
        wantWatch: mergeSort(wantWatch),
        watching: mergeSort(watching),
        watched: mergeSort(watched)
    }
    const sum = info.watching.length + info.watched.length + info.wantWatch.length
    logger.info(`wantWatch(${info.wantWatch.length}) + watching(${info.watching.length}) + watched(${info.watched.length}) = ${sum}`)
    fs.writeFileSync(path, JSON.stringify(info))
}


const getDataPage = async (vmid, status) => {
    const response = await axios.get(`https://api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=${status}&vmid=${vmid}&ps=1&pn=1`);
    if (response?.data?.code === 0 && response?.data?.message === '0' && response?.data?.data && typeof response?.data?.data?.total !== 'undefined') {
        return { success: true, data: Math.ceil(response.data.data.total / 30) + 1 };
    } else if (response && response.data && response.data.message !== '0') {
        return { success: false, data: response.data.message };
    } else if (response && response.data) {
        return { success: false, data: response.data };
    }
    return { success: false, data: response };
};
// kmar edit point
const getData = async (vmid, status, pn) => {
    const response = await axios.get(`https://api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=${status}&vmid=${vmid}&ps=30&pn=${pn}`);
    const $data = [];
    if (response?.data?.code === 0) {
        const data = response?.data?.data;
        const list = data?.list || [];

        for (const bangumi of list) {
            let cover = bangumi?.cover;
            if (cover) {
                const href = new URL(cover);
                href.protocol = 'https';
                cover = href.href;
            }
            $data.push({
                title: bangumi?.title,
                type: bangumi?.season_type_name,
                area: bangumi?.areas?.[0]?.name,
                cover: cover?.substring(cover?.lastIndexOf('bangumi/') + 8),
                totalCount: total(bangumi?.total_count, 1),
                id: bangumi?.media_id,
                follow: count(bangumi?.stat?.follow),
                view: count(bangumi?.stat?.view),
                danmaku: count(bangumi?.stat?.danmaku),
                coin: count(bangumi.stat.coin),
                score: bangumi?.rating?.score ?? '-',
                des: bangumi?.evaluate,
                index: list.length - $data.length
            });
        }
        return $data;
    }
};
// eslint-disable-next-line no-nested-ternary
const count = (e) =>  (e ? (e > 10000 && e < 100000000 ? `${(e / 10000).toFixed(1)} 万` : e > 100000000 ? `${(e / 100000000).toFixed(1)} 亿` : e) : '-');

// eslint-disable-next-line no-nested-ternary
const total = (e, typeNum) => (e ? (e === -1 ? '未完结' : `全${e}${typeNum === 1 ? '话' : '集'}`) : '-');

// kmar edit point
const getBiliJson = async (vmid, status) => {
    const page = await getDataPage(vmid, status);
    if (page?.success) {
        const list = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 1; i < page.data; i++) {
            const data = await getData(vmid, status, i);
            list.push(...data);
        }
        return list;
    }
    return [];
};

function mergeSort(array) {
    function merge(left, right) {
        let arr = []
        while (left.length && right.length) {
            arr.push(left[0].index > right[0].index ? left.shift() : right.shift())
        }
        return [ ...arr, ...left, ...right ]
    }
    const half = array.length / 2
    if (array.length < 2) return array
    const left = array.splice(0, half)
    return merge(mergeSort(left), mergeSort(array))
}