pipeline {
  agent {
    kubernetes {
      inheritFrom 'k8s'
      defaultContainer 'helm'
      serviceAccount 'jenkins-deployer'
    }
  }

  stages {
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
            echo "=== Verification RBAC ==="
            kubectl get serviceaccount jenkins-deployer -n default -o yaml
            kubectl get clusterrolebinding jenkins-deployer-binding -o yaml
          '''
        }
      }
    }

    stage('Deploy Frontend') {
      steps {
        container('helm') {
          sh '''
            helm upgrade --install todo-frontend ./charts/frontend-chart \
              -f ./charts/frontend-chart/values.yaml \
              --namespace jenkins-developer \
              --create-namespace \
              --wait \
              --timeout=300s \
              --debug
            echo "Frontend déployé "
          '''
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        container('kubectl') {
          sh '''
            kubectl wait --for=condition=Ready pod -l app=todo-frontend --namespace jenkins-developer --timeout=120s || true
            kubectl wait --for=condition=Ready pod -l app=todo-backend --namespace jenkins-developer --timeout=120s || true
            kubectl get pods -o wide --namespace jenkins-developer
            kubectl get svc --namespace jenkins-developer
            kubectl get ingress --namespace jenkins-developer || echo "Pas d'ingress configuré"
            ...
          '''
        }
      }
    }
    ...
  }
}