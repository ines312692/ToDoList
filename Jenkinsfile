pipeline {
	agent {
		kubernetes {
			label 'k8s-agent'

    }
  }

  environment {
		KUBECONFIG_CRED_ID = 'kubeconfig-minikube' // ID de ta credential Secret File kubeconfig
    KUBECONFIG_PATH = '/home/jenkins/.kube/config'
  }

  stages {

		stage('Prepare kubeconfig') {
			steps {
				container('kubectl') {
					withCredentials([file(credentialsId: "${KUBECONFIG_CRED_ID}", variable: 'KUBECONFIG_FILE')]) {
						sh '''
              mkdir -p $(dirname ${KUBECONFIG_PATH})
              cp $KUBECONFIG_FILE ${KUBECONFIG_PATH}
              chmod 600 ${KUBECONFIG_PATH}
              export KUBECONFIG=${KUBECONFIG_PATH}
              kubectl config get-contexts
            '''
          }
        }
      }
    }

    stage('Deploy frontend') {
			steps {
				container('kubectl') {
					sh '''
            export KUBECONFIG=${KUBECONFIG_PATH}
            kubectl apply -f k8s/frontend-deployment.yaml --validate=false --timeout=60s
            kubectl rollout status deployment/todo-frontend --timeout=300s
          '''
        }
      }
    }

    stage('Deploy backend') {
			steps {
				container('kubectl') {
					sh '''
            export KUBECONFIG=${KUBECONFIG_PATH}
            kubectl apply -f k8s/backend-deployment.yaml --validate=false --timeout=60s
            kubectl rollout status deployment/todo-backend --timeout=300s
          '''
        }
      }
    }

    stage('Verify deployment') {
			steps {
				container('kubectl') {
					sh '''
            export KUBECONFIG=${KUBECONFIG_PATH}
            kubectl get pods -o wide
            kubectl get services
          '''
        }
      }
    }
  }

  post {
		success {
			echo '=== Déploiement Kubernetes réussi ! ==='
    }
    failure {
			echo '=== Échec du déploiement ==='
      container('kubectl') {
				sh '''
          export KUBECONFIG=${KUBECONFIG_PATH}
          kubectl get events --sort-by=.metadata.creationTimestamp || true
          kubectl describe pods || true
          kubectl logs -l app=todo-frontend --tail=20 || true
          kubectl logs -l app=todo-backend --tail=20 || true
        '''
      }
    }
  }
}
