// Gulpfile for Jekyll Blog

// Define variables.
var gulp         = require('gulp');
var rename       = require('gulp-rename');
var cssnano      = require('gulp-cssnano');
var postcss      = require('gulp-postcss');
var rucksack     = require('rucksack-css');
var autoprefixer = require('autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var concat       = require('gulp-concat');
var run          = require('gulp-run');
var runSequence  = require('run-sequence');
var gutil        = require('gulp-util');
var del          = require('del');
var browserSync  = require('browser-sync').create();
var reload       = browserSync.reload;
var imagemin     = require('gulp-imagemin');
//var uglify     = require('gulp-uglify');


// Include paths file.
var paths = require('./_assets/gulp_config/path');
// Supported browsers for Autoprefixer.
var supported = [
    'last 2 versions',
    'safari >= 8',
    'ie >= 10',
    'ff >= 20',
    'ios 6',
    'android 4'
];
// CSS Files for build:styles Task.
var cssFiles = [paths.cssFiles + '/normalize.css', paths.cssFiles + '/syntax.css', paths.cssFiles + '/style.css'];
/*
// Rename function for rename task.
var renameFunction = function (path) {
         path.extname = ".min.css";
         return path;
    };
// Location to store Source-maps.
var sourceMapLocation = ['css/*.css', '!css/*.min.css'];
*/
// Autoprefixer, Rucksack, Concatenate CSS Files
/*
gulp.task('build:styles', function () {
     return gulp.src(cssFiles)
       .pipe(postcss([ rucksack({autoprefixer: false}), autoprefixer({browsers: supported})]))
       .pipe(concat('main.css'))
       .pipe(gulp.dest(paths.jekyllCssFiles))
       .pipe(gulp.dest(paths.siteCssFiles))
       .on('error', gutil.log);
});
*/
gulp.task('build:styles', function() {
    gulp.src(cssFiles)
        .pipe(postcss([ rucksack({autoprefixer: false}), autoprefixer({browsers: supported})]))
        .pipe(sourcemaps.init())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(paths.jekyllCssFiles))
        .pipe(gulp.dest(paths.siteCssFiles))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano({ autoprefixer: false }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.jekyllCssFiles))
        .pipe(gulp.dest(paths.siteCssFiles))
        .pipe(browserSync.stream())
        .on('error', gutil.log);
});

/* Rename CSS
gulp.task('rename', ['styles'], function () {
     return gulp.src(['css/main.css', '!css/*.min.css'])
       .pipe(rename(renameFunction))
       .pipe(gulp.dest("css/"));
});

// Source-maps
gulp.task('sourcemap', ['rename'], function () {
     return gulp.src(sourceMapLocation)
       .pipe(sourcemaps.init())
       .pipe(sourcemaps.write('maps/'))
       .pipe(gulp.dest("css/"));
});

// Minify CSS
gulp.task('minifyCSS', ['sourcemap'], function () {
         return gulp.src('css/*.min.css')
            .pipe(cssnano({ autoprefixer: false }))
            .pipe(gulp.dest("css/"))
            .pipe(browserSync.stream());
});
*/

// Deletes CSS.
gulp.task('clean:styles', function(callback) {
    del([paths.jekyllCssFiles + '/*.css',
        paths.siteCssFiles + '/*.css',
        paths.jekyllCssFiles + '/*.map',
        paths.jekyllCssFiles + '/*.map'
    ]);
    callback();
});

// Images Task

 gulp.task('build:images', function() {
    gulp.src(paths.imageFilesGlob)
        .pipe(imagemin([
            imagemin.svgo({
                plugins: [
                    {removeViewBox: false},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest(paths.jekyllImageFiles))
        .pipe(gulp.dest(paths.siteImageFiles))
        .pipe(browserSync.stream());
});

// Deletes processed images.
gulp.task('clean:images', function(callback) {
    del([paths.jekyllImageFiles, paths.siteImageFiles]);
    callback();
});


// Scripts Task
/*
 gulp.task('build:scripts', function() {
    gulp.src(paths.jsFiles + paths.jsPattern)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.jekyllJsFiles))
        .pipe(gulp.dest(paths.siteJsFiles))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write(paths.jekyllJsFiles))
        .pipe(sourcemaps.write(paths.siteJsFiles))
        .pipe(gulp.dest(paths.jekyllJsFiles))
        .pipe(gulp.dest(paths.siteJsFiles))
        .on('error', gutil.log);
});

// Deletes processed JS.
gulp.task('clean:scripts', function(callback) {
    del([paths.jekyllJsFiles + '/*.js', paths.siteJsFiles + '/*.js']);
    callback();
});
*/

// Places fonts in proper location.
/*
gulp.task('build:fonts' , function() {
    return gulp.src(paths.fontFiles + '/**.*')
        .pipe(rename(function(path) {path.dirname = '';}))
        .pipe(gulp.dest(paths.jekyllFontFiles))
        .pipe(gulp.dest(paths.siteFontFiles))
        .pipe(browserSync.stream())
        .on('error', gutil.log);
});

// Deletes processed fonts.
gulp.task('clean:fonts', function(callback) {
    del([paths.jekyllFontFiles, paths.siteFontFiles]);
    callback();
});
*/

// Runs jekyll build command.
gulp.task('build:jekyll', function() {
    var shellCommand = 'bundle exec jekyll build --config _config.yml';

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

// Runs jekyll build command using test config.
gulp.task('build:jekyll:test', function() {
    var shellCommand = 'bundle exec jekyll build --config _config.yml,_config.test.yml';

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

// Runs jekyll build command using local config.
gulp.task('build:jekyll:local', function() {
    var shellCommand = 'bundle exec jekyll build --config _config.yml,_config.test.yml,_config.dev.yml';

    return gulp.src('')
        .pipe(run(shellCommand))
        .on('error', gutil.log);
});

// Deletes the entire _site directory.
gulp.task('clean:jekyll', function(callback) {
    del(['_site']);
    callback();
});

// Main clean task.
// Deletes _site directory and processed assets.
gulp.task('clean', ['clean:jekyll',
    'clean:styles', 'clean:images']);

// Builds site anew.
gulp.task('build', function(callback) {
    runSequence('clean',
        ['build:styles', 'build:images'],
        'build:jekyll',
        callback);
});

// BrowserSync
// Special tasks for building and then reloading BrowserSync.
gulp.task('build:jekyll:watch', ['build:jekyll:local'], function(callback) {
    browserSync.reload();
    callback();
});

/*
gulp.task('build:scripts:watch', ['build:scripts'], function(callback) {
    browserSync.reload();
    callback();
});
*/
// 'build:jekyll:local' is used for local builds.
// 'build' is used for production build.
// 'build:jekyll:local' used for test builds.
// Use `gulp serve` command to run browserSync.
// Simply `gulp` will build files.
gulp.task('serve', ['build:jekyll:local'], function () {
    // Serve files from the root of this project
    browserSync.init({
        files: [paths.siteDir + '/**'],
        server: paths.siteDir,
        port: 4000,
        ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
        logFileChanges: true,
        logLevel: 'debug',
        open: true        // Toggle to automatically open page when starting.
    });

    // Watch site settings.
    gulp.watch(['_config.yml'], ['build:jekyll:watch']);

    // Watch .css files; changes are piped to browserSync.
    gulp.watch('_assets/styles/**/*.css', ['build:styles']);

    // Watch .js files.
    //gulp.watch('_assets/scripts/**/*.js', ['build:scripts:watch']);

    // Watch image files; changes are piped to browserSync.
    gulp.watch('_assets/images/**/*', ['build:images']);

    // Watch posts.
    gulp.watch('_posts/**/*.+(md|markdown|MD)', ['build:jekyll:watch']);

    // Watch drafts if --drafts flag was passed.
    if (module.exports.drafts) {
        gulp.watch('_drafts/*.+(md|markdown|MD)', ['build:jekyll:watch']);
    }

    // Watch html and markdown files.
    gulp.watch(['**/*.+(html|md|markdown|MD)', '!_site/**/*.*'], ['build:jekyll:watch']);

    // Watch RSS feed XML file.
    gulp.watch('feed.xml', ['build:jekyll:watch']);

    // Watch data files.
    gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);

    // Watch favicon.png.
    gulp.watch('favicon.png', ['build:jekyll:watch']);
});

// Default Task: builds site.
gulp.task('default', ['build']);
