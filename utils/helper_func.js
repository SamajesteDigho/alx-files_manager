import crypto from 'crypto';
import fs from 'fs';
import mimeType from 'mime-types';

function hashPassword(pass) {
  const hash = crypto.createHash('sha1');
  hash.update(pass);
  return hash.digest('hex');
}

function generateUUID() {
  return crypto.randomUUID();
}

function createFile(dir, filename, content) {
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) {
      console.log(`Error creating the folder: ${err}`);
    } else {
      console.log('Folder created');
    }
  });
  return fs.writeFile(`${dir}/${filename}`, content, (err) => {
    let state = false;
    if (err) {
      console.log(`Error: Saving file ${err}`);
      state = false;
    } else {
      console.log(`File succesfully created at ${dir}/${filename}`);
      state = true;
    }
    return state;
  });
}

function checkFileExist(path) {
  let state = false;
  try {
    if (fs.accessSync(path)) {
      state = true;
    } else {
      state = false;
    }
  } catch (err) {
    state = false;
  }
  return state;
}

function getMimeType(filename) {
  return mimeType.lookup(filename);
}

module.exports = {
  hashPassword,
  generateUUID,
  createFile,
  checkFileExist,
  getMimeType,
};
