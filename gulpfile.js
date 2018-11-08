var gulp         = require('gulp');
var sass         = require('gulp-sass');
var cleanCSS     = require('gulp-clean-css');
var notify       = require("gulp-notify");
var rename       = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var babel        = require('gulp-babel');
var pug          = require('gulp-pug');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false,
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  });
});

gulp.task('pug', function() {
  return gulp.src("app/pug/**/*.pug")
    .pipe(pug())
    .pipe(gulp.dest("app"))
    .pipe(browserSync.stream());
});

gulp.task('htmlbeautify', ['pug'], function() {
  var options = {
    indentSize: 2,
    unformatted: [
      // https://www.w3.org/TR/html5/dom.html#phrasing-content
      'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
      'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript',
      'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'small',
      'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
      'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'
    ]
  };
  gulp.src('./*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('app'))
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleanCSS()) // Опционально, закомментировать при отладке
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
});

gulp.task('es6', function() {
  return gulp.src('app/es6/common.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream())
});

gulp.task('js', ['es6'], function() {
  return gulp.src([
    'app/js/common.min.js', // Всегда в конце
  ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify()) // Минимизировать весь js (на выбор)
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', ['htmlbeautify', 'sass', 'js', 'browser-sync'], function() {
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch(['app/js/**/*.js'], ['js']);
  gulp.watch('app/pug/**/*.pug', browserSync.reload);
});

gulp.task('default', ['watch']);