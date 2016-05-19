
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var strip = require('gulp-strip-comments');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


gulp.task('default',['dist']);


gulp.task('dist', [
	'copy-js',
]);

gulp.task('copy-js', function(){
	gulp.src('js/**/*.js')
	.pipe(gulp.dest('dist/js'))
	.pipe(reload({stream: true}));
});

gulp.task('tes', function() {
  return gulp.src(['./vendors/jquery/jquery-2.2.3.min.js.js',
  	'./vendors/bootstrap/js/bootstrap.min.js',
  	'./vendors/knockout/knockout-3.4.0.js',
  	'./js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('compress', function() {
  return gulp.src('./js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
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
});