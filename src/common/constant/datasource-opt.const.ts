
import { FestivalCategoryEntity } from '../../festival/entities/ref-festival-category.entity';
import { FestivalEntity } from '../../festival/entities/festival.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { NodeEnvEnum } from './enums/node-env.enum';
import { FestivalSubCategoryEntity } from '../../festival/entities/ref-festival-subcategory.entity';

const migrationsArray =
  process.env.TYPEORM_USE_CLI === 'true'
    ? ['./typeorm_migrations/*{.ts,.js}']
    : [];

export const dataSourceOpt = {
  type: 'mysql',
  host: process.env.DB_HOST != null ? process.env.DB_HOST : 'localhost',
  port: process.env.DB_PORT != null ? +process.env.DB_PORT : 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  synchronize: process.env.NODE_ENV === NodeEnvEnum.production ? false : true,
  debug: false,
  migrations: migrationsArray,
  migrationsTableName: 'migrations_history',
  entities: [UserEntity, FestivalEntity, FestivalCategoryEntity, FestivalSubCategoryEntity],
};
