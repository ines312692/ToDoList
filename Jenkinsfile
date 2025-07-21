pipeline {
  agent {
    kubernetes {
      inheritFrom 'k8s'
    }
  }


  stages {
    stage('Validate Environment') {
      steps {
        script {
          try {
            container('kubectl') {
              sh '''
                echo "=== Validation de l'environnement ==="
                kubectl cluster-info
                kubectl get nodes
                echo "Cluster accessible ✓"
              '''
            }
          } catch (Exception e) {
            error "Impossible de se connecter au cluster Kubernetes: ${e.getMessage()}"
          }
        }
      }
    }

    stage('Configure RBAC') {
      steps {
        container('kubectl') {
          sh '''
            echo "=== Configuration RBAC ==="


            if kubectl get serviceaccount jenkins-deployer -n default >/dev/null 2>&1; then
              echo "ServiceAccount jenkins-deployer existe déjà"
            else
              cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: jenkins-deployer
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: jenkins-deployer-binding
subjects:
  - kind: ServiceAccount
    name: jenkins-deployer
    namespace: default
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
EOF
              echo "ServiceAccount jenkins-deployer créé ✓"
            fi
          '''
        }
      }
    }

    stage('Check Tools') {
      parallel {
        stage('Kubectl Version') {
          steps {
            container('kubectl') {
              sh '''

                kubectl version --client --output=yaml
              '''
            }
          }
        }
        stage('Helm Version') {
          steps {
            container('helm') {
              sh '''

                helm version
                helm repo list || echo "Aucun repo configuré"
              '''
            }
          }
        }
      }
    }

    stage('Validate Charts') {
      steps {
        container('helm') {
          sh '''


            if [ ! -d "./charts/frontend-chart" ]; then
              echo "ERREUR: Chart frontend introuvable"
              exit 1
            fi

            if [ ! -d "./charts/backend-chart" ]; then
              echo "ERREUR: Chart backend introuvable"
              exit 1
            fi

            echo "Validation frontend chart..."
            helm lint ./charts/frontend-chart

            echo "Validation backend chart..."
            helm lint ./charts/backend-chart

            echo "Charts validés ✓"
          '''
        }
      }
    }

    stage('Deploy Applications') {
      parallel {
        stage('Deploy Frontend') {
          steps {
            container('helm') {
              sh '''


                helm upgrade --install todo-frontend ./charts/frontend-chart \
                  -f ./charts/frontend-chart/values.yaml \
                  --namespace default \
                  --create-namespace \
                  --wait \
                  --timeout=300s \
                  --debug

                echo "Frontend déployé ✓"
              '''
            }
          }
        }
        stage('Deploy Backend') {
          steps {
            container('helm') {
              sh '''


                helm upgrade --install todo-backend ./charts/backend-chart \
                  -f ./charts/backend-chart/values.yaml \
                  --namespace default \
                  --create-namespace \
                  --wait \
                  --timeout=300s \
                  --debug

                echo "Backend déployé ✓"
              '''
            }
          }
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        container('kubectl') {
          sh '''

            kubectl wait --for=condition=Ready pod -l app=todo-frontend --timeout=120s || true
            kubectl wait --for=condition=Ready pod -l app=todo-backend --timeout=120s || true

            kubectl get pods -o wide
            kubectl get svc
            kubectl get ingress || echo "Pas d'ingress configuré"

            kubectl get deployments
            kubectl describe deployment todo-frontend || true
            kubectl describe deployment todo-backend || true

            # Vérifier la santé des applications
            echo "=== Test de santé ==="
            FRONTEND_POD=$(kubectl get pod -l app=todo-frontend -o jsonpath='{.items[0].metadata.name}' || echo "")
            BACKEND_POD=$(kubectl get pod -l app=todo-backend -o jsonpath='{.items[0].metadata.name}' || echo "")

            if [ ! -z "$FRONTEND_POD" ]; then
              echo "Frontend pod: $FRONTEND_POD"
              kubectl logs $FRONTEND_POD --tail=5 || true
            fi

            if [ ! -z "$BACKEND_POD" ]; then
              echo "Backend pod: $BACKEND_POD"
              kubectl logs $BACKEND_POD --tail=5 || true
            fi
          '''
        }
      }
    }

    stage('Health Check') {
      steps {
        container('kubectl') {
          sh '''
            echo "=== Vérification finale ==="

            # Lister les releases Helm
            helm list -n default

            # Vérifier le statut des services
            kubectl get endpoints

            echo "Déploiement terminé ✓"
          '''
        }
      }
    }
  }

  post {
    always {
      container('kubectl') {
        sh '''
          echo "=== Nettoyage et logs finaux ==="
          kubectl get all -n default
        '''
      }
    }
    success {
      echo '🎉 Déploiement réussi !'
      // Optionnel: notification Slack, email, etc.
    }
    failure {
      container('kubectl') {
        sh '''
          echo "❌ Échec du déploiement — Investigation :"

          echo "=== Événements récents ==="
          kubectl get events --sort-by=.metadata.creationTimestamp --field-selector type=Warning -n default || true

          echo "=== Description des pods problématiques ==="
          kubectl get pods -n default | grep -E "(Error|CrashLoopBackOff|ImagePullBackOff)" || echo "Aucun pod en erreur détecté"

          kubectl describe pods -l app=todo-frontend || true
          kubectl describe pods -l app=todo-backend || true

          echo "=== Logs des conteneurs ==="
          kubectl logs -l app=todo-frontend --tail=50 --previous || true
          kubectl logs -l app=todo-backend --tail=50 --previous || true
          kubectl logs -l app=todo-frontend --tail=50 || true
          kubectl logs -l app=todo-backend --tail=50 || true

          echo "=== État des releases Helm ==="
          helm list -n default || true
          helm status todo-frontend -n default || true
          helm status todo-backend -n default || true
        '''
      }
    }
    unstable {
      echo '⚠️ Déploiement instable - vérification requise'
    }
  }
}