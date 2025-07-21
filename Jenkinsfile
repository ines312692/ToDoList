pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: tools
      image: ubuntu:22.04
      command: ['cat']
      tty: true
      volumeMounts:
        - name: kubeconfig
          mountPath: /root/.kube
  volumes:
    - name: kubeconfig
      hostPath:
        path: /home/ines/.kube
        type: Directory
"""
    }
  }

  environment {
    KUBECONFIG = '/root/.kube/config'
  }

  stages {
    stage('Installer outils') {
      steps {
        sh '''
          apt-get update -qq
          apt-get install -y curl apt-transport-https gnupg lsb-release bash

          echo ">>> Installing kubectl"
          curl -LO https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
          chmod +x kubectl && mv kubectl /usr/local/bin/

          echo ">>> Installing helm"
          curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

          echo ">>> Vérification versions"
          kubectl version --client
          helm version
        '''
      }
    }

    stage('Deploy frontend') {
      steps {
        sh '''
          echo "=== Déploiement frontend ==="
          helm upgrade --install todo-frontend ./charts/frontend-chart -f ./charts/frontend-chart/values.yaml
        '''
      }
    }

    stage('Deploy backend') {
      steps {
        sh '''
          echo "=== Déploiement backend ==="
          helm upgrade --install todo-backend ./charts/backend-chart -f ./charts/backend-chart/values.yaml
        '''
      }
    }

    stage('Vérification') {
      steps {
        sh '''
          echo "=== Vérification des pods ==="
          kubectl get pods -o wide
          kubectl get svc
        '''
      }
    }
  }

  post {
    success {
      echo ' Déploiement réussi !'
    }
    failure {
      sh '''
        echo "Échec du déploiement — logs :"
        kubectl describe pods || true
        kubectl logs -l app=todo-frontend --tail=20 || true
        kubectl logs -l app=todo-backend --tail=20 || true
      '''
    }
  }
}
