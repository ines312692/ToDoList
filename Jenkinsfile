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
            stage('Install Kubectl') {
			steps {
				sh '''
                    curl -LO "https://dl.k8s.io/release/v1.33.1/bin/linux/amd64/kubectl"
                    chmod +x kubectl
                    mv kubectl /usr/local/bin/kubectl
                    kubectl version --client
                '''
            }
        }


        stage('Deploy to Kubernetes') {
			steps {
				withKubeConfig([
                    credentialsId: env.KUBECONFIG_FILE,
                    caCertificate: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCakNDQWU2Z0F3SUJBZ0lCQVRBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwdGFXNXAKYTNWaVpVTkJNQjRYRFRJMU1EY3hOVEUxTURVMU0xb1hEVE0xTURjeE5ERTFNRFUxTTFvd0ZURVRNQkVHQTFVRQpBeE1LYldsdWFXdDFZbVZEUVRDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTDltCnd2YzExa1ZhYjZST3hEZEZpS0Z3ai9TbG9hLzZNcUdsSUJlaW5ISUpPc1IxUTF1WlAvTWV1RElzL0QyWEhPSmQKaXVEajM5WG5pL21zQmJrazlYVmNINDhyMW9oakwrcjJTOXBRR2Z1MkwvMDRSNWlBOHJMMTdZdk0rU0FhcGZ2eApyWGxxYk4wc0lweWQ3VXVlSHl0ZUFHZzVYbzJhcW90dXVJSExxbHlTTGQ3TU1DQnBDZjRkS1lOY3V4dGFIbGtOCkp3UTEvcktHMnVSdFMxM0xPa2JDdWVueU1Oc2tIZ05WSER4N2RZc3FacU1DaFpVeVVsamR4L2hCdHZHVzUrUlIKZ01oamd3cllQYzRETS9lZHVIczRFdUliQTJXRHJXMFhwc3pHZGRMZWIzb1huZ0x4NS91WUV5UmFXamVlb2F6Ngo3Z0psVmg4cC8vQXIxcnppenlrQ0F3RUFBYU5oTUY4d0RnWURWUjBQQVFIL0JBUURBZ0trTUIwR0ExVWRKUVFXCk1CUUdDQ3NHQVFVRkJ3TUNCZ2dyQmdFRkJRY0RBVEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQjBHQTFVZERnUVcKQkJRNUR6a3B1a2xvRlY0aHFKeVpIUi9KQkhDZDNEQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFlNGcwT0dVSQpCaFJtWkxpTDRKblArdjBmL1NhckttUWdocHRLa1EvZGZzM3FmekRpSGtNcm9IR2RJRkdoanM0c0N0eUVHNFJuCnNTbE95ak03c1pSV21ZNENrcXNMWFk4MUFiL1FzVGVhbUVxN1dZdm9OS0FUaXhsQkhDUUxXb0hualNESGhMWEMKanZCV0ZuM3FKdFdsOWFRVm5lKzlCcGhvZ29HeDB5MlVYRUVENUE5K3UwRVR2LyttZ2hqSTdLNzdJbXN0S2UyUgpMMWQ0azFPTjBwMFB1N241TllLQTliejF6bDAzR0RRKzgweVFHWmJJWXdOZk5nT3lhOGlrZ1pmWUJJaXFnK0ZGCkV3cUVpL0NqNzZYdWFySXRyMnVLTVN2R2ZHRGJIWTFVcUNtcFMxWVA3Q0lhdThzZzZXTVhqNjhQNTkxN0U3VFgKakY3ZUZyaC91MXZuZmc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==',
                    serverUrl: 'https://127.0.0.1:65333'
                ]) {
					sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                    sh 'kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=300s'
                    sh 'kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=300s'
                    sh 'kubectl get pods'
                    sh 'kubectl get services'
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