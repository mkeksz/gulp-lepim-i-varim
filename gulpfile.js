const gulp = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
      sass = require('gulp-sass'),
      gcmq = require('gulp-group-css-media-queries'),
      cleancss = require('gulp-clean-css'),
      rename = require('gulp-rename'),
      concat = require('gulp-concat'),
      plumber = require('gulp-plumber'),
      browsersync = require('browser-sync'),
      sourcemaps = require('gulp-sourcemaps'),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      cleaner = require('gulp-clean'),
      rigger = require('gulp-rigger'),
      fileinclude = require('gulp-file-include'),
      babel = require('gulp-babel'),
      minify = require('gulp-babel-minify');


const PATH = {
    dist: { // Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    src: { // Пути откуда брать исходники
        html: 'src/html/*.html',
        js: 'src/js/*.js',
        // css: 'src/css/**/*.scss',
        css: 'src/css/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { // Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/html/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/css/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        blocks_css: 'src/blocks/**/*.scss',
        blocks_html: 'src/blocks/**/*.html',
        blocks_js: 'src/blocks/**/*.js'
    },
    clean: './dist'
};

const CONFIG = {
    server: {
        baseDir: "./dist"
    },
    tunnel: false,
    host: 'localhost',
    port: 8081,
    logPrefix: "webserver"
};

// HTML
gulp.task('html:build', function (done) {
  gulp.src(PATH.src.html)
      .pipe(plumber())
      // .pipe(rigger())
      .pipe(fileinclude({prefix: '@@', basepath: '@file'}))
      .pipe(gulp.dest(PATH.dist.html));

  done();
});

// JS
gulp.task('js:build', function (done) {
  gulp.src(PATH.src.js)
      .pipe(plumber())
      .pipe(fileinclude({prefix: '@@', basepath: '@file'}))
      // .pipe(concat('main.js'))
      .pipe(sourcemaps.init())
      .pipe(minify({
        mangle: {
          keepClassName: true
        }
      }))
      .pipe(rename(function(path) {
        path.extname = '.min.js';
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(PATH.dist.js));

  done();
});

// SASS/SCSS
gulp.task('scss:build', function (done) {
  gulp.src(PATH.src.css)
      .pipe(plumber())
      // .pipe(rigger())
      .pipe(fileinclude({prefix: '@@', basepath: '@file'}))
      // .pipe(concat('main.scss'))
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(gcmq())
      .pipe(cleancss())
      .pipe(rename(function(path) {
        path.extname = '.min.css';
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(PATH.dist.css));

  done();
});

// IMAGES
gulp.task('img:build', function (done) {
  gulp.src(PATH.src.img)
      .pipe(plumber())
      // .pipe(imagemin({
      //     progressive: true,
      //     svgoPlugins: [{removeViewBox: false}],
      //     use: [pngquant()],
      //     interlaced: true
      // }))
      .pipe(gulp.dest(PATH.dist.img));

  done();
});

// FONTS
gulp.task('fonts:build', function(done) {
  gulp.src(PATH.src.fonts)
      .pipe(plumber())
      .pipe(gulp.dest(PATH.dist.fonts));

  done();
});

// BUILDER
gulp.task('build', gulp.series('html:build',
                              'js:build',
                              'scss:build',
                              'fonts:build',
                              'img:build'));

// WATCHER
gulp.task('watch', function(done)
{
  gulp.watch(PATH.watch.html, gulp.series('html:build')).on('change', browsersync.reload);
  gulp.watch(PATH.watch.css, gulp.series('scss:build')).on('change', browsersync.reload);
  gulp.watch(PATH.watch.js, gulp.series('js:build')).on('change', browsersync.reload);
  gulp.watch(PATH.watch.img, gulp.series('img:build')).on('change', browsersync.reload);
  gulp.watch(PATH.watch.fonts, gulp.series('fonts:build')).on('change', browsersync.reload);
  gulp.watch(PATH.watch.blocks_css, gulp.series('scss:build')).on('change', browsersync.reload);
  gulp.watch(PATH.watch.blocks_html, gulp.series('html:build')).on('change', browsersync.reload);
  gulp.watch(PATH.watch.blocks_js, gulp.series('js:build')).on('change', browsersync.reload);

  done();
});

gulp.task('webserver', function (done) {
  browsersync(CONFIG);

  done();
});

gulp.task('default', gulp.series('build', 'webserver', 'watch'));
