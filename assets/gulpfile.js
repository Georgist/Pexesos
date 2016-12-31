var gulp = require('gulp');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-ruby-sass');

//
gulp.task('styles', function () {
    return sass('sass/**/*.scss')
        .on('error', sass.logError)
        .pipe(autoprefixer({browsers: ['last 2 versions','ie 9', 'android 4', 'ios 6'], cascade: true}))
        .pipe(gulp.dest('./../public/css/'));
});

// Watch task
gulp.task('default', function() {
    gulp.watch('sass/**/*.scss', ['styles']);
});