/* eslint-env node, es6 */
/* eslint no-console: off */

////////////////////////////////
//        Setup              //
////////////////////////////////

// Plugins
var gulp = require('gulp'),
    pjson = require('./package.json'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    pixrem = require('gulp-pixrem'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    exec = require('child_process').exec,
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge-stream'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');


// Relative paths function
var pathsConfig = function(appName) {
    this.app = './test'; // + (appName || pjson.name);
    this.static = this.app + '/static';
    this.frontend = this.app + '/frontend';

    return {
        app: this.app,
        templates: this.app + '/templates',
        static: this.static,
        css: this.static + '/css',
        sass: this.static + '/sass',
        fonts: this.static + '/fonts',
        images: this.static + '/images',
        js: this.static + '/js',
        frontend: this.frontend,
        build: this.frontend + '/build',
        node: './node_modules',
    };
};


var paths = pathsConfig();
var tsProject = ts.createProject('tsconfig.json');
var moduleDirs = {
    'foundation-sites/**/*.scss': 'libs/foundation-sites',
    'rxjs/**/*.{js,map}': 'libs/rxjs',
    'jointjs/dist/*.{js,css,png}': 'libs/jointjs',
    'lodash/*.js': 'libs/lodash',
    'd3-ng2-service/*.{js,map}': 'libs/d3Service/',
    'd3-ng2-service/src/*.{js,map}': 'libs/d3Service/src/',
};
var modules = {
    'core-js/client/shim.min.js': 'libs/core.js',
    'zone.js/dist/zone.js': 'libs/zone.js',
    'zone.js/dist/long-stack-trace-zone.js': 'libs/long-stack-trace-zone.js',
    'systemjs/dist/system.js': 'libs/system.js',
    '@angular/core/bundles/core.umd.js': 'libs/@angular/core/bundles/core.umd.js',
    '@angular/common/bundles/common.umd.js': 'libs/@angular/common/bundles/common.umd.js',
    '@angular/compiler/bundles/compiler.umd.js': 'libs/@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser/bundles/platform-browser.umd.js': 'libs/@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js': 'libs/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http/bundles/http.umd.js': 'libs/@angular/http/bundles/http.umd.js',
    '@angular/http/bundles/http-testing.umd.js': 'libs/@angular/http/bundles/http-testing.umd.js',
    '@angular/router/bundles/router.umd.js': 'libs/@angular/router/bundles/router.umd.js',
    '@angular/forms/bundles/forms.umd.js': 'libs/@angular/forms/bundles/forms.umd.js',
    'jquery/dist/jquery.min.js': 'libs/jquery/dist/jquery.min.js',
    'jquery/dist/jquery.min.map': 'libs/jquery/dist/jquery.min.map',
    'foundation-sites/dist/js/foundation.min.js': 'libs/foundation-sites/foundation.min.js',
    'angular2-modal/bundles/angular2-modal.umd.js': 'libs/angular2-modal.umd.js',
    'angular2-modal/bundles/angular2-modal.vex.umd.js': 'libs/angular2-modal.vex.umd.js',
    'vex-js/dist/css/vex.css': 'css/vex.css',
    'vex-js/dist/css/vex-theme-plain.css': 'css/vex-theme-plain.css',
    'backbone/backbone-min.js': 'libs/backbone-min.js',
    'backbone/backbone-min.map': 'libs/backbone-min.map',
    'd3/build/d3.js': 'libs/d3.js'
};

////////////////////////////////
//        Tasks              //
////////////////////////////////

gulp.task('clean', function() {
    return del.sync(paths.build);
});


gulp.task('collectDirs', ['clean'], function() {
    var streams = [];
    Object.keys(moduleDirs).forEach(function(path) {
        streams.push(
            gulp.src(path, {'cwd': paths.node})
                .pipe(gulp.dest(moduleDirs[path], {'cwd': paths.build}))
        );
    });
    return merge(streams);
});

gulp.task('collectModules', ['clean'], function() {
    var streams = [];
    Object.keys(modules).forEach(function(path) {
        streams.push(
            gulp.src(path, {'cwd': paths.node})
                .pipe(rename(modules[path]))
                .pipe(gulp.dest(paths.build))
        );
    });
    return merge(streams);
});

gulp.task('collectAppResources', ['clean'], function() {
    return gulp.src(['**/*.html', '**/*.css'], {'cwd': paths.frontend})
        .pipe(gulp.dest(paths.build + '/app'));
});


// Collects libs from node_module
gulp.task('collect', ['collectDirs', 'collectModules', 'collectAppResources']);


// Compile TypeScript Files
gulp.task('app', ['collect'], function() {
    return gulp.src(paths.frontend + '/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build + '/app'));
});

// Javascript minification
gulp.task('scripts', function() {
    return gulp.src(paths.js + '/project.js')
        .pipe(plumber()) // Checks for errors
        .pipe(uglify()) // Minifies the js
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.js));
});

// Image compression
gulp.task('imgCompression', function() {
    return gulp.src(paths.images + '/*')
        .pipe(imagemin()) // Compresses PNG, JPEG, GIF and SVG images
        .pipe(gulp.dest(paths.images));
});

// Run django server
gulp.task('runServer', function() {
    exec('python manage.py runserver', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
});

// Browser sync server for live reload
gulp.task('browserSync', function() {
    browserSync.init(
        [paths.css + '/*.css', paths.js + '*.js', paths.templates + '*.html'], {
            proxy: 'localhost:8000',
        });
});

// Task to run ./manage.py/collectstatic
gulp.task('collectStatic', ['app'], function() {
    exec('python manage.py collectstatic --noinput', function(err, stdout, stderr) {
        console.log('Collecting static files');
        console.log(stdout);
        console.log(stderr);
    });
});

// Default task
gulp.task('default', function() {
    return runSequence(['app']);
});

////////////////////////////////
//        Watch               //
////////////////////////////////

// Watch
gulp.task('watch', ['default'], function() {

    gulp.watch(paths.sass + '/*.scss').on('change', reload);
    gulp.watch(paths.js + '/*.js', ['scripts']).on('change', reload);
    gulp.watch(paths.images + '/*', ['imgCompression']);
    gulp.watch(paths.templates + '/**/*.html').on('change', reload);

});

// Watch tasks for local development
gulp.task('watchLocal', function () {
    gulp.watch([paths.frontend + '/**/*.ts', paths.frontend + '/**/*.html', paths.frontend + '/**/*.css'], function() {
        return runSequence(['app', 'collectStatic']);
    });
    gulp.watch([paths.static + '/**/*', paths.build + '/**/*'], ['collectStatic']);
});
