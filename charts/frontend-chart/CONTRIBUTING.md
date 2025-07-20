# Guide de Contribution pour le Chart Helm Frontend

Ce document explique comment contribuer au chart Helm du frontend de l'application ToDo.

## Structure du Chart

Le chart Helm du frontend est organisé comme suit:

```
frontend-chart/
├── Chart.yaml             # Métadonnées du chart (nom, version, description)
├── values.yaml            # Valeurs de configuration par défaut
└── templates/             # Templates Kubernetes
    ├── deployment.yaml    # Définition du déploiement
    ├── service.yaml       # Définition du service
    └── _helpers.tpl       # Templates d'aide pour la génération de noms et labels
```

## Fichiers Principaux

### Chart.yaml

Ce fichier contient les métadonnées du chart:
- `apiVersion`: Version de l'API Helm (v2)
- `name`: Nom du chart (frontend-chart)
- `description`: Description du chart (Helm chart for Angular frontend)
- `version`: Version du chart (0.1.0)

### values.yaml

Ce fichier contient les valeurs de configuration par défaut:
- `replicaCount`: Nombre de réplicas du déploiement (1 par défaut)
- `image`: Configuration de l'image Docker
  - `repository`: Nom du repository de l'image (todo-frontend)
  - `tag`: Tag de l'image (latest par défaut)
  - `pullPolicy`: Politique de récupération de l'image (Never par défaut)
- `service`: Configuration du service Kubernetes
  - `type`: Type de service (NodePort par défaut)
  - `port`: Port exposé par le service (80 par défaut)
- `containerPort`: Port exposé par le conteneur (80 par défaut)

### templates/deployment.yaml

Ce template définit le déploiement Kubernetes pour l'application frontend:
- Utilise les valeurs de `replicaCount` pour définir le nombre de réplicas
- Configure le conteneur avec l'image spécifiée dans `values.yaml`
- Expose le port du conteneur défini dans `values.yaml`

### templates/service.yaml

Ce template définit le service Kubernetes pour accéder à l'application frontend:
- Utilise le type de service spécifié dans `values.yaml` (NodePort par défaut)
- Configure les ports selon les valeurs dans `values.yaml`
- Sélectionne les pods créés par le déploiement

### templates/_helpers.tpl

Ce fichier contient des templates d'aide utilisés dans les autres fichiers:
- `frontend-chart.name`: Génère le nom de l'application
- `frontend-chart.fullname`: Crée un nom d'application complet qualifié
- `frontend-chart.chart`: Crée une chaîne de nom et version du chart
- `frontend-chart.labels`: Définit des labels communs pour les ressources
- `frontend-chart.selectorLabels`: Définit des labels de sélecteur pour les ressources

## Comment Personnaliser le Chart

### Modification des Valeurs par Défaut

Pour personnaliser le déploiement, modifiez le fichier `values.yaml` ou fournissez un fichier de valeurs personnalisé lors du déploiement:

```bash
helm install -f mes-valeurs.yaml mon-frontend ./frontend-chart
```

### Ajout de Nouvelles Ressources

Pour ajouter de nouvelles ressources Kubernetes:
1. Créez un nouveau fichier YAML dans le répertoire `templates/`
2. Utilisez les templates d'aide de `_helpers.tpl` pour maintenir la cohérence
3. Référencez les valeurs de configuration depuis `.Values`

### Modification des Templates Existants

Lors de la modification des templates existants:
1. Assurez-vous de comprendre la syntaxe des templates Go utilisée par Helm
2. Testez vos modifications avec `helm template ./frontend-chart`
3. Vérifiez que les ressources générées sont valides

## Déploiement du Chart

### Installation

```bash
# Installation avec les valeurs par défaut
helm install mon-frontend ./frontend-chart

# Installation avec des valeurs personnalisées
helm install -f mes-valeurs.yaml mon-frontend ./frontend-chart
```

### Mise à Jour

```bash
# Mise à jour avec les valeurs par défaut
helm upgrade mon-frontend ./frontend-chart

# Mise à jour avec des valeurs personnalisées
helm upgrade -f mes-valeurs.yaml mon-frontend ./frontend-chart
```

### Désinstallation

```bash
helm uninstall mon-frontend
```

## Bonnes Pratiques

1. **Versionnement**: Incrémentez la version dans `Chart.yaml` pour chaque modification significative
2. **Documentation**: Documentez toutes les valeurs configurables dans `values.yaml`
3. **Tests**: Testez vos modifications avec `helm template` et `helm lint`
4. **Compatibilité**: Assurez-vous que vos modifications sont compatibles avec les versions précédentes
5. **Sécurité**: Évitez de coder en dur des secrets ou des informations sensibles

## Considérations Spécifiques au Frontend

1. **Exposition du Service**: Le service est configuré comme NodePort par défaut pour permettre l'accès externe à l'interface utilisateur
2. **Configuration de l'Application**: Si l'application frontend nécessite des variables d'environnement ou des configurations spécifiques, ajoutez-les dans `values.yaml` et référencez-les dans le template de déploiement
3. **Ressources Statiques**: Si l'application frontend contient des ressources statiques (images, CSS, JS), assurez-vous qu'elles sont correctement incluses dans l'image Docker

## Processus de Contribution

1. Créez une branche pour vos modifications
2. Effectuez vos modifications en suivant les bonnes pratiques
3. Testez vos modifications
4. Soumettez une pull request avec une description détaillée des changements
5. Attendez la revue et l'approbation avant de fusionner

## Conclusion

Ce chart Helm permet de déployer facilement l'application frontend Angular de ToDo sur un cluster Kubernetes. En suivant ce guide, vous pourrez contribuer efficacement à son développement et à sa maintenance.