# Deploying the Application with Docker

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Steps to Deploy

1. **Clone the repository**:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Build and start the containers**:
    ```sh
    docker-compose up --build
    ```

3. **Access the application**:
    Open your browser and navigate to `http://localhost:3000`.

## Stopping the Containers

To stop the running containers, use:
```sh
docker-compose down