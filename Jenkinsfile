pipeline {
	agent {
		docker {
			image 'docker:24.0.0'
            args '-u root -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
		KUBECONFIG_FILE = 'minikube-kubeconfig'
        FRONTEND_IMAGE = 'todo-frontend'
        BACKEND_IMAGE = 'todo-backend'
    }

    stages {
		stage('Checkout') {
			steps {
				cleanWs()
                checkout scm
            }
        }

        stage('Build Frontend') {
			steps {
				dir('To_Do_List') {
					sh "docker build  -t ${FRONTEND_IMAGE}:latest ."
						}
					}
        }

        stage('Build Backend') {
			steps {
				dir('To_Do_List_Backend') {
					sh "docker build  -t ${BACKEND_IMAGE}:latest ."
						}
					}
            }


        stage('Deploy to Minikube') {
			steps {
				withKubeConfig([credentialsId: env.KUBECONFIG_FILE]) {
					script {
						try {
							sh 'docker run --rm -v $(pwd):/app -v $HOME/.kube:/root/.kube bitnami/kubectl:1.33.1 kubectl apply -f /app/k8s/backend-deployment.yaml'
                            sh 'docker run --rm -v $(pwd):/app -v $HOME/.kube:/root/.kube bitnami/kubectl:1.33.1 kubectl apply -f /app/k8s/frontend-deployment.yaml'
                            sh 'docker run --rm -v $(pwd):/app -v $HOME/.kube:/root/.kube bitnami/kubectl:1.33.1 kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=300s'
                            sh 'docker run --rm -v $(pwd):/app -v $HOME/.kube:/root/.kube bitnami/kubectl:1.33.1 kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=300s'
                            sh 'docker run --rm -v $(pwd):/app -v $HOME/.kube:/root/.kube bitnami/kubectl:1.33.1 kubectl get pods'
                            sh 'docker run --rm -v $(pwd):/app -v $HOME/.kube:/root/.kube bitnami/kubectl:1.33.1 kubectl get services'
                            sh 'minikube service todo-frontend-service --url || true'
                        } catch (Exception e) {
							echo "Error during deployment: ${e}"
                            throw e
                        }
                    }
                }
            }
        }
    }

    post {
		always {
			sh 'docker image prune -f || true'
        }
        failure {
			sh 'docker run --rm -v $HOME/.kube:/root/.kube bitnami/kubectl:1.33.1 kubectl logs -l app=todo-backend --tail=50 || true'
            sh 'docker run --rm -v $HOME/.kube:/root/.kube bitnami/kubectl:1.33.1 kubectl logs -l app=todo-frontend --tail=50 || true'
        }
    }
}