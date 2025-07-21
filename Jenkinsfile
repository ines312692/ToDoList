pipeline {
  agent {
    kubernetes {
      label 'jenkins-helm-agent'
      defaultContainer 'helm'
      namespace 'default' // IMPORTANT : identique à celui du ServiceAccount
      serviceAccount 'jenkins-deployer' // autorisé via ClusterRoleBinding
      inheritFrom 'k8s'
    }
  }

  environment {
    HELM_NAMESPACE = 'jenkins-developer'
    CHART_PATH = './charts/frontend-chart'
    VALUES_PATH = './charts/frontend-chart/values.yaml'
  }

  stages {



    stage('Deploy Frontend') {
      steps {
        container('helm') {
          sh '''
            echo "=== Déploiement du frontend ==="
            helm upgrade --install todo-frontend $CHART_PATH \
              -f $VALUES_PATH \
              --namespace $HELM_NAMESPACE \
              --create-namespace \
              --wait \
              --timeout=300s \
              --debug
          '''
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        container('kubectl') {
          sh '''

            kubectl wait --for=condition=Ready pod -l app=todo-frontend \
              --namespace $HELM_NAMESPACE --timeout=120s || true


            kubectl get pods -n $HELM_NAMESPACE -o wide


            kubectl get svc -n $HELM_NAMESPACE


            kubectl get ingress -n $HELM_NAMESPACE || echo "Pas d'ingress configuré"
          '''
        }
      }
    }
  }

  post {
    failure {
      container('kubectl') {
        sh '''
          echo "💥 Erreur lors du pipeline. Logs des pods frontend :"
          kubectl logs -l app=todo-frontend -n $HELM_NAMESPACE --tail=100 || true
        '''
      }
    }
  }
}