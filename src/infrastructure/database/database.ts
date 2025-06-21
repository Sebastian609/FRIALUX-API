import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '185.187.235.137',
  port: 3306,
  username: 'viverco_frialux_user',
  password: '1^IOfg8xm[#QK}VQ',
  database: 'viverco_frialux',
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