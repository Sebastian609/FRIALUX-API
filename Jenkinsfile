pipeline {
    agent any
    tools {
        nodejs "node" // Asegúrate de que "node" esté correctamente configurado en Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando el repositorio...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Compilando TypeScript...'
                sh 'npm run build'
            }
        }

        stage('Run TypeORM Migrations') {
            steps {
                echo 'Ejecutando migraciones de TypeORM...'
                // ¡IMPORTANTE! Solo ejecutar migraciones existentes.
                // Asegúrate de que tus migraciones ya están commiteadas en el repositorio.
                // El 'dataSource' debe apuntar al archivo compilado en 'dist'.
                sh 'node ./node_modules/typeorm/cli.js migration:run --dataSource ./dist/data-source.js'
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Desplegando aplicación con PM2...'
                sh 'pm2 startOrRestart ecosystem.config.js --update-env'
                sh 'pm2 list'
            }
        }
    }

    post {
        always {
            script {
                echo 'Guardando configuración de PM2...'
                sh 'pm2 save' // Guarda la configuración actual de PM2
                sh 'pm2 list' // Muestra el estado de PM2 después de guardar
            }
        }
        success {
            echo '¡Despliegue exitoso!'
        }
        failure {
            echo 'El despliegue falló. Revisa los logs.'
        }
    }
}