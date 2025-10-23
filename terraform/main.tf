# Terraform configuration for APAE Site Comemorativo
# This configuration creates the infrastructure for the application

terraform {
  required_version = ">= 1.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Network for the application
resource "docker_network" "apae_network" {
  name = "apae-network"
}

# PostgreSQL container
resource "docker_container" "postgres" {
  name  = "apae-postgres"
  image = "postgres:15-alpine"
  
  env = [
    "POSTGRES_DB=apae_db",
    "POSTGRES_USER=apae_user",
    "POSTGRES_PASSWORD=apae_password"
  ]
  
  ports {
    internal = 5432
    external = 5432
  }
  
  volumes {
    host_path      = "${path.cwd}/postgres-data"
    container_path = "/var/lib/postgresql/data"
  }
  
  networks_advanced {
    name = docker_network.apae_network.name
  }
  
  restart = "unless-stopped"
}

# MinIO container
resource "docker_container" "minio" {
  name  = "apae-minio"
  image = "minio/minio:latest"
  
  command = ["server", "/data", "--console-address", ":9001"]
  
  env = [
    "MINIO_ROOT_USER=minioadmin",
    "MINIO_ROOT_PASSWORD=minioadmin123"
  ]
  
  ports {
    internal = 9000
    external = 9000
  }
  
  ports {
    internal = 9001
    external = 9001
  }
  
  volumes {
    host_path      = "${path.cwd}/minio-data"
    container_path = "/data"
  }
  
  networks_advanced {
    name = docker_network.apae_network.name
  }
  
  restart = "unless-stopped"
}

# Application container
resource "docker_image" "apae_app" {
  name = "apae-app:latest"
  build {
    context = "."
  }
}

resource "docker_container" "app" {
  name  = "apae-app"
  image = docker_image.apae_app.image_id
  
  env = [
    "DATABASE_URL=postgresql://apae_user:apae_password@postgres:5432/apae_db",
    "MINIO_ENDPOINT=http://minio:9000",
    "MINIO_ACCESS_KEY=minioadmin",
    "MINIO_SECRET_KEY=minioadmin123",
    "NODE_ENV=production"
  ]
  
  ports {
    internal = 3000
    external = 3000
  }
  
  networks_advanced {
    name = docker_network.apae_network.name
  }
  
  restart = "unless-stopped"
  
  depends_on = [
    docker_container.postgres,
    docker_container.minio
  ]
}
