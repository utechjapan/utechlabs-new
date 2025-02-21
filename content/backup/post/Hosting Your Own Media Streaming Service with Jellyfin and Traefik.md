---
title: "Hosting Your Own Media Streaming Service with Jellyfin and Traefik"
date: 2024-12-04
tags: ["homelab", "Jellyfin", "Traefik", "media streaming"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---

## What You’ll Need

- A server or virtual machine with Docker installed.  
- Media files (movies, TV shows, music) stored on the server.  
- A domain name (optional, but recommended for HTTPS setup).  
- Basic knowledge of Docker and reverse proxies.  

---

## Step 1: Install Docker (If Not Installed)

1. **Update the system packages**:  
    ````bash
    sudo apt update && sudo apt upgrade -y
    ````

2. **Install Docker**:  
    ````bash
    sudo apt install -y docker.io
    ````

3. **Enable Docker to start on boot**:  
    ````bash
    sudo systemctl enable docker && sudo systemctl start docker
    ````

---

## Step 2: Deploy Jellyfin with Docker

1. **Create a directory for Jellyfin**:  
    ````bash
    mkdir -p ~/jellyfin/config ~/jellyfin/media
    ````

2. **Run the Jellyfin container**:  
    ````bash
    docker run -d --name jellyfin \
      -v ~/jellyfin/config:/config \
      -v ~/jellyfin/media:/media \
      -p 8096:8096 \
      jellyfin/jellyfin
    ````

3. **Verify the container is running**:  
    ````bash
    docker ps
    ````

4. **Access Jellyfin**:  
   Open your browser and navigate to `http://<server_ip>:8096`.  

---

## Step 3: Set Up Traefik as a Reverse Proxy

1. **Create a directory for Traefik**:  
    ````bash
    mkdir -p ~/traefik
    ````

2. **Create a Traefik configuration file**:  
    ````bash
    nano ~/traefik/traefik.yml
    ````

3. **Add the following configuration**:  
    ````yaml
    entryPoints:
      web:
        address: ":80"
      websecure:
        address: ":443"

    providers:
      docker:
        exposedByDefault: false

    api:
      dashboard: true
    ````

4. **Run the Traefik container**:  
    ````bash
    docker network create web
    docker run -d --name traefik \
      -v ~/traefik/traefik.yml:/etc/traefik/traefik.yml \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -p 80:80 -p 443:443 \
      --network web \
      traefik
    ````

---

## Step 4: Configure Jellyfin for Traefik

1. **Modify the Jellyfin container to use the `web` network**:  
    ````bash
    docker network connect web jellyfin
    ````

2. **Add Traefik labels to the Jellyfin container**:  
    Stop and remove the existing Jellyfin container, then recreate it with labels:  
    ````bash
    docker stop jellyfin && docker rm jellyfin
    docker run -d --name jellyfin \
      -v ~/jellyfin/config:/config \
      -v ~/jellyfin/media:/media \
      -l "traefik.enable=true" \
      -l "traefik.http.routers.jellyfin.rule=Host(`yourdomain.com`)" \
      -l "traefik.http.services.jellyfin.loadbalancer.server.port=8096" \
      --network web \
      jellyfin/jellyfin
    ````

    Replace `yourdomain.com` with your actual domain name.

---

## Step 5: Secure Jellyfin with HTTPS

1. **Obtain an SSL certificate using Traefik and Let’s Encrypt**:  
    Add the following to the `traefik.yml` file:  
    ````yaml
    certificatesResolvers:
      myresolver:
        acme:
          email: your-email@example.com
          storage: /etc/traefik/acme.json
          httpChallenge:
            entryPoint: web
    ````

2. **Create an `acme.json` file for storing certificates**:  
    ````bash
    touch ~/traefik/acme.json
    chmod 600 ~/traefik/acme.json
    ````

3. **Restart Traefik**:  
    ````bash
    docker restart traefik
    ````

4. **Verify HTTPS is enabled**:  
   Open your browser and navigate to `https://yourdomain.com`.

---

## Step 6: Manage and Maintain Jellyfin

1. **Organize your media**:  
   - Place movies, TV shows, and music in separate directories under `~/jellyfin/media`.  

2. **Update Jellyfin and Traefik**:  
    ````bash
    docker pull jellyfin/jellyfin
    docker pull traefik
    docker stop jellyfin traefik
    docker rm jellyfin traefik
    ````

3. **Recreate the containers with updated images**.

---

## FAQs

**Q: Can I run Jellyfin without Traefik?**  
A: Yes, but Traefik provides HTTPS and easier management of reverse proxies.

**Q: How do I secure access to Jellyfin?**  
A: Use strong admin passwords, enable HTTPS, and restrict access to trusted IPs via firewall rules.

**Q: Can I add multiple users to Jellyfin?**  
A: Yes, Jellyfin supports multi-user profiles with customizable permissions.

**Q: What media formats does Jellyfin support?**  
A: Jellyfin supports a wide range of formats, including MP4, MKV, MP3, and FLAC.

**Q: How do I access Jellyfin remotely?**  
A: Ensure your domain name resolves to your server, and port forwarding is configured on your router.

**Q: Can I integrate Jellyfin with other apps?**  
A: Yes, Jellyfin supports plugins for features like Trakt integration and media scraping.

**Q: What hardware is recommended for Jellyfin?**  
A: For transcoding, use hardware with a GPU that supports hardware acceleration (e.g., NVIDIA or Intel Quick Sync).

---

Hosting Jellyfin with Traefik enables a secure, feature-rich media streaming service for your homelab. Enjoy seamless access to your media collection from anywhere!