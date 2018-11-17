const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase,
  host: keys.pgHost,
  port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));
pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(console.log);

// Redis Client Setup
const Redis = require('ioredis');
const redisClient = new Redis({
  host: keys.redisHost,
  port: keys.redisPort,
  retryStrategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/', (req, res) => res.send('Hi'));

app.get('/values/all', async (_, res) => {
  const values = await pgClient.query('SELECT * FROM values');
  res.send(values.rows);
});

app.get('/values/current', async (_, res) => {
  const values = await redisClient.hgetall('values');
  res.send(values);
});

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 42) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true});
});


// Rock'n'Roll
const server = app.listen(keys.serverPort, () =>{
  console.log('~~~~~~~~~~~~~~~~~~~ API started on: %s ~~~~~~~~~~~~~~~', server.address().port)
});