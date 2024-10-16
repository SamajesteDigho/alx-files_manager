import Queue from 'bull';
import imageThumbnail from 'image-thumbnail';
import fs from 'fs';
import dbClient from './utils/db';
import redisClient from './utils/redis';

const filePath = process.env.FOLDER_PATH;
const fileQueue = new Queue('fileQueue', filePath, { redis: redisClient });

fileQueue.process(async (job, done) => {
  const { userId } = job.data.userId;
  const fileId = job.data.id;

  if (fileId === null) {
    throw new Error('Missing fileId');
  }
  if (userId === null) {
    throw new Error('Missing userId');
  }
  const file = dbClient.getFileById(fileId);
  if (file === null || file.userId !== userId) {
    throw new Error('File not found');
  }

  const imageSize = [500, 250, 100];
  imageSize.forEach(async (width) => {
    const thumbnailpath = `${file.localPath}_${width}`;
    try {
      const buffer = await imageThumbnail(file.localPath, { width });
      await fs.writeFile(thumbnailpath, buffer);
    } catch (err) {
      console.log('Could not save');
    }
  });
  done();
});
