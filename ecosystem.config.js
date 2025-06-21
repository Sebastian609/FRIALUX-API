module.exports = {
    apps: [
      {
        name: 'frialux', // Nombre del proceso
        script: 'npm', // Comando que se ejecutará
        args: 'run start', // Argumentos pasados al comando (npm run start)
        instances: 1, // Número de instancias (ajusta según tu necesidad)
        autorestart: true, // Reinicia automáticamente si el proceso falla
        watch: false, // Desactiva reinicio automático al detectar cambios
        max_memory_restart: '500M', // Reinicia si usa más de 500 MB de memoria
        env: {
          NODE_ENV: 'production', // Variables de entorno para producción
          PORT: 2224 // Puerto en el que se ejecuta tu app
        }
      }
    ]
  };
  