# File-Watch-Mover

A lightweight file watcher and copier.

## Overview

---

File mover was created to watch directories and copy the files in specified directories to the destination as-is.

This tool is useful when you want to watch certain directories, and when any file is updated in those directories, those files are copied over to the destination directories, retaining the same structure as in the source directory.

## Getting Started

---

Install using

    npm install --save file-watch-mover

or

    npm install --save-dev file-watch-mover

to save as a dev dependency

## Usage

---

This package uses a configuration file to operate properly.

### Steps

1.  Create a config file in the root of your project named move.config.js that exports the config object.

    A sample config file is

        const path = require('path');

        const destPath = path.resolve(__dirname, 'src');
        const srcPath = path.resolve(__dirname, 'src/static');

        module.exports = {
        // If you want to see comments
        debugMode: false,

        // Should destination directory be cleaned before each copy
        cleanDir: true,

        // The destination to copy files to
        destPath,

        // The root of the folder that will be watched
        srcPath,

        // The folders you want files to be copied from and replicated in destPath
        // This path is relative to srcPath and is mandatory to be included in config file
        includes: ['_includes', '_layouts'],
        };

    Set the source to be watched and the destination to be copied to in the config file. Other options are elaborated on below.

2.  run in the terminal

        npx file-watch-mover

    this starts the watching process and doesn't terminate till you kill the terminal.

## Configuration

---

| Options   | Type             | Description                                                                        |
| --------- | ---------------- | ---------------------------------------------------------------------------------- |
| srcPath   | {String}         | The path to the root folder of the files/folders that will be watched.             |
| destPath  | {String}         | The path to the destination folder where the files/folders that will be copied to. |
| cleanDir  | {String}         | Specifies whether the directory should be cleaned.                                 |
| includes  | {String Array} | Relative paths from the source to files/directories that should be watched.        |
| debugMode | {Boolean}        | Enables the comments in the build process                                          |

## People

---

The original author and lead maintainer of File-Watch-Mover is F. Etese.
