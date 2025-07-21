pipeline {
  agent {
    kubernetes {
      label 'kub'
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: kubectl
      image: lachlanevenson/k8s-kubectl:v1.27.4
      command:
        - cat
      tty: true
  volumes:
    - name: kubeconfig
      hostPath:
        path: /home/ines/.kube
        type: Directory
  containers:
    - name: kubectl
      image: lachlanevenson/k8s-kubectl:v1.27.4
      command: ['cat']
      tty: true
      volumeMounts:
        - name: kubeconfig
          mountPath: /home/jenkins/.kube
"""
    }
  }

  environment {
    KUBECONFIG = '/home/jenkins/.kube/config'
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
