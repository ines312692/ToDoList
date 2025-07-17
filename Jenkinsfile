pipeline {
	agent any

    environment {

        HTTPS_PROXY = 'http://host.docker.internal:8080'
        HTTP_PROXY  = 'http://host.docker.internal:8080'
        NO_PROXY    = '127.0.0.1,localhost,.svc,.cluster.local'
        KUBECONFIG = 'minikube-kubeconfig'
        FRONTEND_IMAGE = 'todo-frontend'
        BACKEND_IMAGE = 'todo-backend'
    }

    stages {
		stage('Checkout') {
			steps {
				checkout scm
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
         stage('Install Kubectl') {
			steps {
				sh '''
                    echo "Installing kubectl..."
                    curl -LO https://dl.k8s.io/release/v1.33.1/bin/linux/amd64/kubectl
                    chmod +x kubectl
                    mkdir -p ${WORKSPACE}/bin
                    mv kubectl ${WORKSPACE}/bin/kubectl

                    echo "Verifying kubectl installation..."
                    ${WORKSPACE}/bin/kubectl version --client
                '''
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
