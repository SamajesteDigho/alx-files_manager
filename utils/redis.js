import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.log(`Error: ${err.message}`);
    });

  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const res = await promisify(this.client.get).bind(this.client)(key);
    return res;
  }

  async set(key, value, duration) {
    await promisify(this.client.set).bind(this.client)(key, value, 'EX', duration);
  }

  async del(key) {
    await promisify(this.client.del).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
