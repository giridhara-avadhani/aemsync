'use strict'

const log = require('./log.js')
const mm = require('micromatch')
const chalk = require('chalk')
const gulp = require('gulp')
const watcher = require('gulp-watch')
const debug = require('gulp-debug');

class Watcher {

  watch (workingDir, exclude, callback) {
    log.info(`Scanning: ${chalk.yellow(workingDir)} ...`)
    gulp.src(workingDir + '**/*.*', {
      // base: './'
    })
    .pipe(debug({
      title: 'watching:'
    }))
    .pipe(watcher(workingDir + '**/*.*', {
      // base: './'
    }, (file) => {
      callback(file.path)
    }))
    log.info('Awaiting changes ...')
  }
}

module.exports = Watcher
