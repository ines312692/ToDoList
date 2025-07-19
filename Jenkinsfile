pipeline {
  agent {
    kubernetes {
      inheritFrom 'k8s-agent'
      defaultContainer 'kubectl'
    }
  }

  environment {
    KUBECONFIG_PATH = '/home/jenkins/.kube/config'
  }

  stages {
    stage('Prepare kubeconfig') {
      steps {
        container('kubectl') {
          withCredentials([file(credentialsId: 'configminikube', variable: 'KUBECONFIG_FILE')]) {
            sh '''
              mkdir -p $(dirname ${KUBECONFIG_PATH})
              cp $KUBECONFIG_FILE ${KUBECONFIG_PATH}
              chmod 600 ${KUBECONFIG_PATH}
              export KUBECONFIG=${KUBECONFIG_PATH}
              kubectl config get-contexts
            '''
          }
        }
      }
    }

    stage('Deploy frontend') {
      steps {
        container('helm') {
          sh '''
            export KUBECONFIG=${KUBECONFIG_PATH}
            helm upgrade --install todo-frontend ./charts/frontend-chart -f ./charts/frontend-chart/values.yaml
          '''
        }
      }
    }

    stage('Deploy backend') {
      steps {
        container('helm') {
          sh '''
            export KUBECONFIG=${KUBECONFIG_PATH}
            helm upgrade --install todo-backend ./charts/backend-chart -f ./charts/backend-chart/values.yaml
          '''
        }
      }
    }

    stage('Verify deployment') {
      steps {
        container('kubectl') {
          sh '''
            export KUBECONFIG=${KUBECONFIG_PATH}
            kubectl get pods -o wide
            kubectl get svc
          '''
        }
      }
    }
  }

  post {
    success {
      echo '=== Déploiement Kubernetes réussi ! ==='
    }
    failure {
      echo '=== Échec du déploiement ==='
      container('kubectl') {
        sh '''
          export KUBECONFIG=${KUBECONFIG_PATH}
          kubectl describe pods || true
          kubectl logs -l app=todo-frontend --tail=20 || true
          kubectl logs -l app=todo-backend --tail=20 || true
        '''
      }
    }
  }
}
