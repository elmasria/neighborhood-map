
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var strip = require('gulp-strip-comments');
var browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');
var removeHtmlComments = require('gulp-remove-html-comments');
var stripCssComments = require('gulp-strip-css-comments');
var cleanCSS = require('gulp-clean-css');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var reload = browserSync.reload;


gulp.task('default',['scripts','minify-html','minify-css','copy-font', 'server']);


gulp.task('clean', function () {
	return gulp.src('./dist')
	.pipe(clean({force: true}));
});

gulp.task('minify-html', function() {
	return gulp.src('./src/index.html')
	.pipe(removeHtmlComments())
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('./dist'))
	.pipe(reload({stream: true}));
});

gulp.task('scripts', function() {
	return gulp.src(['./src/vendors/jquery/jquery-2.2.3.min.js',
		'./src/vendors/bootstrap/js/bootstrap.min.js',
		'./src/vendors/knockout/knockout-3.4.0.js',
		'./src/js/app.js'])
	.pipe(concat('app.min.js'))
	.pipe(strip())
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js'))
	.pipe(reload({stream: true}));
});

gulp.task('minify-css', function () {
	return gulp.src(['./src/vendors/bootstrap/css/bootstrap.min.css',
		'./src/css/app.css'])
	.pipe(concat('app.min.css'))
	.pipe(stripCssComments({preserve: false}))
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(cssmin())
	.pipe(gulp.dest('./dist/css'))
	.pipe(reload({stream: true}));
});

gulp.task('copy-font', function(){
	gulp.src('./src/vendors/bootstrap/fonts/*')
	.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('server', function(){
	browserSync.init({
		server: {
			baseDir: './dist/'
		},
		port: 8080,
		ui: {
			port: 8000
		}
	});

	gulp.watch('./src/css/app.css',['minify-css']);
	gulp.watch('./src/index.html', ['minify-html']);
	gulp.watch('./src/js/app.js',['scripts']);
});