let gulp = require('gulp'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    server = require('gulp-webserver'),
    livereload = require('gulp-livereload'),
    cleanCSS = require('gulp-clean-css'),
    mustache = require("gulp-mustache"),
    htmlValidator = require('gulp-w3c-html-validator'),
    imagemin = require('gulp-imagemin'),
    sitemap = require('gulp-sitemap'),
    save = require('gulp-save');

//server start
gulp.task('server', () => {
    gulp.src('app')
        .pipe(server({
            livereload: true,
            open: true,
            port: 9900
        }));
});

//images processing
gulp.task('img', () => {
    gulp.src('src/img/**/*.*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [
                {
                    removeViewBox: true
                }
            ]
        }))
        .pipe(gulp.dest('app/img'));
});

gulp.task('validateHtml', () => {
    gulp.src('app/*.html')
        .pipe(htmlValidator())
        .pipe(htmlValidator.reporter());
});

//css generation
gulp.task('css', () => {
    return gulp.src('src/css/**/*.css')
        .pipe(cleanCSS({compatibility: 'ie8', rebase: false}))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(gulp.dest('app/css'))
        .pipe(livereload());
});

//js generation
gulp.task('js', () => {
    return gulp.src([
        'src/js/**/*.js'
    ])
        .pipe(concat('script.min.js'))
        // .pipe(uglify().on('error', function (e) {
        //     console.log(e);
        // }))
        .pipe(gulp.dest('app/js'))
        .pipe(livereload());
});

//html generation from mustache
gulp.task('html', () => {
    return gulp.src(["src/templates/**/*.html", "src/templates/**/*.mustache"])
        .pipe(mustache('data.json', {}, {}))
        .pipe(gulp.dest("app"))
        .pipe(livereload());
});

//generates sitemap
gulp.task('sitemap', () => {
    gulp.src('app/*.html', {
        read: false
    })
        .pipe(sitemap({
            siteUrl: 'http://www.recipes.de'
        }))
        .pipe(gulp.dest('./app'));
});

//copy fonts
gulp.task('fonts', () => {
    gulp.src('src/css/webfonts/**/*.*')
        .pipe(gulp.dest('app/css/webfonts'));
});

//watch task
gulp.task('watch', gulp.series(gulp.parallel('css', 'js', 'html'), (done) => {
    livereload.listen();
    gulp.watch('src/css/*.css', gulp.parallel('css'));
    gulp.watch('src/js/*.js', gulp.parallel('js'));
    gulp.watch('src/templates/**/*.*', gulp.parallel('html'));
    done();
}));

//validation of html
gulp.task('validate-html', gulp.series('validateHtml'));

//validation of html
gulp.task('build', gulp.series('css', 'js', 'html', 'img', 'fonts'));

//default task which is running simply from command line with gulp
gulp.task('default', gulp.series('watch', 'server'));
