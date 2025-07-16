pipeline {
	agent any

    environment {
		FRONTEND_IMAGE = 'todo-frontend:latest'
        BACKEND_IMAGE = 'todo-backend:latest'
    }

    stages {
		stage('Start Minikube') {
			steps {
				echo 'Starting Minikube...'
                sh 'minikube status || minikube start'
            }
        }

        stage('Configure Docker with Minikube') {
			steps {
				echo 'Switching Docker context to Minikube...'
                sh 'eval $(minikube -p minikube docker-env)'
            }
        }

        stage('Build Frontend Image') {
			steps {
				dir('To_Do_List') {
					sh "docker build -t ${env.FRONTEND_IMAGE} ."
                }
            }
        }

        stage('Build Backend Image') {
			steps {
				dir('To_Do_List_Backend') {
					sh "docker build -t ${env.BACKEND_IMAGE} ."
                }
            }
        }

        stage('Deploy to Minikube') {
			steps {
				echo 'Deploying to Kubernetes cluster...'
                sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                sh 'kubectl apply -f k8s/backend-deployment.yaml'
            }
        }

        stage('Verify Deployment') {
			steps {
				sh 'kubectl get pods'
                sh 'kubectl get services'
            }
        }

        stage('Expose Frontend (optional)') {
			steps {
				echo 'Accessing Frontend URL'
                sh 'minikube service todo-frontend-service --url'
            }
        }
    }
}
