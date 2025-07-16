def branchName = env.BRANCH_NAME

pipeline {
	agent any

    environment {
		FRONTEND_IMAGE = "todo-frontend"
        BACKEND_IMAGE = "todo-backend"
        COMPOSE_PROJECT = "todo-app"
    }

    stages {
		stage('Checkout') {
			steps {
				checkout scm
            }
        }

        stage('Install Dependencies') {
			agent {
				docker {
					image 'node:20-alpine'
                    args '-u root'
                }
            }
            when {
				anyOf {
					branch 'develop'
                    branch 'main'
                }
            }
            steps {
				echo "Installing dependencies for ${branchName}..."
                dir('To_Do_List') {
					sh 'npm install'
                }
                dir('To_Do_List_Backend') {
					sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
			agent {
				docker {
					image 'node:20-alpine'
                    args '-u root'
                }
            }
            when {
				anyOf {
					branch 'develop'
                    branch 'main'
                }
            }
            steps {
				dir('To_Do_List') {

                    sh "docker build -t ${FRONTEND_IMAGE}:${branchName} ."
                }
            }
        }

        stage('Build Backend') {
			agent {
				docker {
					image 'docker:20-dind'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            when {
				anyOf {
					branch 'develop'
                    branch 'main'
                }
            }
            steps {
				dir('To_Do_List_Backend') {
					sh "docker build -t ${BACKEND_IMAGE}:${branchName} ."
                }
            }
        }

        stage('Tests') {
			when {
				branch 'develop'
            }
            steps {
				echo "Running tests on ${branchName}..."
                // Ajoute tes commandes de tests ici
            }
        }

        stage('Deploy') {
			when {
				branch 'main'
            }
            agent {
				docker {
					image 'docker/compose:1.29.2'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
				echo "Deploying to production..."
                sh "docker-compose -p ${COMPOSE_PROJECT} up -d"
            }
        }
    }

    post {
		success {
			echo "Pipeline succeeded on branch ${branchName}"
        }
        failure {
			echo "Pipeline failed on branch ${branchName}"
        }
    }
}
