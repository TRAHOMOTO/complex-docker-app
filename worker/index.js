const keys = require('./keys');
const Redis = require('ioredis');

const redisClient = new Redis({
  host: keys.redisHost,
  port: keys.redisPort,
  retryStrategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index) {
  if(index < 2) {
    return 1;
  } else {
    return fib(index - 1) + fib(index - 2);
  }
}

sub.on('message', (_, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');