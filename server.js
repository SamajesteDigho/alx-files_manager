import express from 'express';
import { basicRoutes, userRoutes, fileRoutes } from './routes/index';

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('', basicRoutes);
app.use('/users', userRoutes);
app.use('/files', fileRoutes);
