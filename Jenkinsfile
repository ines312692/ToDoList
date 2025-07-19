pipeline {
  agent {
    kubernetes {
     inheritFrom 'kube-agent'
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
