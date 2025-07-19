pipeline {
  agent any

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
