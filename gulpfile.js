const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const addsrc = require('gulp-add-src');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');
const minify = require('gulp-minify')
const strip = require('gulp-strip-comments');
const browserSync = require('browser-sync').create();

gulp.task('js-compile-docs', function(){
    return gulp.src(['./js/jquery-3.2.1.min.js', './js/popper.min.js', './js/bootstrap.js', './js/mdb.js', 'js/docs/prism.js', 'js/docs/jquery-validate.js', 'js/docs/theme_scripts.js'])
        .pipe(concat('compiled.js'))
        .pipe(gulp.dest('./js'));
});

gulp.task('css-compile', function() {
    gulp.src('scss/**/*.scss')
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css/'));
});

gulp.task('css-compile-free', function() {
    gulp.src('scss/mdb-free.scss')
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(rename('mdb.css'))
        .pipe(gulp.dest('./free/css/'));
});

gulp.task('css-compile-docs', function() {
  gulp.src(['./css/bootstrap.css', './css/mdb.css', './css/docs/prism.css', './css/docs/style.css', './css/docs/fa.css', './css/docs/dwqa.css'])
    .pipe(concat('compiled.css'))
    .pipe(gulp.dest('./css'));
});

gulp.task('css-minify', function() {
    gulp.src('css/mdb.css')
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('css'))
});

gulp.task('css-minify-free', function() {
    gulp.src('free/css/mdb.css')
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('free/css'))
});

gulp.task('css-minify-docs', function() {
    gulp.src('css/compiled.css')
      .pipe(cleanCSS({level: {1: {specialComments: 0}}}, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      }))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('css'))
});

gulp.task('bs', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            directory: true
        },
        notify: false
    });

    gulp.watch("./**/*.html").on('change', browserSync.reload);
});

gulp.task('build-js', function() {
    gulp.src(['js/modules/_intro-mdb-pro.js', './js/modules/vendor/jquery.easing.js', './js/modules/vendor/velocity.min.js', './js/modules/vendor/chart.js', './js/modules/vendor/wow.js', './js/modules/dist/scrolling-navbar.js', './js/modules/vendor/waves.js', './js/modules/dist/forms-free.js', './js/modules/dist/preloading.js', './js/modules/dist/cards.js', './js/modules/dist/character-counter.js', './js/modules/vendor/toastr.js', './js/modules/dist/smooth-scroll.js', './js/modules/dist/dropdown.js', './js/modules/dist/buttons.js', './js/modules/vendor/hammer.js', './js/modules/vendor/jquery.hammer.js', './js/modules/dist/sidenav.js', './js/modules/dist/collapsible.js', './js/modules/vendor/jquery.easypiechart.js', './js/modules/dist/range-input.js', './js/modules/dist/file-input.js', './js/modules/dist/material-select.js', './js/modules/vendor/picker.js', './js/modules/vendor/picker-date.js', './js/modules/vendor/picker-time.js', './js/modules/vendor/lightbox.js', './js/modules/vendor/jquery.sticky.js', './js/modules/vendor/scrollbar.js', './js/modules/dist/chips.js', './js/modules/vendor/jarallax.js', './js/modules/vendor/jarallax-video.js', './js/modules/dist/mdb-autocomplete.js', 'js/modules/vendor/enhanced-modals.js'])
        .pipe(concat('mdb.js'))
        .pipe(gulp.dest('./js/'))
});

gulp.task('build-free-js', function() {
    gulp.src(['js/modules/_intro-mdb-free.js', './js/modules/vendor/jquery.easing.js', './js/modules/vendor/velocity.min.js', './js/modules/vendor/chart.js', './js/modules/vendor/wow.js', './js/modules/dist/scrolling-navbar.js', './js/modules/vendor/waves.js', './js/modules/dist/forms-free.js',  'js/modules/vendor/enhanced-modals.js'])
        .pipe(concat('mdb.js'))
        .pipe(gulp.dest('./free/js'))
});

gulp.task('js-minify', function() {
  gulp.src('js/mdb.js')
    .pipe(minify({
        ext:{
            src:'.js',
            min:'.min.js'
        },
    }))
    .pipe(gulp.dest('js'))
});

gulp.task('js-minify-free', function() {
  gulp.src('free/js/mdb.js')
    .pipe(minify({
        ext:{
            src:'.js',
            min:'.min.js'
        },
    }))
    .pipe(gulp.dest('free/js'))
});

gulp.task('js-minify-docs', function() {
  gulp.src('js/compiled.js')
    .pipe(minify({
        ext:{
            src:'.js',
            min:'.min.js'
        },
    }))
    .pipe(gulp.dest('js'))
});

gulp.task('default',function() {
    gulp.watch('scss/**/*.scss',['css-compile']);
});
