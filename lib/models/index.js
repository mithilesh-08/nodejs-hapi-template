import { Sequelize } from 'sequelize';
// eslint-disable-next-line import/no-extraneous-dependencies
import SequelizeMock from 'sequelize-mock';
import dbConfig from '@config/db';
import initModels from './init-models';

let sequelize;
if (process.env.NODE_ENV === 'test') {
  sequelize = new SequelizeMock();
} else {
  // eslint-disable-next-line global-require
  const { getLogger } = require('@utils');
  sequelize = new Sequelize(dbConfig.url, {
    logging: getLogger(),
    ...dbConfig,
  });
}

// eslint-disable-next-line import/prefer-default-export
export const models = initModels(sequelize);

models.sequelize = sequelize;
