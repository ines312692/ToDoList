pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: helm
spec:
  containers:
  - name: tools
    image: ubuntu:22.04
    command:
    - cat
    tty: true
    volumeMounts:
    - name: kubeconfig
      mountPath: /root/.kube/config
      subPath: config
  volumes:
  - name: kubeconfig
    hostPath:
      path: /home/ines/.kube/config
      type: File
"""
    }
  }
  stages {
    stage('Test kubeconfig') {
      steps {
        container('tools') {
          sh '''
            apt-get update && apt-get install -y curl
            curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
            chmod +x kubectl && mv kubectl /usr/local/bin/
            kubectl get pods
          '''
        }
      }
    }
  }
}
