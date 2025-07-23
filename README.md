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
│   ├── frontend-build/                  
│   │   |── Jenkinsfile             
├   |── frontend-deploy/                    
│   │   ├── Jenkinsfile             
│   │  
├── To_Do_List_Backend/         # Backend Express application
│   ├── src/                    # Source code
│   │   ├── app.js              # Main application file
│   │   └── data/               # Data storage directory
│   └── Dockerfile              # Backend Docker configuration
│   ├── backend-build/                   
│   │   |── Jenkinsfile             
├   |── backend-deploy/                    
│   │   ├── Jenkinsfile             
│   │ 
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

1. Configure Jenkins with the appropriate Kubernetes access
2. Create a new pipeline job pointing to the repository
3. Set up separate Jenkins jobs for frontend and backend build and deployment:
   - `frontend-build`: Builds the frontend Docker image and pushes it to Docker Hub
   - `backend-build`: Builds the backend Docker image and pushes it to Docker Hub
   - `frontend-deploy`: Deploys the frontend application using Helm
   - `backend-deploy`: Deploys the backend application using Helm
4. The main pipeline will:
   - Run in a Kubernetes environment with the 'jenkins-master' label
   - Use the 'jenkins-deployer' service account in the 'default' namespace
   - Deploy to the 'jenkins-developer' namespace
   - Execute frontend and backend build jobs in parallel
   - Execute frontend and backend deployment jobs in parallel
   - Provide a summary of all deployed resources
   - Display detailed error information in case of failure

### CI/CD Pipeline Details

The CI/CD pipeline consists of several stages:

#### Build Stage
- Builds Docker images for both frontend and backend applications
- Authenticates with Docker Hub using credentials stored in Jenkins
- Pushes the built images to Docker Hub under the repository `inestmimi123/todo-frontend` and `inestmimi123/todo-backend`
- Images are tagged with 'latest' by default

#### Deploy Stage
- Uses Helm to deploy the applications to a Kubernetes cluster
- Deploys to the 'jenkins-developer' namespace
- Uses the Helm charts located in the `charts/` directory

Note: Some log messages in the Jenkins pipeline may appear in French.

### Docker Compose Deployment
While the current Jenkins pipeline focuses on Helm chart deployment, Docker Compose provides an alternative method for simpler deployments. This could be implemented as an additional deployment option in the pipeline.

### Kubernetes Deployment with Helm Charts
For more scalable and robust deployments, the application can be deployed to a Kubernetes cluster using Helm charts:

1. The Jenkins pipeline uses the configured Kubernetes credentials (configminikube)
2. It prepares the kubeconfig file for Kubernetes access
3. It deploys the application using Helm charts:
   - Deploys the frontend using `helm upgrade --install todo-frontend ./charts/frontend-chart -f ./charts/frontend-chart/values.yaml --namespace jenkins-developer`
   - Deploys the backend using `helm upgrade --install todo-backend ./charts/backend-chart -f ./charts/backend-chart/values.yaml --namespace jenkins-developer`
4. The Helm charts manage the Kubernetes resources (deployments, services, etc.)
5. The application is then accessible through the Kubernetes service

#### Helm Chart Configuration

The Helm charts are configured with the following key settings:

**Backend Chart:**
- Image: `inestmimi123/todo-backend:latest`
- Service: ClusterIP on port 3000
- Persistence: Enabled with a 1Gi volume for data storage
- Resources:
  - Limits: 500m CPU, 512Mi memory
  - Requests: 250m CPU, 256Mi memory
- Service Account: Uses 'jenkins-deployer'

**Frontend Chart:**
- Image: `inestmimi123/todo-frontend:latest`
- Service: ClusterIP on port 80
- No persistence required

The Helm charts provide several benefits:
- Templated Kubernetes manifests for easier configuration
- Version control of deployments
- Simplified rollbacks
- Environment-specific configurations using values files
- Resource management and scaling capabilities

## Data Persistence

Task and user data is stored in a JSON file within a persistent storage volume, ensuring data persistence across container restarts:

- In Docker Compose deployment: Uses a Docker volume
- In Kubernetes deployment: Uses a Persistent Volume Claim (PVC) with 1Gi storage
  - The backend Helm chart configures a PVC with ReadWriteOnce access mode
  - This ensures that task and user data is preserved even if the backend pod is rescheduled or restarted

## Health Checks and Monitoring

The application includes built-in health check mechanisms to ensure service availability:

### Backend Health Check
- The backend service exposes a `/health` endpoint that returns the service status
- In Docker Compose deployment, a health check is configured to:
  - Test the endpoint every 30 seconds
  - Timeout after 10 seconds
  - Retry up to 3 times before marking the service as unhealthy

### Monitoring
- The Jenkins pipeline includes a summary stage that displays all Kubernetes resources in the deployment namespace
- In case of deployment failure, the pipeline automatically retrieves the most recent Kubernetes events to aid in troubleshooting

## Project Status and Roadmap

### Current Status
This project is currently operational and includes all the core functionality described in the features section. The application has been containerized and can be deployed using Docker Compose, Kubernetes, or Helm charts.

The CI/CD pipeline is fully functional, with separate build and deployment stages for both frontend and backend components. Docker images are automatically built and pushed to Docker Hub, and deployment to Kubernetes is handled through Helm charts.

### Future Improvements
Potential enhancements for future versions:
- Implement user authentication and authorization
- Add task categories and priority levels
- Implement task search and filtering capabilities
- Add email notifications for task due dates
- Enhance the UI with responsive design for mobile devices
- Implement a database backend instead of file-based storage
- Add comprehensive test coverage
- Set up automated testing in the CI/CD pipeline
- Implement horizontal scaling for the backend service
- Add monitoring and alerting using Prometheus and Grafana
- Implement a more sophisticated ingress configuration with TLS
