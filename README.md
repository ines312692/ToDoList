# ToDo List Application

A full-stack task management application that allows users to create, view, and manage their tasks. The application consists of a frontend built with Angular and a backend API built with Express.js.

## Project Overview

This ToDo List application provides the following features:
- User management (select from predefined users)
- Task creation with title, summary, and due date
- Task listing filtered by user
- Task deletion
- Containerized deployment with Docker

## Technologies Used

### Frontend
- Angular (Standalone Components)
- TypeScript
- HTML/CSS
- Nginx (for serving the built application)
- Docker

### Backend
- Node.js
- Express.js
- JSON file-based data storage
- Docker

### DevOps
- Docker Compose for multi-container orchestration
- Kubernetes for container orchestration and deployment
- Jenkins for CI/CD pipeline

## Project Structure

```
ToDo List/
├── To_Do_List/                 # Frontend Angular application
│   ├── src/                    # Source code
│   │   ├── app/                # Angular components
│   │   │   ├── header/         # Header component
│   │   │   ├── tasks/          # Tasks components
│   │   │   ├── user/           # User components
│   │   │   └── service/        # API services
│   ├── Dockerfile              # Frontend Docker configuration
│   └── nginx.conf              # Nginx configuration
│
├── To_Do_List_Backend/         # Backend Express application
│   ├── src/                    # Source code
│   │   ├── app.js              # Main application file
│   │   └── data/               # Data storage directory
│   └── Dockerfile              # Backend Docker configuration
│
├── k8s/                        # Kubernetes deployment files
│   ├── frontend-deployment.yaml # Frontend K8s deployment and service
│   └── backend-deployment.yaml  # Backend K8s deployment and service
│
├── charts/                     # Helm charts for Kubernetes deployment
│   ├── frontend-chart/         # Frontend Helm chart
│   │   ├── templates/          # Kubernetes templates
│   │   │   ├── deployment.yaml # Frontend deployment template
│   │   │   └── service.yaml    # Frontend service template
│   │   ├── Chart.yaml          # Chart metadata
│   │   └── values.yaml         # Default configuration values
│   │
│   └── backend-chart/          # Backend Helm chart
│       ├── templates/          # Kubernetes templates
│       │   ├── deployment.yaml # Backend deployment template
│       │   └── service.yaml    # Backend service template
│       ├── Chart.yaml          # Chart metadata
│       └── values.yaml         # Default configuration values
│
├── docker-compose.yml          # Docker Compose configuration
├── Jenkinsfile                 # Jenkins CI/CD pipeline
└── README.md                   # Project documentation
```

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- Node.js and npm (for local development)
- Minikube or other Kubernetes cluster (for Kubernetes deployment)
- kubectl CLI tool (for Kubernetes deployment)

### Using Docker Compose (Recommended)
1. Clone the repository
2. Navigate to the project root directory
3. Run the application using Docker Compose:
   ```
   docker-compose up -d
   ```
4. Access the application at http://localhost:8081

### Using Kubernetes
1. Clone the repository
2. Start your Kubernetes cluster (e.g., minikube start)
3. Build the Docker images:
   ```
   docker build -t todo-frontend:latest ./To_Do_List/
   docker build -t todo-backend:latest ./To_Do_List_Backend/
   ```
4. If using Minikube, load the images into Minikube:
   ```
   minikube image load todo-frontend:latest
   minikube image load todo-backend:latest
   ```
5. Apply the Kubernetes deployment files:
   ```
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   ```
6. Get the URL to access the frontend service:
   ```
   minikube service todo-frontend-service --url
   ```
7. Access the application using the URL provided by the previous command

### Using Helm Charts
1. Clone the repository
2. Start your Kubernetes cluster (e.g., minikube start)
3. Build the Docker images:
   ```
   docker build -t todo-frontend:latest ./To_Do_List/
   docker build -t todo-backend:latest ./To_Do_List_Backend/
   ```
4. If using Minikube, load the images into Minikube:
   ```
   minikube image load todo-frontend:latest
   minikube image load todo-backend:latest
   ```
5. Install the Helm charts:
   ```
   # Install frontend chart
   helm upgrade --install todo-frontend ./charts/frontend-chart -f ./charts/frontend-chart/values.yaml

   # Install backend chart
   helm upgrade --install todo-backend ./charts/backend-chart -f ./charts/backend-chart/values.yaml
   ```
6. Get the URL to access the frontend service:
   ```
   kubectl get svc todo-frontend -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
   ```
   Or if using Minikube:
   ```
   minikube service todo-frontend --url
   ```
7. Access the application using the URL provided by the previous command

### Local Development Setup

#### Frontend
1. Navigate to the `To_Do_List` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Access the frontend at http://localhost:4200

#### Backend
1. Navigate to the `To_Do_List_Backend` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. The API will be available at http://localhost:3000

## Usage

1. Open the application in your browser
2. Select a user from the available options
3. View existing tasks for the selected user
4. Create new tasks by filling out the form and submitting
5. Delete tasks by clicking the delete button next to a task

## API Endpoints

The backend provides the following RESTful API endpoints:

- `GET /api/users` - Get all users
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks?userId=<id>` - Get tasks for a specific user
- `POST /api/tasks` - Create a new task
- `DELETE /api/tasks/:id` - Delete a task by ID
- `GET /health` - Health check endpoint

## Deployment

The application can be deployed using the included Jenkins pipeline:

1. Configure Jenkins with appropriate Kubernetes access
2. Create a new pipeline job pointing to the repository
3. The pipeline will:
    - Prepare the Kubernetes configuration
    - Deploy the frontend and backend applications using Helm charts
    - Verify the deployment by checking pods and services

### Docker Compose Deployment
While the current Jenkins pipeline focuses on Helm chart deployment, Docker Compose provides an alternative method for simpler deployments. This could be implemented as an additional deployment option in the pipeline.

### Kubernetes Deployment with Helm Charts
For more scalable and robust deployments, the application can be deployed to a Kubernetes cluster using Helm charts:

1. The Jenkins pipeline uses the configured Kubernetes credentials (configminikube)
2. It prepares the kubeconfig file for Kubernetes access
3. It deploys the application using Helm charts:
   - Deploys the frontend using `helm upgrade --install todo-frontend ./charts/frontend-chart`
   - Deploys the backend using `helm upgrade --install todo-backend ./charts/backend-chart`
4. The Helm charts manage the Kubernetes resources (deployments, services, etc.)
5. The application is then accessible through the Kubernetes service

The Helm charts provide several benefits:
- Templated Kubernetes manifests for easier configuration
- Version control of deployments
- Simplified rollbacks
- Environment-specific configurations using values files

## Data Persistence

Task and user data is stored in a JSON file within a Docker volume, ensuring data persistence across container restarts.
