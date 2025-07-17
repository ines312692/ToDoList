pipeline {
	agent any

    environment {
		// Proxy configuré pour accéder à l'API Kubernetes locale via kubectl proxy
        HTTPS_PROXY = 'http://host.docker.internal:8080'
        HTTP_PROXY  = 'http://host.docker.internal:8080'
        NO_PROXY    = '127.0.0.1,localhost,.svc,.cluster.local'

        // Fichier kubeconfig modifié pointant vers http://host.docker.internal:8080
        KUBECONFIG = 'minikube-kubeconfig'
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
                    args '-u root:root'
                }
            }
            steps {
				dir('To_Do_List_Frontend') {
					sh '''
                        echo "Installing frontend dependencies..."
                        npm install
                        echo " Building frontend..."
                        npm run build
                    '''
                }
            }
        }

        stage('Build Backend') {
			agent {
				docker {
					image 'node:20-alpine'
                    args '-u root:root'
                }
            }
            steps {
				dir('To_Do_List_Backend') {
					sh '''
                        echo "Installing backend dependencies..."
                        npm install
                        echo " Running backend tests (if any)..."
                        # npm test
                    '''
                }
            }
        }

        stage('Deploy to K8s') {
			steps {
				sh '''
                    echo "Applying Kubernetes manifests via local proxy..."
                    kubectl apply -f k8s/frontend-deployment.yaml
                    kubectl apply -f k8s/backend-deployment.yaml
                    kubectl get pods
                '''
            }
        }
    }
}
