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
    gulp.src(['js/modules/_intro-mdb-pro.js', './js/modules/vendor/jquery.easing.js', './js/modules/vendor/velocity.min.js', './js/modules/vendor/chart.js', './js/modules/vendor/wow.js', './js/modules/dist/scrolling-navbar.js', './js/modules/vendor/waves.js', './js/modules/dist/forms-free.js', './js/modules/dist/preloading.js', './js/modules/dist/cards.js', './js/modules/dist/character-counter.js', './js/modules/vendor/toastr.js', './js/modules/dist/smooth-scroll.js', './js/modules/dist/dropdown.js', './js/modules/dist/buttons.js', './js/modules/vendor/hammer.js', './js/modules/vendor/jquery.hammer.js', './js/modules/dist/sidenav.js', './js/modules/dist/collapsible.js', './js/modules/vendor/jquery.easypiechart.js', './js/modules/dist/range-input.js', './js/modules/dist/file-input.js', './js/modules/dist/material-select.js', './js/modules/vendor/picker.js', './js/modules/vendor/picker-date.js', './js/modules/vendor/picker-time.js', './js/modules/vendor/lightbox.js', './js/modules/vendor/jquery.sticky.js', './js/modules/vendor/scrollbar.js', './js/modules/dist/chips.js', './js/modules/vendor/jarallax.js', './js/modules/vendor/jarallax-video.js', './js/modules/dist/mdb-autocomplete.js', 'js/modules/vendor/enhanced-modals.js'])
        .pipe(concat('mdb-experimental.js'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('build-free-js', function() {
    gulp.src(['js/modules/_intro-mdb-free.js', './js/modules/vendor/jquery.easing.js', './js/modules/vendor/velocity.min.js', './js/modules/vendor/chart.js', './js/modules/vendor/wow.js', './js/modules/dist/scrolling-navbar.js', './js/modules/vendor/waves.js', './js/modules/dist/forms-free.js',  'js/modules/vendor/enhanced-modals.js'])
        .pipe(concat('mdb-free.js'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['styles']);
});