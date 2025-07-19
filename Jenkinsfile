pipeline {
  agent any

  stages {
    stage('Test Connection') {
      steps {
        script {
          echo "=== Test de base ==="

          try {
            bat 'wsl kubectl get nodes'
            bat 'wsl helm version'
            echo "✅ WSL + kubectl/helm OK"
          } catch (Exception e) {
            echo "❌ WSL approach failed: ${e.getMessage()}"

            try {
              sh 'kubectl get nodes'
              sh 'helm version'
              echo "✅ Direct kubectl/helm OK"
            } catch (Exception e2) {
              echo "❌ Direct approach failed: ${e2.getMessage()}"
              echo "ℹ️ Il faut installer kubectl/helm dans Jenkins container"
            }
          }
        }
      }
    }

    stage('Test Deploy') {
      when {
        expression { return true }
      }
      steps {
        script {
          try {
            bat '''
              wsl export KUBECONFIG=~/.kube/config
              wsl helm lint ./charts/frontend-chart
              wsl helm template test-frontend ./charts/frontend-chart
            '''
            echo "✅ Charts OK via WSL"
          } catch (Exception e) {
            echo "❌ WSL helm failed: ${e.getMessage()}"
          }
        }
      }
    }
  }
}