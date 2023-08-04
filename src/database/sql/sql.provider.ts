import { Sequelize } from 'sequelize-typescript';
import { sqlConfig } from '../../config/database.config';
import { User } from './entities/user.entity';
import { seedDb } from './seed-db/seed.db';
import { Image } from './entities/image.enity';
import { TokenType } from './entities/token-type.entity';
import { Token } from './entities/token.entity';
import { UserType } from './entities/user-type.entity';
import { Vegetable } from './entities/vegetable.entity ';

const { database, host, password, port, username } = sqlConfig;
export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: host,
        port: parseInt(port),
        username: username,
        password: password,
        database: database,
        logging: (log) => {
          console.log('====================================');
          console.log(log);
          console.log('====================================');
        },
      });

      try {
        sequelize.addModels([
          Image,
          TokenType,
          Token,
          User,
          UserType,
          Vegetable,
        ]);
        await sequelize.authenticate();
        console.log('mysql database connection success...');
        if (process.env.SYNC_DATABASE === 'true') {
          await sequelize.sync({ force: true });
          console.log('database sync success');
          await seedDb();
          console.log('database seeding completed.');
        }
      } catch (error) {
        console.log('mysql database error :', error.message);
      }

      return sequelize;
    },
  },
];
