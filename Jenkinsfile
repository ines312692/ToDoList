pipeline {
	agent any

    environment {
		KUBECONFIG_FILE = 'minikube-kubeconfig'  // l’ID que tu as mis dans Jenkins Credentials
        FRONTEND_IMAGE = 'todo-frontend:latest'
        BACKEND_IMAGE = 'todo-backend:latest'
    }

    stages {
		stage('Build Frontend') {
			steps {
				dir('To_Do_List') {
					sh 'docker build -t $FRONTEND_IMAGE .'
                }
            }
        }

        stage('Build Backend') {
			steps {
				dir('To_Do_List_Backend') {
					sh 'docker build -t $BACKEND_IMAGE .'
                }
            }
        }

        stage('Deploy to Minikube') {
			steps {
				withKubeConfig([credentialsId: env.KUBECONFIG_FILE]) {
					sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    sh 'kubectl get pods'
                    sh 'kubectl get services'
                }
            }
        }
    }
}
