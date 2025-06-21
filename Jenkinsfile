pipeline {
    agent any
    tools {
        nodejs "node" // Make sure "node" is correctly configured in Jenkins Global Tool Configuration
    }


    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning the repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Compiling TypeScript...'
                sh 'npm run build'
            }
        }

        stage('Run TypeORM Migrations') {
            steps {
                echo 'Generating and running TypeORM migrations...'
                sh 'npm run typeorm migration:run --dataSource ./dist/data-source.js'
            }
        }


        stage('Deploy Application') {
            steps {
                echo 'Deploying application with PM2...'
                sh 'pm2 startOrRestart ecosystem.config.js --update-env'
                sh 'pm2 list'
            }
        }
    }

    post {
        always {
            script {
                echo 'Saving PM2 configuration...'
                sh 'pm2 save' 
                sh 'pm2 list'
            }
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed. Check logs.'
        }
    }
}