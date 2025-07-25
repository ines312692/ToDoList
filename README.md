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
├── docker-compose.yml          # Docker Compose configuration
├── Jenkinsfile                 # Jenkins CI/CD pipeline
└── README.md                   # Project documentation
```

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- Node.js and npm (for local development)

### Using Docker Compose (Recommended)
1. Clone the repository
2. Navigate to the project root directory
3. Run the application using Docker Compose:
   ```
   docker-compose up -d
   ```
4. Access the application at http://localhost:8081

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

1. Configure Jenkins with appropriate Docker permissions
2. Create a new pipeline job pointing to the repository
3. The pipeline will:
    - Build Docker images for frontend and backend
    - Run tests
    - Deploy the application using Docker Compose

## Data Persistence

Task and user data is stored in a JSON file within a Docker volume, ensuring data persistence across container restarts.