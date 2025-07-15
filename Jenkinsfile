pipeline {
    agent any // Exécuter sur le nœud maître

    environment {
        FRONTEND_IMAGE = "todo-frontend:latest"
        BACKEND_IMAGE = "todo-backend:latest"
        DOCKER_NETWORK = "todo-network"
        COMPOSE_FILE = "docker-compose.yml"
    }

    stages {
        stage('Initialize') {
            steps {
                sh "docker network create ${DOCKER_NETWORK} || true"
            }
        }

        stage('Trigger Builds') {
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

        stage('Deploy') {
            steps {
                sh """
                    docker-compose -f ${COMPOSE_FILE} down || true
                    docker-compose -f ${COMPOSE_FILE} up -d
                """
            }
        }
    }



 post {
        success {
            echo "Pipeline maître terminé avec succès !"
        }
        failure {
            echo "Pipeline maître échoué."
        }
        always {
            sh """
                docker-compose -f ${COMPOSE_FILE} down || true
                docker rmi ${FRONTEND_IMAGE} ${BACKEND_IMAGE} || true
            """
        }
    }
}