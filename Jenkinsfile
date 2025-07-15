pipeline {
	agent any

	environment {
		FRONTEND_IMAGE = "todo-frontend"
		BACKEND_IMAGE = "todo-backend"
		COMPOSE_PROJECT = "todo-app"

	}

	options {
		buildDiscarder(logRotator(numToKeepStr: '5'))
		disableConcurrentBuilds()
		timeout(time: 30, unit: 'MINUTES')
	}

	stages {
		stage('Build Images') {
			parallel {
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
			}
		}

		stage('Test') {
			parallel {
				stage('Frontend Tests') {
					when {
						expression { false } // Disabled until actual tests are implemented
					}
					steps {
						dir('To_Do_List') {
							sh "echo 'Frontend tests would run here'"
						}
					}
				}

				stage('Backend Tests') {
					when {
						expression { false } // Disabled until actual tests are implemented
					}
					steps {
						dir('To_Do_List_Backend') {
							sh "echo 'Backend tests would run here'"
						}
					}
				}
			}
		}

		stage('Deploy') {
			agent {
				docker {
					image 'docker/compose:1.29.2'
					args '-v /var/run/docker.sock:/var/run/docker.sock'
					reuseNode true
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
			sh "docker image prune -f"
		}
		failure {
			echo 'Deployment failed.'
			sh "docker-compose -p ${COMPOSE_PROJECT} logs"
		}
		always {
			echo 'Pipeline execution completed.'
			cleanWs()
		}
	}
}
