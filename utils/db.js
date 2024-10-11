import { MongoClient } from 'mongodb';

class DBClient {
  USERS_COLLECTION = 'users';
  FILES_COLLECTION = 'files';
  constructor() {
    this.isConnected = false;
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'file_manager';

    const connector = new MongoClient(`mongodb://${this.host}:${this.port}`);
    connector.connect().then(() => {
      this.isConnected = true;
      this.db = connector.db(this.database);
    }).catch((err) => {
      console.log(`Digho Error: ${err}`);
    });
  }

  isAlive() {
    return this.isConnected;
  }
  
  async nbUsers() {
    const collection = this.db.collection(this.USERS_COLLECTION);
    return collection.countDocuments();
  }

  async nbFiles() {
    const collection = this.db.collection(this.FILES_COLLECTION);
    return collection.countDocuments();
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
