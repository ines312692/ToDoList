pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "todo-frontend"
        BACKEND_IMAGE = "todo-backend"
        DOCKER_NETWORK = "todo-network"
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    sh "docker network create ${DOCKER_NETWORK} || true"
                }
            }
        }

        stage('Build Services in Parallel') {
            parallel {
                stage('Frontend Build') {
                    steps {
                        build job: 'frontend-build-job', parameters: [
                            string(name: 'IMAGE_NAME', value: env.FRONTEND_IMAGE),
                            string(name: 'NETWORK_NAME', value: env.DOCKER_NETWORK)
                        ], wait: true
                    }
                }
                stage('Backend Build') {
                    steps {
                        build job: 'backend-build-job', parameters: [
                            string(name: 'IMAGE_NAME', value: env.BACKEND_IMAGE),
                            string(name: 'NETWORK_NAME', value: env.DOCKER_NETWORK)
                        ], wait: true
                    }
                }
            }
        }

        stage('Integration Tests') {
            steps {
                sh '''
                docker run -d --name frontend --network ${DOCKER_NETWORK} -p 8081:80 ${FRONTEND_IMAGE}:latest
                docker run -d --name backend --network ${DOCKER_NETWORK} -p 3001:3000 ${BACKEND_IMAGE}:latest
                sleep 10
                curl -f http://localhost:8081 || exit 1
                curl -f http://localhost:3001/health || exit 1
                docker stop frontend backend
                docker rm frontend backend
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose -f docker-compose.prod.yml down || true'
                sh 'docker-compose -f docker-compose.prod.yml up -d'
            }
        }
    }

    post {
        always {
            sh '''
            docker system prune -af
            '''
        }
        success {
            echo "Pipeline terminé avec succès !"
        }
        failure {
            echo "Pipeline échoué."
        }
    }
}
