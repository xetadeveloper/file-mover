const { stat, mkdir, open } = require('fs/promises');
const path = require('path');

// Checks is a file/dir exists
async function checkFileExists(path) {
  let exists = false;
  try {
    console.log('Checking for file at: ', path);
    const statObj = await stat(path);

    if (statObj.isDirectory() || statObj.isFile()) exists = true;
  } catch (err) {
    console.log(`File ${path} does not exist`);
  }

  return exists;
}

// Runs config in case the directories listed are not present before cleaning
async function configureDir(dirList) {
  console.info('Configuring dest directory..', dirList);
  await Promise.all(
    dirList.map(async dir => {
      const absPath = path.resolve(dir);
      const exists = await checkFileExists(absPath);

      console.log('File exists: ', exists);

      if (!exists) {
        if (!path.extname(absPath)) {
          // Means path is for a directory
          try {
            mkdir(absPath, { recursive: true });
          } catch (err) {
            console.error(
              'Config Error: Error occured in creating directory: ',
              err
            );

            return false;
          }
        } else {
          try {
            const handle = await open(absPath);
            await handle.close();
          } catch (err) {
            console.error(
              'Config Error: Error occured in creating file: ',
              err
            );

            if (err.code === 'ENOENT') {
              console.log('Restarting File creation.....');
              // create directories and create file again
              try {
                mkdir(path.dirname(absPath), { recursive: true }).then(
                  async dir => {
                    try {
                      console.log('Creating file again...');
                      const handle = await open(absPath, 'w');
                      await handle.close();
                    } catch (error) {
                      console.error(
                        'Error occured in creating file after directory was created: ',
                        error
                      );
                    }
                  }
                );
              } catch (err) {
                console.error(
                  'Error occured again in creating file directories: ',
                  err
                );
              }
            }
          }

          return false;
        }
      }

      return true;
    })
  );
}

module.exports = {
  checkFileExists,
  configureDir,
};
