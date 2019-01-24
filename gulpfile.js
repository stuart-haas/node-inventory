const gulp = require('gulp-param')(require('gulp'), process.argv),
sass = require('gulp-sass'),
sassLint = require('gulp-sass-lint'),
minify = require('gulp-clean-css'),
autoprefixer = require('gulp-autoprefixer'),
jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
livereload = require('gulp-livereload'),
gutil = require('gulp-util'),
plumber = require('gulp-plumber'),
notify = require('gulp-notify'),
sourcemaps = require('gulp-sourcemaps'),
strip = require('gulp-strip-comments'),
debug = require('gulp-debug'),
cache = require('gulp-cached'),
changed = require('gulp-changed'),
path = require('path'),
runSequence = require('run-sequence'),
webpack = require('webpack-stream'),
nodemon = require('gulp-nodemon'),
config = require('./gulpfile.config');

config.tasks.css.path = path.join(config.root.src, config.tasks.css.src, '**/*.{'+ config.tasks.css.extensions + '}');

config.tasks.js.path = path.join(config.root.src, config.tasks.js.src, '**/*.{'+ config.tasks.js.extensions + '}');

gulp.task(config.tasks.dev.cmd, config.tasks.dev.list);

gulp.task(config.tasks.nodemon.cmd, function (done) {
    nodemon({ 
        script: config.tasks.nodemon.script,
        ext: config.tasks.nodemon.ext,
        ignore: config.tasks.nodemon.ignore
    })
    .on('restart', function () {
        console.log('restarted!');
    });
});

// css:lint
gulp.task(config.tasks.css.cmd.lint, function() {
    return gulp.src(config.tasks.css.path)
        .pipe(sassLint({
            configFile: '.sass-lint.yml'
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

// css | css --env dev | css --env prod
gulp.task(config.tasks.css.cmd.default, function(env) {
    var _env = getEnv(env);
    checkEnv(config.tasks.css.env[_env], config.tasks.css.cmd.default);
    return gulp.src([config.tasks.css.path, config.tasks.css.env[_env].exclude.join()])
        .pipe(plumber({ errorHandler: function(err) {
        notify.onError({
            title: 'Gulp error in ' + err.plugin,
            message:  err.toString()
        })(err);
        gutil.beep();
        }}))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cache('css'))
        .pipe(autoprefixer({
        browsers: [
            '> 1%',
            'last 3 versions',
            'firefox >= 4',
            'safari 7',
            'safari 8',
            'IE 8',
            'IE 9',
            'IE 10',
            'IE 11'
        ],
        cascade: false
        }))
        .pipe(minify())
        .pipe(sourcemaps.write(config.tasks.css.maps))
        .pipe(gulp.dest(config.root.dest + config.tasks.css.dest))
        .pipe(livereload())
});

// js:lint
gulp.task(config.tasks.js.cmd.lint, function() {
    return gulp.src(config.tasks.js.path)
        .pipe(jshint({
            esversion: 6,
        }))
        .pipe(jshint.reporter())
})

// js | js --env dev | js --env prod
gulp.task(config.tasks.js.cmd.default, function(env) {
    var _env = getEnv(env);
    checkEnv(config.tasks.js.env[_env], config.tasks.js.cmd.default);
    return gulp.src([config.tasks.js.path, config.tasks.js.env[_env].exclude.join()])
        .pipe(plumber({ errorHandler: function(err) {
        notify.onError({
            title: 'Gulp error in ' + err.plugin,
            message:  err.toString()
        })(err);
        gutil.beep();
        }}))
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(cache('js'))
        .pipe(sourcemaps.init())
        .pipe(strip())
        .pipe(uglify())
        .pipe(sourcemaps.write(config.tasks.js.maps))
        .pipe(gulp.dest(config.root.dest + config.tasks.js.dest))
        .pipe(livereload())
});

// watch | watch --lint | watch --lint --env dev | watch --lint --env prod
gulp.task(config.tasks.watch.cmd, function(lint, env) {
    var _env = getEnv(env);
    checkEnv(config.tasks.css.env[_env], config.tasks.css.cmd.default);
    livereload.listen();
    config.tasks.watch.list.forEach(function(key) {
        var task = config.tasks[key];
        gulp.watch([task.path, task.env[_env].exclude], function(){
            if(lint) runSequence(task.cmd.lint, task.cmd.default, runSequenceError);
            else gulp.watch([task.path, task.env[_env].exclude], [task.cmd.default]);
        });
    });
});

// default | default --lint | default --env dev | default --env prod
gulp.task(config.tasks.default.cmd, function(lint) {
    if(lint) runSequence(config.tasks.css.cmd.lint, config.tasks.js.cmd.lint, config.tasks.css.cmd.default, config.tasks.js.cmd.default, runSequenceError);
    else runSequence(config.tasks.css.cmd.default, config.tasks.js.cmd.default, runSequenceError);
});

// css:debug
gulp.task(config.tasks.css.cmd.debug, function() {
    return gulp.src(config.tasks.css.path)
        .pipe(debug({title: 'CSS Files:'}));
});

// js:debug
gulp.task(config.tasks.js.cmd.debug, function() {
    return gulp.src(config.tasks.js.path)
        .pipe(debug({title: 'JS Files:'}));   
});

// debug
gulp.task(config.tasks.debug.cmd, function() {
    runSequence(config.tasks.css.cmd.debug, config.tasks.js.cmd.debug, runSequenceError);
});

function getEnv(env) {
    var _env = env == undefined ? config.env.dev : env;
    config.env.current = _env;
    return _env;
}

function checkEnv(env, cmd) {
    if (env == undefined) {
        throw new gutil.PluginError({
            plugin: cmd,
            message: "Please specify environment: --env dev | --env prod"
        });
    }
}

function runSequenceError(err) {
    if (err) {
        var exitCode = 2;
        console.log('[ERROR] gulp build task failed', err);
        console.log('[FAIL] gulp build task failed - exiting with code ' + exitCode);
        return process.exit(exitCode);
    }
}