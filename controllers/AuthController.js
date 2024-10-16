import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { generateUUID, hashPassword } from '../utils/helper_func';

async function getConnect(req, res) {
  let bearer = req.headers.authorization || null;
  if (bearer === null) {
    res.status(401).send({ error: 'Unauthorized' });
  }
  try {
    bearer = atob(bearer.split(' ')[1]).split(':');
    const email = bearer[0];
    const password = bearer[1];
    const user = await dbClient.getUserByEmail(email);
    if (user !== null && hashPassword(password) === user.password) {
      const token = generateUUID();
      const key = `auth_${token}`;
      await redisClient.set(key, user.id, 60 * 60 * 24);
      res.status(200).send({ token });
    } else {
      res.status(401).send({ error: 'Unauthorized' });
    }
  } catch (err) {
    res.status(401).send({ error: 'Unauthorized' });
  }
}

async function getDisconnect(req, res) {
  const token = req.headers['x-token'] || null;
  const id = await redisClient.get(`auth_${token}`);
  if (id === null) {
    res.status(401).send({ error: 'Unauthorized' });
  }
  await redisClient.del(id);
  res.status(204);
}

module.exports = { getConnect, getDisconnect };
