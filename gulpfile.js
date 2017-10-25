const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const addsrc = require('gulp-add-src');
const browserSync = require('browser-sync').create();

gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css/'));
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
    gulp.src(['./js/modules/_intro-mdb-free.js', './js/modules/vendor/jquery.easing.js', './js/modules/vendor/velocity.min.js', 'js/modules/vendor/chart.js', 'js/modules/scrolling-navbar.js', 'js/modules/vendor/waves.js', 'js/modules/dist/forms-free.js'])
        .pipe(concat('mdb-experimental.js'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['styles']);
});
