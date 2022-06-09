const gulp = require("gulp")
//用到的各个插件
const htmlMin = require('gulp-html-minifier-terser')
const htmlClean = require('gulp-htmlclean')
const replace = require('gulp-replace')
const terser = require('gulp-terser')
const jsonMin = require('gulp-jsonmin')
const cssnano = require('gulp-cssnano')

// 压缩js
gulp.task('compress', () =>
    gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
        .pipe(terser({}))
        .pipe(gulp.dest('./public'))
)
//压缩css
gulp.task('minify-css', () =>
    gulp.src(['./public/**/*.css'])
        .pipe(cssnano({
            mergeIdents: false,
            reduceIdents: false,
            discardUnused: false
        })).pipe(gulp.dest('./public'))
)
//压缩html
gulp.task('minify-html', () =>
    gulp.src('./public/**/*.html')
        .pipe(htmlClean())
        .pipe(htmlMin({
            removeComments: true, //清除html注释
            collapseWhitespace: true, //压缩html
            collapseInlineTagWhitespace: true,
            collapseBooleanAttributes: true,
            noNewlinesBeforeTagClose: false,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
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
)

//压缩json
gulp.task('min-json', () =>
    gulp.src('./src/**/*.json')
        .pipe(jsonMin())
        .pipe(gulp.dest('./dist'))
)

//替换CDN
gulp.task('cdn', () =>
    gulp.src('./public/**/*.*')
        .pipe(replace('https://cdn.jsdelivr.net/npm', 'https://npm.elemecdn.com'))
        .pipe(replace('https://cdn.jsdelivr.net/gh', 'https://cdn1.tianli0.top/gh'))
        .pipe(gulp.dest('./public/')), {overwrite: true}
)

//压缩
gulp.task("zip", gulp.parallel('compress', 'minify-css', 'minify-html', 'min-json'))