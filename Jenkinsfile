pipeline {
	agent any

    environment {
		KUBECONFIG = "${WORKSPACE}/kubeconfig"
        FRONTEND_IMAGE = 'todo-frontend'
        BACKEND_IMAGE = 'todo-backend'
        KUBECTL_PATH = "${WORKSPACE}/bin"
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
					sh '''
                        echo "Copying kubeconfig from: $KUBECONFIG_FILE"
                        echo "Copying kubeconfig to: $KUBECONFIG"
                        cp $KUBECONFIG_FILE $KUBECONFIG
                        echo "Kubeconfig copied successfully"
                        echo "Contents of kubeconfig:"
                        cat $KUBECONFIG
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
			steps {
				sh '''
                    echo "KUBECONFIG is set to: $KUBECONFIG"
                    cat $KUBECONFIG
                    export KUBECONFIG=$KUBECONFIG
                    export PATH=${WORKSPACE}/bin:$PATH


                    kubectl apply -f k8s/frontend-deployment.yaml
                    kubectl apply -f k8s/backend-deployment.yaml
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
			script {
				sh '''
                    export KUBECONFIG=${WORKSPACE}/kubeconfig
                    export PATH=${WORKSPACE}/bin:$PATH

                    echo "Checking kubectl configuration..."
                    kubectl config current-context || true

                    echo "Getting pod logs for backend..."
                    kubectl logs -l app=todo-backend --tail=50 || true

                    echo "Getting pod logs for frontend..."
                    kubectl logs -l app=todo-frontend --tail=50 || true

                    echo "Checking pod status..."
                    kubectl get pods -o wide || true
                '''
            }
        }
    }
}