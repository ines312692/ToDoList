pipeline {
	agent any

    environment {
		KUBECONFIG = "${WORKSPACE}/kubeconfig"
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

        stage('Copy Kubeconfig') {
			steps {
				withCredentials([file(credentialsId: 'kubeconfig-minikube', variable: 'KUBECONFIG_FILE')]) {
					sh 'cp $KUBECONFIG_FILE $KUBECONFIG'
        }
      }
    }

    stage('Deploy to Kubernetes') {
			steps {
				sh '''
          kubectl cluster-info
          kubectl get nodes
          sh 'kubectl apply -f k8s/frontend-deployment.yaml'
          sh 'kubectl apply -f k8s/backend-deployment.yaml'
          kubectl get pods
        '''
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