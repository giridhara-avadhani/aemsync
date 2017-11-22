'use strict'

const minimist = require('minimist')
const path = require('path')
const fs = require('graceful-fs')
const log = require('./src/log')
const chalk = require('chalk')
const Watcher = require('./src/watcher')
const Pusher = require('./src/pusher')

const MSG_HELP = `Usage: aemsyncplus [OPTIONS]

Options:
  -t targets           Defult is http://admin:admin@localhost:4502
  -w path_to_watch     Default is current
  -e exclude_filter    Micromatch exclude filter; disabled by default
  -i sync_interval     Update interval; default is 300ms
  -p path_to_push      Specify path to prepend to existing folder structure;
                       jcr_root automatically prepended; /jcr_root/<path_to_push>
  -d                   Enable debug mode
  -h                   Displays this screen

Website: https://github.com/giridhara-avadhani/aemsync`

function aemsyncplus (args) {
  let pusher = new Pusher(args.targets.split(','), args.pushInterval, args.onPushEnd, args.workingDir, args.targetPath)
  let watcher = new Watcher()
  pusher.start()
  watcher.watch(args.workingDir, args.exclude, (localPath) => {
    pusher.enqueue(localPath)
  }, args.targetPath)
}

function main () {
  let args = minimist(process.argv.slice(2))

  // Show help.
  if (args.h) {
    console.log(MSG_HELP)
    return
  }

  // Get other args.
  log.isDebug = args.d
  let workingDir = path.resolve(args.w ? args.w : '.')

  if (!fs.existsSync(workingDir)) {
    log.info('Invalid path:', chalk.yellow(workingDir))
    return
  }

  let targets = args.t ? args.t : 'http://admin:admin@localhost:4502'
  let pushInterval = args.i ? args.i : 300
  let exclude = args.e ? args.e : '';
  let targetPath = args.p ? args.p : '';

  log.info(`
    Working dir: ${chalk.yellow(workingDir)}
        Targets: ${chalk.yellow(targets)}
       Interval: ${chalk.yellow(pushInterval)}
        Exclude: ${chalk.yellow(exclude)}
  `)

  aemsyncplus({workingDir, targets, pushInterval, exclude})
}

if (require.main === module) {
  main()
}

aemsyncplus.Watcher = Watcher
aemsyncplus.Pusher = Pusher
aemsyncplus.main = main
module.exports = aemsyncplus