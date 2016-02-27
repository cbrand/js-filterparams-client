require('babel-register');
const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const istanbul = require('gulp-babel-istanbul');
const injectModules = require('gulp-inject-modules');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('gulp-browserify');
const clean = require('gulp-clean');


gulp.task('default', ['test']);

gulp.task('test', function (cb) {
    return gulp.src('src/**/*.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire(

        ))
        .on('finish', function () {
            gulp.src('test/**/*.js')
                .pipe(babel())
                .pipe(injectModules())
                .pipe(mocha())
                .pipe(istanbul.writeReports())
                .pipe(istanbul.enforceThresholds({thresholds: {global: 90}}))
                .on('end', cb);
        });
});

gulp.task('test:jenkins', function (cb) {
    return gulp.src('src/**/*.js')
        .pipe(istanbul())
        .pipe(istanbul.hookRequire(

        ))
        .on('finish', function () {
            gulp.src('test/**/*.js')
                .pipe(babel())
                .pipe(injectModules())
                .pipe(mocha({
                    "reporter": "mocha-jenkins-reporter",
                    "reporterOptions": {
                        "junit_report_name": "Tests",
                        "junit_report_path": "tests.xml",
                        "junit_report_stack": 1
                    }
                }))
                .pipe(istanbul.writeReports({
                    reporters: ['lcov', 'cobertura', 'json', 'text', 'text-summary']
                }))
                .pipe(istanbul.enforceThresholds({thresholds: {global: 90}}))
                .on('end', cb);
        });
});

gulp.task('eslint', function () {
    return gulp.src(['src/**/*.js', 'test/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('eslint:jenkins', function () {
    return gulp.src(['src/**/*.js', 'test/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format('checkstyle', fs.createWriteStream('checkstyle.xml')));
});

gulp.task('jenkins', ['eslint:jenkins', 'test:jenkins']);

gulp.task('clean', function() {
    gulp.src('lib', {read: false})
		.pipe(clean({force: true}));
});

gulp.task('compile:node', function () {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('build:node', ['clean', 'test', 'compile:node']);
