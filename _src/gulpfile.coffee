gulp = require('gulp')
coffee = require('gulp-coffee')
notify = require("gulp-notify")
plumber = require('gulp-plumber')
sourcemaps = require('gulp-sourcemaps')
watch = require('gulp-watch')

path = {
  dest: '../'
  js: '../demo/js/' 
  coffee: './'
}



###
------------------------------------------------------------
PC CoffeeScript
------------------------------------------------------------
###

# ------------------------------
# INDEX
# ------------------------------
gulp.task 'coffee', () ->
  gulp.src([
    path.coffee + 'jquery.SlideCounter.coffee'
  ])
  .pipe(plumber(
    errorHandler: notify.onError('<%= error.message %>')
  ))
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(coffee())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(path.js))
  .pipe(gulp.dest(path.dest))

###
------------------------------------------------------------
watch
------------------------------------------------------------
###





gulp.task 'watch_coffee', () ->
  gulp.watch [path.coffee + '*.coffee'],['coffee']


gulp.task 'default', ['watch_coffee']