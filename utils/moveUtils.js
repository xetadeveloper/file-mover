const path = require('path');
const { readdir, mkdir, copyFile } = require('fs/promises');
const { checkFileExists } = require('./checkFile');

// Function to move files in a directory
async function moveDir(srcDir, destDir) {
  try {
    const files = await readdir(srcDir, { withFileTypes: true });
    console.log('Files found: ', files);

    await Promise.all(
      files.map(async file => {
        if (file.isDirectory()) {
          console.log(`File ${file.name} is directory: `, true);

          const destSubDir = path.resolve(destDir, file.name);
          const srcSubDir = path.resolve(srcDir, file.name);

          mkdir(destSubDir, { recursive: true })
            .then(() => {
              moveDir(srcSubDir, destSubDir);
            })
            .catch(err => {
              console.error(
                `Error occured in creating directory ${destSubDir}: `,
                err
              );
            });
        } else {
          const src = path.resolve(srcDir, file.name);
          const dest = path.resolve(destDir, file.name);
          moveFile(src, dest);
        }

        return true;
      })
    );

    console.info('Copy finished....');
  } catch (err) {
    console.error('Error: ', err);
  }
}

// Moves a file from srcPath to destPath and creates directories if they don't exist
async function moveFile(srcPath, destPath) {
  let copyCount = 0;
  // copy file to destination
  async function move() {
    try {
      await copyFile(srcPath, destPath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error(`Error in file copy attempt ${copyCount}: `, err.code);
        console.info('Restarting Copy.....');
        // create directories and copy again
        if (await checkFileExists(path.dirname(destPath))) {
          console.log('Directory exists, so another issue caused the error');
        } else {
          console.log(`Creating the directory ${destPath} for file copy...`);
          if (copyCount < 5) {
            mkdir(destPath, { recursive: true }).then(async () => {
              copyCount++;
              move();
            });
          }
        }
      } else {
        console.error('Error occured in file move operation: ', err);
      }
    }
  }

  move();
}

module.exports = {
  moveDir,
  moveFile,
};
