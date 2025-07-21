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
      command: ['/bin/sh', '-c']
      args: ['cat']
      tty: true
      stdin: true
    - name: helm
      image: alpine/helm:3.13.3
      command: ['/bin/sh', '-c']
      args: ['cat']
      tty: true
      stdin: true
"""
        }
    }

    environment {
        KUBECONFIG_PATH = "${env.KUBECONFIG ?: '/home/jenkins/.kube/config'}"
    }

    stages {
        stage('Debug Environment') {
            steps {
                container('kubectl') {
                    script {
                        // Enable Jenkins diagnostics as suggested in error
                        sh '''
                            set -x  # Enable debug mode
                            echo "=== Environment Debug ==="
                            whoami
                            pwd
                            echo "PATH: $PATH"
                            echo "SHELL: $SHELL"

                            echo "=== Available Shells ==="
                            ls -la /bin/*sh* || true
                            ls -la /usr/bin/*sh* || true

                            echo "=== Process Info ==="
                            ps aux || true
                        '''
                    }
                }
            }
        }

        stage('Vérifier Kubernetes depuis Jenkins') {
            steps {
                container('kubectl') {
                    script {
                        try {
                            sh '''
                                #!/bin/sh
                                set -e  # Exit on error
                                set -x  # Debug mode

                                echo "=== Kubeconfig Check ==="
                                echo "KUBECONFIG_PATH: ${KUBECONFIG_PATH}"

                                # Check if kubeconfig directory exists
                                if [ -d "/home/jenkins/.kube/" ]; then
                                    echo "Kubeconfig directory exists"
                                    ls -la /home/jenkins/.kube/ || true
                                else
                                    echo "Kubeconfig directory not found"
                                fi

                                # Check if kubeconfig file exists
                                if [ -f "${KUBECONFIG_PATH}" ]; then
                                    echo "Kubeconfig file found at ${KUBECONFIG_PATH}"
                                    kubectl config current-context || echo "Failed to get current context"
                                    kubectl get pods -A --request-timeout=10s || echo "Failed to get pods"
                                else
                                    echo "Kubeconfig not found at ${KUBECONFIG_PATH}"
                                    echo "Available files in /home/jenkins/:"
                                    find /home/jenkins/ -name "*.config" -o -name "*kube*" 2>/dev/null || true
                                    exit 1
                                fi
                            '''
                        } catch (Exception e) {
                            echo "Error in kubectl container: ${e.getMessage()}"
                            currentBuild.result = 'FAILURE'
                            throw e
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed with result: ${currentBuild.result ?: 'SUCCESS'}"
        }
        failure {
            echo "Pipeline failed. Check logs above for details."
        }
    }
}