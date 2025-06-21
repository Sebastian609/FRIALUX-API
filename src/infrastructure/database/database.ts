import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'frialux',
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