pipeline {
	agent { label 'docker-agent' }

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

        stage('Setup Kubeconfig') {
			steps {
				withCredentials([file(credentialsId: 'kubeconfig-minikube', variable: 'KUBECONFIG_FILE')]) {
					sh '''
                        echo "Setting up kubeconfig..."
                        cp $KUBECONFIG_FILE $KUBECONFIG
                        chmod 600 $KUBECONFIG

                        echo "Kubeconfig setup completed"
                        echo "Current context:"
                        ${WORKSPACE}/bin/kubectl config current-context --kubeconfig=$KUBECONFIG || echo "No current context"
                    '''
                }
            }
        }


        stage('Debug Pause') {
			steps {
				sh '''
            echo "Pausing for debugging..."
            sleep 60
        '''
    }
}

        stage('Deploy to Kubernetes') {
			steps {
				sh '''
                    echo "=== Deploying to Kubernetes ==="
                    export KUBECONFIG=$KUBECONFIG
                    export PATH=${WORKSPACE}/bin:$PATH

                    echo "Applying frontend deployment..."
                    kubectl apply -f k8s/frontend-deployment.yaml --validate=false --timeout=60s || {
                        echo "Frontend deployment failed, retrying..."
                        sleep 10
                        kubectl apply -f k8s/frontend-deployment.yaml --validate=false --timeout=60s
                    }

                    echo "Applying backend deployment..."
                    kubectl apply -f k8s/backend-deployment.yaml --validate=false --timeout=60s || {
                        echo "Backend deployment failed, retrying..."
                        sleep 10
                        kubectl apply -f k8s/backend-deployment.yaml --validate=false --timeout=60s
                    }

                    echo "Waiting for deployments to be ready..."
                    kubectl rollout status deployment/todo-frontend --timeout=300s || echo "Frontend rollout status check failed"
                    kubectl rollout status deployment/todo-backend --timeout=300s || echo "Backend rollout status check failed"
                '''
            }
        }

        stage('Verify Deployment') {
			steps {
				sh '''
                    echo "=== Verifying Deployment ==="
                    export KUBECONFIG=$KUBECONFIG
                    export PATH=${WORKSPACE}/bin:$PATH

                    echo "Checking pods status..."
                    kubectl get pods -o wide || echo "Failed to get pods"

                    echo "Checking services..."
                    kubectl get services || echo "Failed to get services"

                    echo "Checking deployment status..."
                    kubectl get deployments || echo "Failed to get deployments"

                    echo "Checking pod logs (last 10 lines)..."
                    kubectl logs -l app=todo-frontend --tail=10 || echo "Failed to get frontend logs"
                    kubectl logs -l app=todo-backend --tail=10 || echo "Failed to get backend logs"
                '''
            }
        }
    }

    post {
		always {
			sh '''
                echo "=== Cleanup ==="
                # Nettoyer les images Docker non utilisées
                docker image prune -f || true

                # Nettoyer le workspace kubectl
                rm -rf ${WORKSPACE}/bin || true
            '''
        }

        success {
			echo '''
                === Deployment Successful ===
                Your application has been deployed to Kubernetes!

                To access your application:
                1. Make sure minikube tunnel is running
                2. Run: kubectl get services
                3. Access the frontend service URL
            '''
        }

        failure {
			script {
				sh '''
                    echo "=== Deployment Failed - Gathering Debug Information ==="
                    export KUBECONFIG=${WORKSPACE}/kubeconfig
                    export PATH=${WORKSPACE}/bin:$PATH

                    echo "=== Kubectl Configuration ==="
                    kubectl config current-context || echo "No current context"
                    kubectl config view || echo "Cannot view config"

                    echo "=== Cluster Info ==="
                    kubectl cluster-info || echo "Cannot get cluster info"

                    echo "=== Pod Status ==="
                    kubectl get pods -o wide || echo "Cannot get pods"

                    echo "=== Pod Describe ==="
                    kubectl describe pods || echo "Cannot describe pods"

                    echo "=== Backend Logs ==="
                    kubectl logs -l app=todo-backend --tail=50 || echo "Cannot get backend logs"

                    echo "=== Frontend Logs ==="
                    kubectl logs -l app=todo-frontend --tail=50 || echo "Cannot get frontend logs"

                    echo "=== Events ==="
                    kubectl get events --sort-by=.metadata.creationTimestamp || echo "Cannot get events"

                    echo "=== Docker Images ==="
                    docker images | grep todo || echo "No todo images found"
                '''
            }
        }
    }
}