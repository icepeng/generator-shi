const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['tsc', 'nodemon'], () => {});

gulp.task('tsc', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
})

gulp.task('nodemon', ['tsc'], (cb) => {
    let started = false;

    return nodemon({
        script: 'dist/index.js',
        watch: ['src/**/*.ts', '!src/**/*.spec.ts'],
        ext: 'ts', 
        tasks: ['tsc'],
    }).on('start', () => {
        if (!started) {
            cb();
            started = true;
        }
    });
});
