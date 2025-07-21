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



   stages {
           stage('Vérifier Kubernetes depuis Jenkins') {
               steps {
                   container('kubectl') {
                       sh '''
                          ls -l /bin /usr/bin | grep sh || echo "Pas de shell trouvé"

                           echo "Checking kubeconfig..."
                           ls -la /home/jenkins/.kube/ || echo "Kubeconfig directory not found"

                           if [ -f "$KUBECONFIG_PATH" ]; then
                               echo "Kubeconfig found"
                               kubectl config current-context
                               kubectl get pods -A
                           else
                               echo "Kubeconfig not found at $KUBECONFIG_PATH"
                               exit 1
                           fi
                       '''
                   }
               }
           }
       }
   }