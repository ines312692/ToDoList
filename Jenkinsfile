pipeline {
	agent any

    environment {

        HTTPS_PROXY = 'http://host.docker.internal:8080'
        HTTP_PROXY  = 'http://host.docker.internal:8080'
        NO_PROXY    = '127.0.0.1,localhost,.svc,.cluster.local'
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

                    '''
                }
            }
        }

        stage('Build Frontend') {
			steps {
				dir('To_Do_List') {
					sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                }
            }
        }

        stage('Build Backend') {
			steps {
				dir('To_Do_List_Backend') {
					sh "docker build -t ${BACKEND_IMAGE}:latest ."
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
