pipeline {
	agent any

    environment {
		KUBECONFIG_FILE = 'minikube-kubeconfig'
        FRONTEND_IMAGE = 'todo-frontend:latest'
        BACKEND_IMAGE = 'todo-backend:latest'
    }

    stages {

		stage('Checkout') {
			steps {
				checkout scm
            }
        }

        stage('Build Frontend') {
			agent {
				docker {
					image 'node:20-alpine'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                    args '-u root'
                }
            }
            steps {
				dir('To_Do_List') {
					sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
			agent {
				docker {
					image 'docker:24.0.0'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                    args '-u root'
                }
            }
            steps {
				dir('To_Do_List_Backend') {
					script {
						sh 'docker build -t $BACKEND_IMAGE .'
                        sh 'minikube image load $BACKEND_IMAGE'
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
			agent {
				docker {
					image 'bitnami/kubectl:latest'
                    args '-v $HOME/.kube:/root/.kube'
                }
            }
            steps {
				withKubeConfig([credentialsId: env.KUBECONFIG_FILE]) {
					script {
						sh 'kubectl apply -f k8s/backend-deployment.yaml'
                        sh 'kubectl apply -f k8s/frontend-deployment.yaml'

                        sh 'kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=300s'
                        sh 'kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=300s'

                        sh 'kubectl get pods'
                        sh 'kubectl get services'
                        sh 'minikube service todo-frontend-service --url'
                    }
                }
            }
        }
    }

    post {
		always {
			script {
				docker.image('docker:24.0.0').inside('-v /var/run/docker.sock:/var/run/docker.sock') {
					sh 'docker image prune -f'
                }
            }
        }
        failure {
			script {
				docker.image('bitnami/kubectl:latest').inside('-v $HOME/.kube:/root/.kube') {
					sh 'kubectl logs -l app=todo-backend --tail=50 || true'
                    sh 'kubectl logs -l app=todo-frontend --tail=50 || true'
                }
            }
        }
    }
}
