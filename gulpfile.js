const gulp = require("gulp");
const workbox = require("workbox-build");
//用到的各个插件
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-html-minifier-terser');
var htmlclean = require('gulp-htmlclean');
const replace = require('gulp-replace');
// gulp-tester
var terser = require('gulp-terser');

gulp.task('generate-service-worker', () => {
    return workbox.injectManifest({
        swSrc: './sw-template.js',
        swDest: './public/sw.js',
        globDirectory: './public',
        globPatterns: [
          // 缓存所有以下类型的文件，极端不推荐
          // "**/*.{html,css,js,json,woff2,xml}"
          // 推荐只缓存404，主页和主要样式和脚本。
          "404.html","index.html","js/main.js","css/index.css"
        ],
        modifyURLPrefix: {
            "": "./"
        }
    });
});

// 压缩js
gulp.task('compress', () =>
  gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
    .pipe(terser())
    .pipe(gulp.dest('./public'))
)
//压缩css
gulp.task('minify-css', () => {
    return gulp.src(['./public/**/*.css'])
        .pipe(cleanCSS({
            compatibility: 'ie11'
        }))
        .pipe(gulp.dest('./public'));
});
//压缩html
gulp.task('minify-html', () => {
    return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
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
});
//替换CDN
gulp.task('cdn', async() => {
  gulp.src('public/**/*.*')
    .pipe(replace('cdn.jsdelivr.net', 'cdn1.tianli0.top'))
    .pipe(gulp.dest('public/')),  { overwrite: true };
});

gulp.task("pac", gulp.parallel('generate-service-worker', 'cdn'));

gulp.task("zip", gulp.parallel('compress', 'minify-css', 'minify-html'));
