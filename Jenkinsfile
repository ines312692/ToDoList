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
        stage('Setup Jenkins RBAC') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "=== Configuration RBAC pour Jenkins ==="

                        # Créer le service account Jenkins
                        kubectl create serviceaccount jenkins --dry-run=client -o yaml | kubectl apply -f -

                        # Appliquer les permissions RBAC
                        kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: jenkins-role
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods", "services", "endpoints", "persistentvolumeclaims", "events", "configmaps", "secrets"]
  verbs: ["*"]
- apiGroups: ["apps"]
  resources: ["deployments", "daemonsets", "replicasets", "statefulsets"]
  verbs: ["*"]
- apiGroups: ["extensions", "networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["*"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: jenkins-binding
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: jenkins-role
subjects:
- kind: ServiceAccount
  name: jenkins
  namespace: default
EOF

                        echo "=== Vérification des permissions ==="
                        kubectl auth can-i create secrets --as=system:serviceaccount:default:jenkins || echo "Permissions en cours d'application..."
                        kubectl auth can-i list pods --as=system:serviceaccount:default:jenkins || echo "Permissions en cours d'application..."

                        echo "=== Configuration RBAC terminée ==="
                    '''
                }
            }
        }

        stage('Deploy frontend') {
            steps {
                container('helm') {
                    sh '''
                        echo "DEBUG: deploy frontend"
                        export KUBECONFIG=${KUBECONFIG_PATH}

                        kubectl get serviceaccount jenkins || {
                            echo "Service account jenkins n'existe pas, création..."
                            kubectl create serviceaccount jenkins
                        }

                        helm upgrade --install todo-frontend ./charts/frontend-chart \
                            -f ./charts/frontend-chart/values.yaml \
                            --set serviceAccount.name=jenkins \
                            --debug \
                            --wait
                    '''
                }
            }
        }

        stage('Deploy backend') {
            steps {
                container('helm') {
                    sh '''
                        echo "DEBUG: deploy backend"
                        export KUBECONFIG=${KUBECONFIG_PATH}

                        helm upgrade --install todo-backend ./charts/backend-chart \
                            -f ./charts/backend-chart/values.yaml \
                            --set serviceAccount.name=jenkins \
                            --debug \
                            --wait
                    '''
                }
            }
        }

        stage('Verify deployment') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "DEBUG: verify deployment"
                        export KUBECONFIG=${KUBECONFIG_PATH}

                        echo "=== Pod Status ==="
                        kubectl get pods -o wide

                        echo "=== Service Status ==="
                        kubectl get svc

                        echo "=== Deployment Status ==="
                        kubectl get deployments

                        echo "=== Attente des pods ==="
                        kubectl wait --for=condition=ready pod -l app=todo-frontend --timeout=300s || echo "Frontend pods non prêts"
                        kubectl wait --for=condition=ready pod -l app=todo-backend --timeout=300s || echo "Backend pods non prêts"

                        echo "=== État final ==="
                        kubectl get all
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
                    echo "DEBUG: post failure logs"
                    export KUBECONFIG=${KUBECONFIG_PATH}

                    echo "=== Service Accounts ==="
                    kubectl get serviceaccounts

                    echo "=== RBAC Roles ==="
                    kubectl get roles
                    kubectl get rolebindings

                    echo "=== Pod Descriptions ==="
                    kubectl describe pods || true

                    echo "=== Frontend Logs ==="
                    kubectl logs -l app=todo-frontend --tail=20 || true

                    echo "=== Backend Logs ==="
                    kubectl logs -l app=todo-backend --tail=20 || true

                    echo "=== Events ==="
                    kubectl get events --sort-by=.metadata.creationTimestamp || true

                    echo "=== Helm Releases ==="
                    helm list || true
                '''
            }
        }
    }
}
