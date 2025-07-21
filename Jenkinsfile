pipeline {
  agent {
    kubernetes {
      inheritFrom 'k8s' // Nom de ton podTemplate défini dans Jenkins
      // Optionnel : tu peux ajouter containers, volumes etc ici si besoin
    }
  }

  environment {
    KUBECONFIG = '/root/.kube/config' // Assure-toi que ce fichier est accessible dans le pod
  }

  stages {
    stage('Check Tools') {
      steps {
        container('kubectl') { // Nom du container dans le pod template qui contient kubectl et helm
          sh '''
            echo "=== Versions installées ==="
            kubectl version --client
            helm version
          '''
        }
      }
    }

    stage('Deploy frontend') {
      steps {
        container('kubectl') {
          sh '''
            echo "=== Déploiement frontend ==="
            helm upgrade --install todo-frontend ./charts/frontend-chart -f ./charts/frontend-chart/values.yaml
          '''
        }
      }
    }

    stage('Deploy backend') {
      steps {
        container('kubectl') {
          sh '''
            echo "=== Déploiement backend ==="
            helm upgrade --install todo-backend ./charts/backend-chart -f ./charts/backend-chart/values.yaml
          '''
        }
      }
    }

    stage('Verify deployment') {
      steps {
        container('kubectl') {
          sh '''
            echo "=== Vérification des pods ==="
            kubectl get pods -o wide
            kubectl get svc
          '''
        }
      }
    }
  }

  post {
    success {
      echo 'Déploiement réussi !'
    }
    failure {
      container('kubectl') {
        sh '''
          echo "Échec du déploiement — logs :"
          kubectl describe pods || true
          kubectl logs -l app=todo-frontend --tail=20 || true
          kubectl logs -l app=todo-backend --tail=20 || true
        '''
      }
    }
  }
}
