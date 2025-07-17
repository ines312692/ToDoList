pipeline {
	// Utiliser un agent avec Docker disponible
    agent any

    environment {
		KUBECONFIG_FILE = 'minikube-kubeconfig'
        FRONTEND_IMAGE = 'todo-frontend:latest'
        BACKEND_IMAGE = 'todo-backend:latest'
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
					script {
						// Vérifier que Docker est disponible
                        sh 'docker --version'

                        // Construire l'image
                        sh 'docker build -t $FRONTEND_IMAGE .'

                        // Charger l'image dans Minikube
                        sh 'minikube image load $FRONTEND_IMAGE'
                    }
                }
            }
        }

        stage('Build Backend') {
			steps {
				dir('To_Do_List_Backend') {
					script {
						// Construire l'image
                        sh 'docker build -t $BACKEND_IMAGE .'

                        // Charger l'image dans Minikube
                        sh 'minikube image load $BACKEND_IMAGE'
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
			steps {
				withKubeConfig([credentialsId: env.KUBECONFIG_FILE]) {
					script {
						// Appliquer les déploiements
                        sh 'kubectl apply -f k8s/backend-deployment.yaml'
                        sh 'kubectl apply -f k8s/frontend-deployment.yaml'

                        // Attendre que les pods soient prêts
                        sh 'kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=300s'
                        sh 'kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=300s'

                        // Afficher le statut
                        sh 'kubectl get pods'
                        sh 'kubectl get services'

                        // Obtenir l'URL du service
                        sh 'minikube service todo-frontend-service --url'
                    }
                }
            }
        }
    }

    post {
		always {
			// Nettoyer les images locales si nécessaire
            sh 'docker image prune -f'
        }
        failure {
			echo 'Pipeline failed!'
            // Afficher les logs pour debug
            sh 'kubectl logs -l app=todo-backend --tail=50'
            sh 'kubectl logs -l app=todo-frontend --tail=50'
        }
    }
}