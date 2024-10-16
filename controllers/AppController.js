import dbClient from '../utils/db';

function getStatus(req, res) {
  res.status(200).send({ redis: true, db: true });
}

async function getStats(req, res) {
  const nbUser = await dbClient.nbUsers();
  const nbFile = await dbClient.nbFiles();
  res.status(200).send({
    users: nbUser,
    files: nbFile,
  });
}

module.exports = { getStatus, getStats };
