var gulp = require('gulp');
var fileInclude = require("gulp-file-include");
var exec = require('child_process').exec;
var minifyCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var stylus = require('gulp-stylus');
var clean = require('gulp-clean');

var src = "src" //源代码目录
var paths = {
    html: [
        src + "/*.html"
    ],
    html_modules: [
        src + "/html/**/*.html"
    ],
    images: [
        src + "/images/*"
    ],
    js: [
        src + "/js/**/*.js"
    ],
    sass: [
        src + "/sass/**/*.scss"
    ],
    stylus: [
        src + "/styl/**/*.styl"
    ],
    font: [
        src + "/fonts/*.ttf"
    ]
};

var output = ".temp" // 文件构建输出地址
var dist = "dist" // dist目录

/**
 *  Task
 */
gulp.task('images', function() {
    gulp.src(paths.images)
        .pipe(gulp.dest(output + "/images"));
});

gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(fileInclude())
        .pipe(gulp.dest(output));
});

gulp.task('js', function() {
    gulp.src(paths.js)
        .pipe(gulp.dest(output + "/js"));
});

gulp.task('font', function() {
    gulp.src(paths.font)
        .pipe(gulp.dest(output + "/css/fonts"));
});

gulp.task('sass', function() {
    gulp.src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(output + '/css'));
});

gulp.task('stylus', function() {
    gulp.src(paths.stylus)
        .pipe(stylus())
        .on('error', function(err) {
            console.log('Stylus Error!', err.message);
            this.end();
        })
        .pipe(gulp.dest(output + '/css'));
});

// =============压缩合并build资源============== //
gulp.task('dist', ['run.dist'], function() {

    gulp.src(dist + "/*")
        .pipe(clean({force: true}));

    gulp.src(output+"/*.html")
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulpif('*.js', uglify({
            mangle: false
        })))
        .pipe(useref())
        .pipe(gulp.dest(dist));

    gulp.src('src/styl/**/*.mini.styl')
        .pipe(stylus())
        .on('error', function(err) {
            console.log('Stylus Error!', err.message);
            this.end();
        })
        .pipe(minifyCss())
        .pipe(gulp.dest(dist + '/css'));

//    gulp.src(dist + '/temp/*.css')
//        .pipe(minifyCss())
//        .pipe(gulp.dest(dist + '/css'));

    gulp.src(paths.font)
        .pipe(gulp.dest(dist+"/css/fonts"));

    gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(dist+"/images"));

});

gulp.task('run.dist', function() {
    exec("node ./app.js /dist", function(err, stdout, stderr) {
        console.log(stdout);
        if (err) console.log("start server error:" + err);
    });
});

gulp.task('run.build', function() {
    exec("node ./app.js /.temp", function(err, stdout, stderr) {
        console.log(stdout);
        if (err) console.log("start server error:" + err);
    });
});

// 默认构建
gulp.task('default', ['images', 'sass', 'stylus', 'html', 'js', 'font', 'run.build'], function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.stylus, ['stylus'])
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.html_modules, ['html']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.js, ['js']);
});
