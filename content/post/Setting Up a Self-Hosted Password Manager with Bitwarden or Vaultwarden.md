---
title: Setting Up a Self-Hosted Password Manager with Bitwarden or Vaultwarden
date: 2024-12-06
tags:
  - homelab
  - self-hosted
  - password
  - manager
  - Bitwarden
  - Vaultwarden
categories:
  - Homelab Guides
draft: false
showToc: true
---

## What You’ll Need

- A server or virtual machine (minimum: 1 GB RAM and 1 CPU).  
- Docker installed on your server.  
- A static IP or domain name for accessing the password manager.  

---

## Step 1: Decide Between Bitwarden and Vaultwarden

### **Bitwarden**  
- Official version with robust features and frequent updates.  
- Requires more resources and supports paid features like OTP generation.

### **Vaultwarden (formerly Bitwarden_rs)**  
- Lightweight, community-built alternative to Bitwarden.  
- Perfect for homelabs or low-resource servers.  
- Compatible with most Bitwarden clients.

For most homelab users, **Vaultwarden** is recommended due to its lightweight nature.

---

## Step 2: Install Docker (If Not Installed)

1. **Update your system**:  
    ````bash
    sudo apt update && sudo apt upgrade -y
    ````

2. **Install Docker**:  
    ````bash
    sudo apt install -y docker.io
    ````

3. **Enable Docker to start on boot**:  
    ````bash
    sudo systemctl enable docker
    ````

---

## Step 3: Deploy Vaultwarden

1. **Create a directory for Vaultwarden**:  
    ````bash
    mkdir -p ~/vaultwarden
    ````

2. **Run the Vaultwarden container**:  
    ````bash
    docker run -d --name vaultwarden -p 8080:80 \
      -v ~/vaultwarden:/data \
      vaultwarden/server:latest
    ````

3. **Access Vaultwarden**:  
   - Open your browser and navigate to `http://<server_ip>:8080`.  
   - Create an admin account to start managing your passwords.

---

## Step 4: Configure HTTPS for Security

### Option 1: Use a Reverse Proxy (Recommended)

1. **Install Nginx**:  
    ````bash
    sudo apt install -y nginx
    ````

2. **Create an Nginx configuration file**:  
    ````bash
    sudo nano /etc/nginx/sites-available/vaultwarden
    ````

3. **Add the following configuration**:  
    ````nginx
    server {
        listen 80;
        server_name yourdomain.com;

        location / {
            proxy_pass http://127.0.0.1:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
    ````

   - Replace `yourdomain.com` with your actual domain name.

4. **Enable the site and restart Nginx**:  
    ````bash
    sudo ln -s /etc/nginx/sites-available/vaultwarden /etc/nginx/sites-enabled/
    sudo systemctl restart nginx
    ````

5. **Install Certbot for HTTPS**:  
    ````bash
    sudo apt install -y certbot python3-certbot-nginx
    ````

6. **Obtain an SSL certificate**:  
    ````bash
    sudo certbot --nginx -d yourdomain.com
    ````

### Option 2: Use Vaultwarden's Built-in HTTPS (Optional)

1. Generate an SSL certificate (e.g., with Let's Encrypt or a self-signed cert).  
2. Place the certificate and key in the Vaultwarden data directory.  
3. Restart the Vaultwarden container with HTTPS ports mapped.

---

## Step 5: Access and Use Vaultwarden

1. **Install Bitwarden Clients**:  
   - Download the Bitwarden app for your desktop or mobile devices.  
   - Use the web browser extension for autofill capabilities.

2. **Log in using your server URL**:  
   - Set the server URL to `https://yourdomain.com` during client setup.  

3. **Start securely storing and managing your passwords**.

---

## FAQs

**Q: Why use Vaultwarden instead of the official Bitwarden?**  
A: Vaultwarden is lightweight and ideal for self-hosting, especially on resource-constrained devices.

**Q: Can I use 2FA with Vaultwarden?**  
A: Yes, Vaultwarden supports two-factor authentication (TOTP, Yubikey, etc.).

**Q: How do I back up my Vaultwarden data?**  
A: Back up the `~/vaultwarden` directory regularly. For example:  
    ````bash
    tar -czvf vaultwarden-backup.tar.gz ~/vaultwarden
    ````

**Q: Can I enable user registration for others?**  
A: Yes, enable it in the Vaultwarden admin panel under the "User Management" section.

**Q: What happens if my Vaultwarden server goes offline?**  
A: You can still access locally cached passwords on your devices, but synchronization will stop until the server is back online.

**Q: How do I update Vaultwarden?**  
A: Pull the latest Docker image and restart the container:  
    ````bash
    docker pull vaultwarden/server:latest
    docker stop vaultwarden
    docker rm vaultwarden
    docker run -d --name vaultwarden -p 8080:80 \
      -v ~/vaultwarden:/data \
      vaultwarden/server:latest
    ````

**Q: Is Vaultwarden secure?**  
A: Yes, Vaultwarden is designed with security in mind. Ensure you enable HTTPS, use strong admin credentials, and keep the software updated.

---

By setting up Vaultwarden, you can take control of your password management in a secure, private, and cost-effective way. Happy homelabbing!
