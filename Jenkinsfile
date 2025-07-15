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
