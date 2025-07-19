pipeline {
  agent {
    kubernetes {
        label 'k8s'
    }
  }

  stages {
    stage('Test Agent Kubernetes') {
      steps {
        container('kubectl') {
          sh 'echo "Agent Kubernetes fonctionne !"'
          sh 'kubectl version --client'
        }
      }
    }
  }
}
