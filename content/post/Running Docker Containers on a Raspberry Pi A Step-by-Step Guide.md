---
title: "Running Docker Containers on a Raspberry Pi: A Step-by-Step Guide"
date: 2024-12-04
tags: ["homelab", "Raspberry Pi", "Docker", "containers"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---
Docker containers are lightweight and portable, making them a great tool for running applications in your homelab. A Raspberry Pi is an ideal low-cost, low-power device for hosting Docker containers. This guide will walk you through setting up Docker on a Raspberry Pi and deploying your first container.

---

## What You’ll Need

- A Raspberry Pi (recommended: Raspberry Pi 3, 4, or newer).  
- MicroSD card with Raspberry Pi OS Lite installed.  
- A stable internet connection.  
- Basic knowledge of Linux commands.  

---

## Step 1: Update and Prepare Your Raspberry Pi

1. **Log into your Raspberry Pi via SSH**:  
```
ssh pi@<raspberry_pi_ip_address>
```
2. **Update and upgrade the system packages**:  
```
sudo apt update && sudo apt upgrade -y
```
3. **Install prerequisite packages**:  
```
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
```

---

## Step 2: Install Docker on the Raspberry Pi

1. **Download the official Docker installation script**:  
```
curl -fsSL https://get.docker.com -o get-docker.sh
```
2. **Run the installation script**:  
```
sudo sh get-docker.sh
```
3. **Add your user to the `docker` group** (replace `pi` with your username if different):  
```
sudo usermod -aG docker pi
```
Log out and back in to apply the changes.  

4. **Verify the Docker installation**:  
```
docker --version
```

---

## Step 3: Enable Docker to Start on Boot

1. Enable the Docker service:  
```
sudo systemctl enable docker
```
2. Check that Docker is running:  
```
sudo systemctl status docker
```

---

## Step 4: Deploy Your First Docker Container

1. Pull an official Docker image (e.g., Nginx):  
```
docker pull nginx
```
2. Run a container using the image:  
```
docker run -d -p 8080:80 --name webserver nginx
```
3. Open a web browser and navigate to `http://<raspberry_pi_ip_address>:8080`. You should see the default Nginx page.

---

## Step 5: Manage Docker Containers

1. List running containers:  
```
docker ps
```
2. Stop a container:  
```
docker stop webserver
```
3. Restart a container:  
```
docker start webserver
```
4. Remove a container:  
```
docker rm webserver
```

---

## Step 6: Use Docker Compose (Optional)

Docker Compose is a tool for managing multi-container applications.  

1. **Install Docker Compose**:  
```
sudo apt install docker-compose
```
2. **Create a `docker-compose.yml` file**:  
Example:  
```
yaml
version: "3.9"
services:
  app:
    image: nginx
    ports:
      - "8080:80"
```
3. **Run the application**: 
```
docker-compose up -d
```
4. **Stop the application**: 
```
docker-compose down
```

## FAQs

**Q: Can I use Docker on older Raspberry Pi models?**  
A: Yes, but performance may be limited on older models like Raspberry Pi 1 or Zero due to resource constraints.

**Q: Do I need a 64-bit OS to run Docker on a Raspberry Pi?**  
A: While Docker runs on 32-bit systems, using a 64-bit OS is recommended for better compatibility and performance.

**Q: How do I update Docker?**  
A: Use the following commands to update Docker:
```
sudo apt update && sudo apt upgrade -y
```

**Q: Can I run multiple containers at once?**  
A: Yes, Docker is designed for running multiple containers simultaneously. Use `docker-compose` to manage multi-container applications easily.

**Q: What happens if my Raspberry Pi reboots?**  
A: Containers will not start automatically unless you specify the `--restart` flag when running a container:
```
docker run -d --restart unless-stopped <image>
```

**Q: How do I clean up unused Docker resources?**  
A: Use the following command to remove unused images, containers, and volumes:
```
docker system prune -a
```

**Q: Can I access containers from outside my network?**  
A:Yes, configure port forwarding on your router to expose the container's ports to the internet. Be cautious and secure your setup. 

---

Running Docker on a Raspberry Pi is a fantastic way to explore containerized applications in your homelab. From web servers to databases, the possibilities are endless. Happy containerizing!