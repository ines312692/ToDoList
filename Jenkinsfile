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
				dir('To_Do_List') {
					sh 'cp To_Do_List/docker-compose.yml .'
sh '''
  docker run --rm \
    -v //./pipe/docker_engine://./pipe/docker_engine \
    -v $(pwd):/workspace \
    -w /workspace \
    docker/compose:latest \
    -f docker-compose.yml \
    -p ${COMPOSE_PROJECT} up -d --build
'''}
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
