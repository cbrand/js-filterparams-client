require('babel-register');
var gulp = require('gulp');
var babel = require('gulp-babel');
var istanbul = require('gulp-babel-istanbul');
var injectModules = require('gulp-inject-modules');
var mocha = require('gulp-mocha');


// define tasks here
gulp.task('default', function(){
  // run tasks here
  // set up watch handlers here
});

gulp.task('test', function (cb) {
  gulp.src('src/**/*.js')
	.pipe(istanbul())
	.pipe(istanbul.hookRequire())
	.on('finish', function () {
	  gulp.src('test/**/*.js')
		.pipe(babel())
		.pipe(injectModules())
		.pipe(mocha())
		.pipe(istanbul.writeReports())
		.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
		.on('end', cb);
	});
});
