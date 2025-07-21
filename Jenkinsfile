pipeline {
  agent {
    kubernetes {
      label 'jenkins-master'
      defaultContainer 'kubectl'
      namespace 'default'
      serviceAccount 'jenkins-deployer'
    }
  }

  environment {
    NAMESPACE = 'jenkins-developer'
    FRONTEND_JOB = 'todo-frontend-job'
    BACKEND_JOB = 'todo-backend-job'
  }

  stages {


    stage('Deploy Apps') {
      parallel {
        stage('Frontend') {
          steps {
            script {
              echo " Déploiement Frontend..."
              build job: "${FRONTEND_JOB}", wait: true
            }
          }
        }
        stage('Backend') {
          steps {
            script {
              echo "Déploiement Backend..."
              build job: "${BACKEND_JOB}", wait: true
            }
          }
        }
      }
    }

    stage('Summary') {
      steps {
        container('kubectl') {
          sh '''
            echo "=== Résumé ==="
            kubectl get all -n $NAMESPACE
          '''
        }
      }
    }
  }

  post {
    success {
      echo "Déploiement réussi!"
    }
    failure {
      echo "Échec du déploiement"
      container('kubectl') {
        sh 'kubectl get events -n $NAMESPACE --sort-by=.lastTimestamp | tail -10'
      }
    }
  }
}