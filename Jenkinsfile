pipeline {
	agent any

	environment {
		FRONTEND_IMAGE = "todo-frontend"
		BACKEND_IMAGE = "todo-backend"
	}

	stages {
		stage('Build Frontend') {
			steps {
				dir('To_Do_List') {
					sh '''
						echo " Building frontend image..."
						docker build --no-cache -t ${FRONTEND_IMAGE}:latest .
					'''
				}
			}
		}

		stage('Build Backend') {
			steps {
				dir('To_Do_List_Backend') {
					sh '''
						echo "Building backend image..."
						docker build --no-cache -t ${BACKEND_IMAGE}:latest .
					'''
				}
			}
		}

		stage('Run and Test Containers') {
			parallel {
				stage('Run Frontend Container') {
					steps {
						sh '''
							echo "Running frontend container..."
							docker run -d --name temp-frontend -p 8081:80 ${FRONTEND_IMAGE}:latest
							sleep 5
							docker logs temp-frontend
							docker stop temp-frontend
							docker rm temp-frontend
						'''
					}
				}

				stage('Run Backend Container') {
					steps {
						sh '''
							echo "Running backend container..."
							docker run -d --name temp-backend -p 3001:3000 ${BACKEND_IMAGE}:latest
							sleep 5
							docker logs temp-backend
							docker stop temp-backend
							docker rm temp-backend
						'''
					}
				}
			}
		}
	}

	post {
		always {
			echo 'Nettoyage Docker...'
			sh '''
				docker system prune -af
			'''
		}
		success {
			echo 'Pipeline terminé avec succès.'
		}
		failure {
			echo 'Pipeline échoué.'
		}
	}
}
