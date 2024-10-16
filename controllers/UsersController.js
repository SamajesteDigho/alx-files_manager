import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { hashPassword } from '../utils/helper_func';

async function postNew(req, res) {
  const email = req.body.email || null;
  const password = req.body.password || null;

  if (email === null) {
    res.status(400).send({ error: 'Missing email' });
  } else if (password === null) {
    res.status(400).send({ error: 'Missing password' });
  } else if (await dbClient.userExist(email)) {
    res.status(400).send({ error: 'Already exist' });
  } else {
    const hpass = hashPassword(password);
    const user = await dbClient.newUser(email, hpass);
    res.status(201).send({ id: user.id, email: user.email });
  }
}

async function getMe(req, res) {
  const token = req.headers['x-token'];
  const id = await redisClient.get(`auth_${token}`);
  if (id === null) {
    res.status(401).send({ error: 'Unauthorized' });
  } else {
    const user = await dbClient.getUserById(id);
    if (user !== null) {
      res.status(200).send({ id: user.id, email: user.email });
    } else {
      res.status(400).send({ error: 'User not found' });
    }
  }
}

module.exports = { postNew, getMe };
