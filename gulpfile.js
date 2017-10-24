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

gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['styles']);
});
