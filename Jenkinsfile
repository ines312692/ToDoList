pipeline {
  agent {
    kubernetes {
      inheritFrom 'k8s'
    }
  }

  environment {
    KUBECONFIG = '/root/.kube/config'
  }

  stages {

    stage('Configurer RBAC') {
      steps {
        container('kubectl') {
          sh '''
            echo "=== Création du ServiceAccount et ClusterRoleBinding ==="

            cat <<EOF | kubectl apply -f -
            apiVersion: v1
            kind: ServiceAccount
            metadata:
              name: jenkins-deployer
              namespace: default
            ---
            apiVersion: rbac.authorization.k8s.io/v1
            kind: ClusterRoleBinding
            metadata:
              name: jenkins-deployer-binding
            subjects:
              - kind: ServiceAccount
                name: jenkins-deployer
                namespace: default
            roleRef:
              kind: ClusterRole
              name: cluster-admin
              apiGroup: rbac.authorization.k8s.io
            EOF

            echo "ServiceAccount jenkins-deployer configuré"
          '''
        }
      }
    }

    stage('Check Tools') {
      steps {
        container('kubectl') {
          sh '''
            echo "=== Vérification outils ==="
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
            echo "=== Vérification des ressources ==="
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
