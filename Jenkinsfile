pipeline {
  agent {
    kubernetes {
      inheritFrom 'k8s'
      defaultContainer 'helm'
      yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins-deployer
  containers:
  - name: helm
    image: alpine/helm:3.14.0
    command: ['cat']
    tty: true
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['cat']
    tty: true
"""
    }
  }

  stages {

    stage('Init RBAC') {
      steps {
        container('kubectl') {
          sh '''
            echo "Applying RBAC and namespace..."
            kubectl apply -f k8s/bootstrap/
          '''
        }
      }
    }

    stage('Deploy Frontend') {
      steps {
        container('helm') {
          sh '''
            echo "Déploiement frontend"
            helm upgrade --install todo-frontend ./charts/frontend-chart \
              -f ./charts/frontend-chart/values.yaml \
              --namespace todo-app --create-namespace
          '''
        }
      }
    }

    stage('Deploy Backend') {
      steps {
        container('helm') {
          sh '''
            echo "Déploiement backend"
            helm upgrade --install todo-backend ./charts/backend-chart \
              -f ./charts/backend-chart/values.yaml \
              --namespace todo-app --create-namespace
          '''
        }
      }
    }

    stage('Vérification') {
      steps {
        container('kubectl') {
          sh 'kubectl get all -n todo-app'
        }
      }
    }
  }
}
