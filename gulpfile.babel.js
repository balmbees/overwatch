import gulp from 'gulp';
// import gulpMocha from 'gulp-mocha';
// import runSequence from 'run-sequence';
import gulpClean from 'gulp-clean';
import babel from 'gulp-babel';
import gulpSourcemaps from 'gulp-sourcemaps';
import childProcess from 'child_process';

// Atomic Tasks
gulp.task('clean', () => {
  const task = gulp.src('dst')
                   .pipe(gulpClean());
  return task;
});
gulp.task('build', () => {
  gulp.src('src/**/*.js')
    .pipe(gulpSourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest('dst'));

  return gulp.src('src/**/*.json')
           .pipe(gulp.dest('dst'));
});

gulp.task('pack', (cb) => {
  const exec = childProcess.exec;
  exec(`
    cp package.json dst/package.json &&
    cd dst &&
    npm install --production &&
    zip -r ../dst.zip . **
  `, { maxBuffer: 1024 * 1024 * 20 /* 20MB */}, (error) => {
    cb(error);
  });
});

// gulp.task('test.build', () =>
//   gulp.src('test/**/*.js')
//     .pipe(babel({ presets: ['es2015'] }))
//     .pipe(gulp.dest('dst/test'))
// );
//
// gulp.task('test.run', () =>
//   gulp.src('dst/test/**/*.js', {read: false})
//     .pipe(gulpMocha())
// );

// Combined Tasks
gulp.task('test', () => {
  runSequence('clean', 'build', 'test.build', 'test.run');
});
