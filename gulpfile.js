var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var run = require('gulp-run');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');

function reportChange(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('build-html', function() {
  gulp.src(['./src/html/**/*.html', '!./src/html/layout.html'])
      .pipe(wrap({src: './src/html/layout.html'}))
      .pipe(gulp.dest('./'));
});

gulp.task('build-sass', function() {
  gulp.src('src/css/**/*.scss')
      .pipe(sass())
      .pipe(concat('app.css'))
      .pipe(gulp.dest('dest/css'));
});

gulp.task('build-js', function() {
  run('jspm bundle-sfx src/js/main dest/js/app.js').exec();
});

gulp.task('build', ['build-sass', 'build-html']);

gulp.task('serve', ['build'], function(done) {
  browserSync({
    open: false,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});

gulp.task('watch', ['serve'], function() {
  gulp.watch(['src/html/**/*.html','src/js/**/*.js', 'src/css/**/*.scss'], ['build', browserSync.reload]).on('change', reportChange);
});

gulp.task('default', ['build']);
