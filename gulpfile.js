var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    artTemplate = require('gulp-arttemplate'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    requirejs = require('gulp-requirejs'),
    uglify = require('gulp-uglify'),
    amdOptimize = require('amd-optimize'),
    concat = require('gulp-concat'),
    webpack = require('gulp-webpack'),
    extend = require('gulp-multi-extend');

gulp.task('build', function() {
    return requirejs({
        name: 'index.js',
        baseUrl: __dirname + '/src/',
        out: 'papapa.js'
    })
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('buildwebpack', function() {
    gulp.src(__dirname + '/src/index.js')
        .pipe(webpack(require(__dirname + '/webpack.config.js')))
        .pipe(gulp.dest(__dirname + '/dist/'));
});

gulp.task('bundle', function () {
  return gulp.src('./src/**/*.js')
    .pipe(amdOptimize('index'))
    .pipe(concat('papapa.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('produceIndex', function() {
    gulp.src(path.join(__dirname, '/src/build.json'))
        .pipe(extend('./package.json'))
        .pipe(artTemplate(fs.readFileSync(__dirname + '/src/index.tmpl')))
        .pipe(rename('index.js'))
        .pipe(gulp.dest(__dirname + '/src'));
});

gulp.task('watch', function() {
    gulp.watch(['./package.json', './src/index.tmpl', './src/*/*.js', './src/build.json'], ['produceIndex']);
});

gulp.task('default', ['watch']);