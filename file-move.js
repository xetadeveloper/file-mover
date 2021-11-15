const path = require('path');
const watchFile = require('./watchFile');
const { stat } = require('fs/promises');
const config = require('../move.config');
const { destPath, srcPath, includes } = config;

// Check Functions
const { configureDir } = require('./utils/checkFile');
const { cleanPath } = require('./utils/cleanUtils');
const { moveDir, moveFile } = require('./utils/moveUtils');
const { getDestFile } = require('./utils/generalUtils');

// use environment variables to get whether file should be copied or moved: copied by default
// Have an option for cleaning the root directories

if (!config.debugMode) {
  console.log = () => {};
}

// Absolute paths of root folders that should be present in the watched folder Where files will be copied from
const srcRoots = includes.map(folderName => path.resolve(srcPath, folderName));

// Absolute paths of dest folders where files will be copied to
const destRoots = includes.map(folderName =>
  path.resolve(destPath, folderName)
);

// This function moves the files to dest folder
async function buildFiles(srcPath, destPath) {
  console.log(`Copying files from ${srcPath} to ${destPath}...`);

  try {
    const statObj = await stat(srcPath);

    if (statObj.isDirectory()) {
      console.log('Moving directory: ', srcPath);
      moveDir(srcPath, destPath);
    } else if (statObj.isFile()) {
      console.log('Moving file: ', srcPath);
      moveFile(srcPath, destPath);
    }
  } catch (error) {
    console.error('Error in reading stat: ', error);
  }
}

// Function to run the copy process
async function runMove(srcPath, destPath) {
  if (config.cleanDir) {
    console.info('Cleaning Build Path....');
    await cleanPath(destPath, destRoots, srcPath);
  }

  await buildFiles(srcPath, destPath);
}

// Start the run of the program
configureDir(destRoots).then(() => {
  watchFile(srcRoots, {
    addFile: async pathname => {
      await runMove(pathname, getDestFile(pathname, srcPath, destPath));
    },
    addDir: async pathname => {
      await runMove(pathname, getDestFile(pathname, srcPath, destPath));
    },
    error: err => {
      console.error('Error in watching file: ', err);
    },
    changedFile: async pathname => {
      await runMove(pathname, getDestFile(pathname, srcPath, destPath));
    },
    deletedFile: async pathname => {
      await runMove(pathname, getDestFile(pathname, srcPath, destPath));
    },
    deletedDir: async pathname => {
      await runMove(pathname, getDestFile(pathname, srcPath, destPath));
    },
  });
});
