import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import {
  generateUUID,
  createFile,
  checkFileExist,
  getMimeType,
} from '../utils/helper_func';

async function postUpload(req, res) {
  const token = req.headers['x-token'];
  const id = await redisClient.get(`auth_${token}`);
  const user = await dbClient.getUserById(id);
  if (user === null) {
    res.status(401).send({ error: 'Unauthorized' });
  } else {
    const { name, type, data } = req.body;
    const parentId = req.body.parentId || 0;
    const isPublic = req.body.isPublic || false;
    if (name === null) {
      res.status(400).send({ error: 'Missing name' });
    } else if (type === null || !['folder', 'file', 'image'].includes(type)) {
      res.status(400).send({ error: 'Missing type' });
    } else if (data === null && type !== 'folder') {
      res.status(400).send({ error: 'Missing data' });
    } else {
      if (parentId !== 0) {
        const parent = await dbClient.getFileById(parentId);
        if (parent == null) {
          res.status(400).send({ error: 'Parent not found' });
        } else if (parent.type !== 'folder') {
          res.status(400).send({ error: 'Parent is not a folder' });
        }
      } else {
        const file = {
          name,
          type,
          parentId,
          isPublic,
          userId: user.id,
        };
        let newFile = null;
        if (type === 'folder') {
          newFile = await dbClient.newFile(file);
        } else {
          const PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
          const filename = generateUUID();
          const content = atob(data);
          createFile(PATH, filename, content);
          file.localPath = `${PATH}/${filename}`;
          newFile = await dbClient.newFile(file);
        }
        res.status(201).send(newFile);
      }
    }
  }
}

async function getShow(req, res) {
  const token = req.headers['x-token'];
  const userID = await redisClient.get(`auth_${token}`);
  const user = await dbClient.getUserById(userID);
  if (user === null) {
    res.status(401).send({ error: 'Unauthorized' });
  } else {
    const fileID = req.params.id;
    const file = await dbClient.getFileById(fileID);
    if (file === null) {
      res.status(404).send({ error: 'Not found' });
    } else {
      res.status(200).send(file);
    }
  }
}

async function getIndex(req, res) {
  const token = req.headers['x-token'];
  const userID = await redisClient.get(`auth_${token}`);
  const user = await dbClient.getUserById(userID);
  if (user === null) {
    res.status(401).send({ error: 'Unauthorized' });
  } else {
    const parentId = req.query.parentId || 0;
    const page = parseInt(req.query.page, 10) || 0;
    /**
     * @todo: Find the list of files
     */
    const files = [parentId, page];
    res.status(200).send(files);
  }
}

async function putPublish(req, res) {
  const token = req.headers['x-token'];
  const userID = await redisClient.get(`auth_${token}`);
  const user = await dbClient.getUserById(userID);
  if (user === null) {
    res.status(401).send({ error: 'Unauthorized' });
  } else {
    const fileID = req.params.id;
    let file = await dbClient.getFileById(fileID);
    if (file === null) {
      res.status(404).send({ error: 'Not found' });
    } else {
      file.isPublic = true;
      file = await dbClient.updateFile(file);
      res.status(200).send(file);
    }
  }
}

async function putUnpublish(req, res) {
  const token = req.headers['x-token'];
  const userID = await redisClient.get(`auth_${token}`);
  const user = await dbClient.getUserById(userID);
  if (user === null) {
    res.status(401).send({ error: 'Unauthorized' });
  } else {
    const fileID = req.params.id;
    let file = await dbClient.getFileById(fileID);
    if (file === null) {
      res.status(404).send({ error: 'Not found' });
    } else {
      file.isPublic = false;
      file = await dbClient.updateFile(file);
      res.status(200).send(file);
    }
  }
}

async function getFile(req, res) {
  const fileID = req.params.id;
  const file = await dbClient.getFileById(fileID);
  if (file === null) {
    res.status(404).send({ error: 'Not found' });
  } else {
    const size = parseInt(req.query.size, 10);
    const token = req.headers['x-token'];
    const userID = await redisClient.get(`auth_${token}`);
    const user = await dbClient.getUserById(userID);
    if (!file.isPublic && user === null) {
      res.status(404).send({ error: 'Not found' });
    } else if (file.type === 'folder') {
      res.status(404).send({ error: 'A folder doesn\'t have content' });
    } else {
      if (checkFileExist(file.localPath)) {
        const mimeType = getMimeType(file.name);
        res.set('Content-Type', mimeType);
        if (size === 500 || size === 250 || size === 100) {
          res.send(`${file.localPath}_${size}`);
        } else {
          res.send(file.localPath);
        }
      } else {
        res.status(404).send({ error: 'Not found' });
      }
    }
  }
}

module.exports = {
  postUpload,
  getShow,
  getIndex,
  putPublish,
  putUnpublish,
  getFile,
};
