const { readdir, rm, stat, unlink } = require('fs/promises');
const path = require('path');
const { getFileName } = require('./generalUtils');

// Cleans a directory recursively
async function cleanDir(pathname) {
  // delete all files recursively
  const dirFiles = await readdir(pathname, { withFileTypes: true });

  dirFiles.forEach(file => {
    rm(path.resolve(pathname, file.name), { recursive: true }).catch(err => {
      console.log(`Error: File ${pathname} not removed: `, err);
    });
  });
}

// Cleans the dest path
async function cleanPath(pathname, destRoots, srcPath) {
  if (destRoots.includes(getFileName(pathname, srcPath))) {
    try {
      const statObj = await stat(pathname);

      if (statObj.isDirectory()) {
        await cleanDir(path);
      } else if (statObj.isFile()) {
        await unlink(pathname);
      } else {
        throw new Error('Path to clean is invalid');
      }
    } catch (error) {
      console.error('Error in reading stat in cleaning: \n\n', error.stack);
    }

    destRoots.forEach(async dir => {
      // delete all files recursively
      const dirFiles = await readdir(dir, { withFileTypes: true });

      dirFiles.forEach(file => {
        rm(path.resolve(dir, file.name), { recursive: true }).catch(err => {
          console.log(`Error: File ${dir} not removed: `, err);
        });
      });
    });
  }
}

module.exports = {
  cleanPath,
};
