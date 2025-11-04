# Makefile for APAE Site Comemorativo
# This file provides convenient commands for development and deployment

.PHONY: help setup dev prod test clean backup restore monitor

# Default target
help: ## Show this help message
	@echo "APAE Site Comemorativo - Available Commands:"
	@echo "============================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Setup commands
setup: ## Initial setup of the development environment
	@echo "🚀 Setting up APAE Site Comemorativo..."
	@chmod +x scripts/*.sh
	@./scripts/setup.sh

# Development commands
dev: ## Start development environment
	@echo "🔧 Starting development environment..."
	@./scripts/dev.sh

# Production commands
prod: ## Start production environment
	@echo "🚀 Starting production environment..."
	@./scripts/prod.sh

# Testing commands
test: ## Run integration tests
	@echo "🧪 Running integration tests..."
	@./scripts/test-integration.sh

# Monitoring commands
monitor: ## Monitor services status
	@echo "📊 Monitoring services..."
	@./scripts/monitor.sh

# Backup commands
backup: ## Create backup of data
	@echo "💾 Creating backup..."
	@./scripts/backup.sh

restore: ## Restore data from backup
	@echo "🔄 Restoring data..."
	@./scripts/restore.sh

# Cleanup commands
clean: ## Clean up Docker environment
	@echo "🧹 Cleaning up environment..."
	@./scripts/cleanup.sh

# Docker commands
docker-build: ## Build Docker images
	@echo "🔨 Building Docker images..."
	docker-compose build

docker-up: ## Start Docker services
	@echo "🐳 Starting Docker services..."
	docker-compose up -d

docker-down: ## Stop Docker services
	@echo "🛑 Stopping Docker services..."
	docker-compose down

docker-logs: ## Show Docker logs
	@echo "📋 Showing Docker logs..."
	docker-compose logs -f

docker-ps: ## Show Docker containers
	@echo "📊 Showing Docker containers..."
	docker-compose ps

# Database commands
db-migrate: ## Run database migrations
	@echo "🗄️  Running database migrations..."
	npx prisma migrate deploy

db-generate: ## Generate Prisma client
	@echo "🔧 Generating Prisma client..."
	npx prisma generate

db-reset: ## Reset database
	@echo "🔄 Resetting database..."
	npx prisma migrate reset

db-seed: ## Seed database with initial data
	@echo "🌱 Seeding database..."
	npx prisma db seed

# MinIO commands
minio-setup: ## Setup MinIO buckets
	@echo "📦 Setting up MinIO..."
	@./scripts/init-minio.sh

# Application commands
app-install: ## Install Node.js dependencies
	@echo "📦 Installing dependencies..."
	npm install

app-build: ## Build application
	@echo "🔨 Building application..."
	npm run build

app-start: ## Start application
	@echo "🚀 Starting application..."
	npm start

app-dev: ## Start application in development mode
	@echo "🔧 Starting application in development mode..."
	npm run dev

# Utility commands
logs: ## Show application logs
	@echo "📋 Showing application logs..."
	docker-compose logs -f app

logs-db: ## Show database logs
	@echo "📋 Showing database logs..."
	docker-compose logs -f postgres

logs-minio: ## Show MinIO logs
	@echo "📋 Showing MinIO logs..."
	docker-compose logs -f minio

status: ## Show services status
	@echo "📊 Showing services status..."
	@./scripts/monitor.sh

# Health check
health: ## Check services health
	@echo "🏥 Checking services health..."
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ App: OK" || echo "❌ App: FAIL"
	@curl -f http://localhost:9000/minio/health/live > /dev/null 2>&1 && echo "✅ MinIO: OK" || echo "❌ MinIO: FAIL"
	@docker-compose exec -T postgres pg_isready -U apae_user -d apae_db > /dev/null 2>&1 && echo "✅ PostgreSQL: OK" || echo "❌ PostgreSQL: FAIL"

# Full deployment
deploy: setup docker-up db-migrate minio-setup test ## Full deployment
	@echo "🎉 Deployment completed successfully!"

# Quick start
quick-start: setup dev ## Quick start for development
	@echo "🎉 Development environment is ready!"

# Production deployment
deploy-prod: docker-build docker-up db-migrate minio-setup test ## Production deployment
	@echo "🎉 Production deployment completed successfully!"
