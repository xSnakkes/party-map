const dotenv = require('dotenv');

dotenv.config();

const sslOptions = {
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  },
};

const sharedConfig = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  dialect: 'postgres',
  define: {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    lastUpdated: 'last_updated',
    lastUpdatedBy: 'last_updated_by',
  },
  migrationStorageTableName: 'sequelize_meta',
};

module.exports = {
  development: {
    ...sharedConfig,
    ...sslOptions,
  },
  staging: sharedConfig,
  production: {
    ...sharedConfig,
    ...sslOptions,
  },
};
