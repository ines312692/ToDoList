pipeline {
	agent any

    environment {
		KUBECONFIG_ID = 'minikube-kubeconfig'
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
                    curl -LO https://dl.k8s.io/release/v1.33.1/bin/linux/amd64/kubectl
                    chmod +x kubectl
                    mkdir -p ${WORKSPACE}/bin
                    mv kubectl ${WORKSPACE}/bin/kubectl
                    export PATH=${WORKSPACE}/bin:$PATH
                    kubectl version --client
                '''
            }
        }

        stage('Deploy to Kubernetes') {
			steps {
				withKubeConfig([credentialsId: "${env.KUBECONFIG_ID}"]) {
					dir('k8s') {
						sh 'kubectl apply -f backend-deployment.yaml'
                        sh 'kubectl apply -f backend-service.yaml'
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
			sh '${WORKSPACE}/bin/kubectl logs -l app=todo-backend --tail=50 || true'
            sh '${WORKSPACE}/bin/kubectl logs -l app=todo-frontend --tail=50 || true'
        }
    }
}