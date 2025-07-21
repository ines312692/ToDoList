pipeline {
    agent {
        kubernetes {
            inheritFrom 'k8s'
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: kubectl
      image: lachlanevenson/k8s-kubectl:v1.27.4
      command: ['cat']
      tty: true
    - name: helm
      image: alpine/helm:3.13.3
      command: ['cat']
      tty: true
"""
        }
    }

    environment {
        KUBECONFIG_PATH = '/home/jenkins/.kube/config'
    }

    stages {
        stage('Vérifier Kubernetes depuis Jenkins') {
            steps {
                container('kubectl') {
                    sh 'kubectl config current-context'
                    sh 'kubectl get pods -A'
                }
            }
        }
    }
}
