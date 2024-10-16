import { Router } from 'express';
import AppController from '../controllers/AppController';
import UserController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const basicRoutes = Router();
const userRoutes = Router();
const fileRoutes = Router();

basicRoutes.get('/status', AppController.getStatus);
basicRoutes.get('/stats', AppController.getStats);
basicRoutes.get('/connect', AuthController.getConnect);
basicRoutes.get('/disconnect', AuthController.getDisconnect);

userRoutes.post('', UserController.postNew);
userRoutes.get('/me', UserController.getMe);

fileRoutes.post('', FilesController.postUpload);
fileRoutes.get('', FilesController.getIndex);
fileRoutes.get('/:id', FilesController.getShow);
fileRoutes.put('/:id/publish', FilesController.putPublish);
fileRoutes.put('/:id/unpublish', FilesController.putUnpublish);
fileRoutes.get('/:id/data', FilesController.getFile);

module.exports = { basicRoutes, userRoutes, fileRoutes };
