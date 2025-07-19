pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: kubectl-agent
spec:
  containers:
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - sleep
    args:
    - 99d
"""
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
