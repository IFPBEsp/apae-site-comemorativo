# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile for APAE Site Comemorativo
# This file creates a development environment with Docker

Vagrant.configure("2") do |config|
  # Define the VM
  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "apae-dev"
  
  # Configure the VM
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = 2
    vb.name = "APAE Development"
  end
  
  # Configure the VM for other providers
  config.vm.provider "vmware_desktop" do |vmware|
    vmware.memory = "2048"
    vmware.cpus = 2
    vmware.name = "APAE Development"
  end
  
  # Network configuration
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 5432, host: 5432
  config.vm.network "forwarded_port", guest: 9000, host: 9000
  config.vm.network "forwarded_port", guest: 9001, host: 9001
  
  # Sync folders
  config.vm.synced_folder ".", "/vagrant", disabled: false
  config.vm.synced_folder "./data", "/vagrant/data", create: true
  
  # Provision the VM
  config.vm.provision "shell", inline: <<-SHELL
    # Update system
    apt-get update
    apt-get upgrade -y
    
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker vagrant
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt-get install -y nodejs
    
    # Install additional tools
    apt-get install -y git curl wget vim jq
    
    # Create application directory
    mkdir -p /opt/apae-site-comemorativo
    cp -r /vagrant/* /opt/apae-site-comemorativo/
    chown -R vagrant:vagrant /opt/apae-site-comemorativo
    
    # Setup application
    cd /opt/apae-site-comemorativo
    chmod +x scripts/*.sh
    
    # Create environment file
    cp env.example .env
    
    # Install Node.js dependencies
    npm install
    
    # Start services
    docker-compose up -d postgres minio
    
    # Wait for services
    sleep 30
    
    # Run migrations
    npx prisma migrate deploy
    npx prisma generate
    
    # Setup MinIO
    ./scripts/init-minio.sh
    
    # Run tests
    ./scripts/test-integration.sh
    
    echo "APAE Site Comemorativo development environment is ready!"
    echo "Application: http://localhost:3000"
    echo "PostgreSQL: localhost:5432"
    echo "MinIO Console: http://localhost:9001"
  SHELL
  
  # Configure the VM
  config.vm.provision "shell", run: "always", inline: <<-SHELL
    # Start the application
    cd /opt/apae-site-comemorativo
    docker-compose up -d
  SHELL
end
