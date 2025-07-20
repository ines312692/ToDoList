# Guide de Contribution pour le Chart Helm Backend

Ce document explique comment contribuer au chart Helm du backend de l'application ToDo.

## Structure du Chart

Le chart Helm du backend est organisé comme suit:

```
backend-chart/
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
- `name`: Nom du chart (todo-backend)
- `description`: Description du chart
- `version`: Version du chart (0.1.0)

### values.yaml

Ce fichier contient les valeurs de configuration par défaut:
- `replicaCount`: Nombre de réplicas du déploiement (1 par défaut)
- `image`: Configuration de l'image Docker
  - `repository`: Nom du repository de l'image (todo-backend)
  - `tag`: Tag de l'image (latest par défaut)
  - `pullPolicy`: Politique de récupération de l'image (Never par défaut)
- `service`: Configuration du service Kubernetes
  - `type`: Type de service (ClusterIP par défaut)
  - `port`: Port exposé par le service (3001 par défaut)
- `containerPort`: Port exposé par le conteneur (3001 par défaut)

### templates/deployment.yaml

Ce template définit le déploiement Kubernetes pour l'application backend:
- Utilise les valeurs de `replicaCount` pour définir le nombre de réplicas
- Configure le conteneur avec l'image spécifiée dans `values.yaml`
- Expose le port du conteneur défini dans `values.yaml`

### templates/service.yaml

Ce template définit le service Kubernetes pour accéder à l'application backend:
- Utilise le type de service spécifié dans `values.yaml`
- Configure les ports selon les valeurs dans `values.yaml`
- Sélectionne les pods créés par le déploiement

### templates/_helpers.tpl

Ce fichier contient des templates d'aide utilisés dans les autres fichiers:
- `todo-backend.name`: Génère le nom de l'application
- `todo-backend.fullname`: Crée un nom d'application complet qualifié
- `todo-backend.chart`: Crée une chaîne de nom et version du chart
- `todo-backend.labels`: Définit des labels communs pour les ressources
- `todo-backend.selectorLabels`: Définit des labels de sélecteur pour les ressources

## Comment Personnaliser le Chart

### Modification des Valeurs par Défaut

Pour personnaliser le déploiement, modifiez le fichier `values.yaml` ou fournissez un fichier de valeurs personnalisé lors du déploiement:

```bash
helm install -f mes-valeurs.yaml mon-backend ./backend-chart
```

### Ajout de Nouvelles Ressources

Pour ajouter de nouvelles ressources Kubernetes:
1. Créez un nouveau fichier YAML dans le répertoire `templates/`
2. Utilisez les templates d'aide de `_helpers.tpl` pour maintenir la cohérence
3. Référencez les valeurs de configuration depuis `.Values`

### Modification des Templates Existants

Lors de la modification des templates existants:
1. Assurez-vous de comprendre la syntaxe des templates Go utilisée par Helm
2. Testez vos modifications avec `helm template ./backend-chart`
3. Vérifiez que les ressources générées sont valides

## Déploiement du Chart

### Installation

```bash
# Installation avec les valeurs par défaut
helm install mon-backend ./backend-chart

# Installation avec des valeurs personnalisées
helm install -f mes-valeurs.yaml mon-backend ./backend-chart
```

### Mise à Jour

```bash
# Mise à jour avec les valeurs par défaut
helm upgrade mon-backend ./backend-chart

# Mise à jour avec des valeurs personnalisées
helm upgrade -f mes-valeurs.yaml mon-backend ./backend-chart
```

### Désinstallation

```bash
helm uninstall mon-backend
```

## Bonnes Pratiques

1. **Versionnement**: Incrémentez la version dans `Chart.yaml` pour chaque modification significative
2. **Documentation**: Documentez toutes les valeurs configurables dans `values.yaml`
3. **Tests**: Testez vos modifications avec `helm template` et `helm lint`
4. **Compatibilité**: Assurez-vous que vos modifications sont compatibles avec les versions précédentes
5. **Sécurité**: Évitez de coder en dur des secrets ou des informations sensibles

## Processus de Contribution

1. Créez une branche pour vos modifications
2. Effectuez vos modifications en suivant les bonnes pratiques
3. Testez vos modifications
4. Soumettez une pull request avec une description détaillée des changements
5. Attendez la revue et l'approbation avant de fusionner

## Conclusion

Ce chart Helm permet de déployer facilement l'application backend de ToDo sur un cluster Kubernetes. En suivant ce guide, vous pourrez contribuer efficacement à son développement et à sa maintenance.