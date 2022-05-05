const gulp = require("gulp")
//用到的各个插件
const cleanCSS = require('gulp-clean-css')
const htmlMin = require('gulp-html-minifier-terser')
const htmlClean = require('gulp-htmlclean')
const replace = require('gulp-replace')
const terser = require('gulp-terser')
const ttf2woff2 = require('gulp-ttf2woff2')
const fontMin = require('gulp-fontmin')

// 压缩js
gulp.task('compress', () =>
    gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
        .pipe(terser())
        .pipe(gulp.dest('./public'))
)
//压缩css
gulp.task('minify-css', () => {
    return gulp.src(['./public/**/*.css'])
        .pipe(cleanCSS({compatibility: 'ie11'}))
        .pipe(gulp.dest('./public'))
})
//压缩html
gulp.task('minify-html', () => {
    return gulp.src('./public/**/*.html')
        .pipe(htmlClean())
        .pipe(htmlMin({
            removeComments: true, //清除html注释
            collapseWhitespace: true, //压缩html
            collapseBooleanAttributes: true,
            //省略布尔属性的值，例如：<input checked="true"/> ==> <input />
            removeEmptyAttributes: true,
            //删除所有空格作属性值，例如：<input id="" /> ==> <input />
            removeScriptTypeAttributes: true,
            //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,
            //删除<style>和<link>的 type="text/css"
            minifyJS: true, //压缩页面 JS
            minifyCSS: true, //压缩页面 CSS
            minifyURLs: true  //压缩页面URL
        }))
        .pipe(gulp.dest('./public'))
})

//压缩字体
function minifyFont(text, cb) {
    gulp.src('./public/font/*.ttf') //原字体所在目录
        .pipe(fontMin({text: text}))
        .pipe(gulp.dest('./public/font/')) //压缩后的输出目录
        .on('end', cb)
}

//替换CDN
gulp.task('cdn', async () => {
    gulp.src('./public/**/*.*')
        .pipe(replace('https://unpkg.zhimg.com', 'https://npm.elemecdn.com'))
        .pipe(replace('https://cdn.jsdelivr.net/npm', 'https://npm.elemecdn.com'))
        .pipe(replace('https://cdn.jsdelivr.net/gh', 'https://cdn1.tianli0.top/gh'))
        .pipe(gulp.dest('./public/')), {overwrite: true}
})

//转换字体
gulp.task('ttf2woff2', async () => {
    gulp.src(['./public/font/*.ttf'])
        .pipe(ttf2woff2())
        .pipe(gulp.dest('./public/font/'))
})

//压缩字体
gulp.task('mini-font', (cb) => {
    const buffers = [];
    gulp
        .src(['./public/**/*.html']) //HTML文件所在目录请根据自身情况修改
        .on('data', (file) => buffers.push(file.contents))
        .on('end', () => {
            const text = Buffer.concat(buffers).toString('utf-8')
            minifyFont(text, cb)
        })
})

//压缩
gulp.task("zip", gulp.parallel('compress', 'minify-css', 'minify-html', 'mini-font'))
//转换
gulp.task("convert", gulp.parallel('cdn'))