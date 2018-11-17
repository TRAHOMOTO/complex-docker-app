module.exports = {
  serverPort: Number(process.env.PORT || '3000'),
  redisHost: (process.env.REDIS_HOST || 'localhost'),
  redisPort: Number(process.env.REDIS_PORT || '6379'),
  pgUser: process.env.PGUSER,
  pgPassword: process.env.PGPASSWORD,
  pgHost: (process.env.PGHOST || 'localhost'),
  pgPort: Number(process.env.PGPORT || '5432'),
  pgDatabase: process.env.PGDATABASE,
};