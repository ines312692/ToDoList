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
      }
    }

    stage('Test') {
			steps {
				echo 'Running tests...'
      }
    }

    stage('Deploy') {
			steps {
				script {
					echo 'Deploying with Docker Compose...'

          try {
						sh "docker-compose -p ${COMPOSE_PROJECT} down"
          } catch (err) {
						echo "Erreur lors de l'arrêt des services : ${err}"
          }

          try {
						sh "docker-compose -p ${COMPOSE_PROJECT} up -d"
          } catch (err) {
						echo "Erreur lors du démarrage des services : ${err}"
            currentBuild.result = 'FAILURE'
            error("Docker Compose 'up' a échoué.")
          }

          try {
						sh "docker-compose -p ${COMPOSE_PROJECT} ps"
          } catch (err) {
						echo "Impossible d'afficher l'état des services : ${err}"
          }

          echo 'Déploiement terminé.'
        }
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
