import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.isConnected = true;
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'file_manager';

    // const connector = new MongoClient(`mongodb://${this.host}:${this.port}`);
    // connector.connect().then(() => {
    //   this.isConnected = true;
    //   this.db = connector.db(this.database);
    // }).catch((err) => {
    //   console.log(`Digho Error: ${err}`);
    // });
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    // const collection = this.db.collection(this.USERS_COLLECTION);
    // return collection.countDocuments();
    return 0;
  }

  async nbFiles() {
    // const collection = this.db.collection(this.FILES_COLLECTION);
    // return collection.countDocuments();
    return 0;
  }

  async userExist(email) {
    /**
     * @todo: Check if email exist
     */
    return false;
  }

  async newUser(email, hpass) {
    /**
     * @todo: Add new user to database
     */
    return { id: 1, email };
  }

  async getUserByEmail(email) {
    /**
     * @todo: Get user by email and send
     */
    return { id: 1, email, password: 'shjauwuhfj' };
  }

  async getUserById(id) {
    /**
     * @todo: Get user by id and send
     */
    return { id, email: 'found@to.be', password: 'shjauwuhfj' };
  }

  async getFileById(id) {
    /**
     * @todo: Get file by id
     */
    return { id, name: 'File name', type: 'type', parentId: 0, isPublic: false, data: 'File data', localPath: '/tmp/file_manger/' + id };
  }

  async newFile(file) {
    /**
     * @todo: Write code to add file document to the collection
     */
    return { id: 1, name: 'File name', type: 'type', parentId: 0, isPublic: false, data: 'File data' };
  }

  async updateFile(file) {
    /**
     * @todo: Update file document
     */
    return file;
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
