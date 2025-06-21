import "reflect-metadata";
import { DataSource } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "../config/config";

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT as number,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: true,
  entities: ['src/infrastructure/entity/**/*.ts'],
  migrations: ['src/infrastructure/migration/**/*.ts'],
  subscribers: [],
});

// Inicializar la conexión
AppDataSource.initialize()
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(error => console.log('Error de conexión:', error));  