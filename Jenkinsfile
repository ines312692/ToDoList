pipeline {
  agent {
    kubernetes {
      label 'jenkins-master'
      defaultContainer 'kubectl'
      namespace 'jenkins-developer'
      serviceAccount 'jenkins-deployer'
    }
  }

  environment {
    FRONTEND_BUILD_JOB = 'frontend-build'
    BACKEND_BUILD_JOB = 'backend-build'
    FRONTEND_DEPLOY_JOB = 'frontend-deploy'
    BACKEND_DEPLOY_JOB = 'backend-deploy'
  }

  stages {
    stage('Build Frontend and Backend') {
      parallel {
        stage('Build Frontend') {
          steps {
            echo "Lancement du build frontend"
            build job: "${FRONTEND_BUILD_JOB}", wait: true
          }
        }
        stage('Build Backend') {
          steps {
            echo "Lancement du build backend"
            build job: "${BACKEND_BUILD_JOB}", wait: true
          }
        }
      }
    }

    stage('Deploy Frontend and Backend') {
      parallel {
        stage('Deploy Frontend') {
          steps {
            echo "Lancement du déploiement frontend"
            build job: "${FRONTEND_DEPLOY_JOB}", wait: true
          }
        }
        stage('Deploy Backend') {
          steps {
            echo "Lancement du déploiement backend"
            build job: "${BACKEND_DEPLOY_JOB}", wait: true
          }
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline complet réussi : Build + Deploy"
    }
    failure {
      echo "Échec dans le pipeline"
    }
  }
}
