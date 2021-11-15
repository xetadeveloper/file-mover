const path = require('path');

// This replaces a file name beginning with the srcPath, to start with the destPath
function getDestFile(pathname, srcPath, destPath) {
  return path.resolve(destPath, getFileName(pathname, srcPath));
}

// This returns the file name of a srcPath file/directory
function getFileName(pathname, srcPath) {
  return pathname.split(`${srcPath}\\`)[1];
}

module.exports = {
  getDestFile,
  getFileName,
};
