const chokidar = require('chokidar');

function watchFile(paths, options) {
  const watcher = chokidar.watch(paths, {
    persistent: true,
    ignored: /(^|[\/\\])\../, //for ignoring dotfiles
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 100,
    },
  });

  // console.log('Options: ', options);

  watcher.on('add', async path => {
    console.log(`File added  ${path} ....`);
    options.addFile && options.addFile(path);
  });

  watcher.on('addDir', async path => {
    console.log(`Directory added ${path}....`);
    options.addDir && options.addDir(path);
  });

  watcher.on('error', error => {
    console.log('Error occured in watcher: ', error);
    options.error && options.error(error);
  });

  watcher.on('change', async path => {
    console.log(`File changed ${path}....`);
    options.changedFile && options.changedFile(path);
  });

  watcher.on('unlink', async path => {
    console.log(`File deleted ${path}....`);
    options.deletedFile && options.deletedFile(path);
  });

  watcher.on('unlinkDir', async path => {
    console.log(`Directory deleted ${path}....`);
    options.deletedDir && options.deletedDir(path);
  });
}

module.exports = watchFile;
