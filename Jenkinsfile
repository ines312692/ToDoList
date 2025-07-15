pipeline {
	agent any

	environment {
		FRONTEND_IMAGE = "todo-frontend"
		BACKEND_IMAGE = "todo-backend"
		COMPOSE_PROJECT = "todo-app"
	}

	stages {
		stage('Build Images') {
			parallel {
				stage('Build Frontend') {
					steps {
						dir('To_Do_List') {
							sh "docker build --no-cache -t ${FRONTEND_IMAGE}:latest ."
						}
					}
				}

				stage('Build Backend') {
					steps {
						dir('To_Do_List_Backend') {
							sh "docker build --no-cache -t ${BACKEND_IMAGE}:latest ."
						}
					}
				}
			}
		}

		stage('Test') {
			steps {
				echo 'Running tests...'
			}
		}

		stage('Debug Workspace') {
			steps {
				sh 'pwd'
				sh 'ls -alR'
			}
		}

		stage('Deploy') {
			agent {
				docker {
					image 'docker/compose:1.29.2'
					args '-v /var/run/docker.sock:/var/run/docker.sock'
				}
			}
			steps {
				sh "docker-compose -p ${COMPOSE_PROJECT} up -d"
				echo 'Déploiement terminé.'
			}
		}
	}

	post {
		success {
			echo 'Deployment succeeded!'
		}
		failure {
			echo 'Deployment failed.'
			sh "docker-compose -p ${COMPOSE_PROJECT} logs"
		}
		always {
			echo 'Pipeline execution completed.'
		}
	}
}
