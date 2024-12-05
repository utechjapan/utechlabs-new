---
title: "Self-Hosting GitLab: A Guide to Version Control in Your HomeLab"
date: 2024-12-04
tags: ["homelab", "GitLab", "version control", "self-hosting"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---
Self-hosting GitLab in your homelab allows you to manage code repositories, CI/CD pipelines, and collaborative development projects in a secure, private environment. This guide walks you through installing and configuring GitLab on your homelab server.

---

## What You’ll Need

- A server or virtual machine with at least:  
  - 4 GB RAM and 2 CPUs (recommended for smaller deployments).  
  - 20 GB of storage (more for large repositories or CI/CD).  
- A Linux-based OS (Ubuntu 20.04 or newer is recommended).  
- A static IP or domain name (for remote access).  

---

## Step 1: Update and Prepare Your Server

1. **Log into your server**:  
```
ssh user@<server_ip>
```
2. **Update the system packages**:  
```
sudo apt update && sudo apt upgrade -y
```
3. **Install dependencies**:  
```
sudo apt install -y curl openssh-server ca-certificates
```

---

## Step 2: Install GitLab

1. **Add the GitLab repository**:  
```
curl -s [https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.deb.sh](https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.deb.sh) | sudo bash
```
2. **Install GitLab**:  
Replace `<your-domain>` with your server’s domain or IP:  
```
sudo EXTERNAL_URL="http://<your-domain>" apt install -y gitlab-ee
```
3. **Run the GitLab reconfiguration script**:  
```
sudo gitlab-ctl reconfigure
```

---

## Step 3: Access the GitLab Web Interface

1. Open your web browser and go to `http://<your-domain>`.  
2. Set a password for the default `root` user on the first login.  
3. Log in using the `root` username and your new password.  

---

## Step 4: Configure GitLab

1. **Set up email notifications**:  
- Edit the `/etc/gitlab/gitlab.rb` file and configure SMTP settings.  
- Reconfigure GitLab:  
  ```
  sudo gitlab-ctl reconfigure
  ```

2. **Create a new project**:  
- Navigate to the **Projects** tab in the web interface.  
- Click **New Project** and follow the wizard to create your repository.

---

## Step 5: Connect to Your Repository

1. **Clone the repository to your local machine**:  
```
git clone http://<your-domain>/<namespace>/<repository>.git
```
2. **Push your code to the repository**:  
```
cd <repository> git add . git commit -m "Initial commit" git push origin main
```

---

## Step 6: Enable SSL (Optional)

1. **Install Certbot for Let's Encrypt**:  
```
sudo apt install -y certbot
```
2. **Generate an SSL certificate**:  
```
sudo certbot certonly --standalone -d <your-domain>
```
3. **Update GitLab configuration**:  
Edit `/etc/gitlab/gitlab.rb`:  
```
external_url "https://<your-domain>" nginx['ssl_certificate'] = "/etc/letsencrypt/live/<your-domain>/fullchain.pem" nginx['ssl_certificate_key'] = "/etc/letsencrypt/live/<your-domain>/privkey.pem"
```
4. **Reconfigure GitLab**:  
```
sudo gitlab-ctl reconfigure
```

---

## Step 7: Configure CI/CD Pipelines (Optional)

1. Add a `.gitlab-ci.yml` file to your repository root:  
```
yaml
stages:
  - build

build-job:
  stage: build
  script:
    - echo "Hello, World!"
```
4. **Commit and push the file**:  
```
git add .gitlab-ci.yml
git commit -m "Add CI/CD pipeline"
git push origin main
```
5. **2. Check the **CI/CD > Pipelines** section in the GitLab web interface to monitor the job.**:  

## FAQs

**Q: Is GitLab free to use?**  
A: Yes, GitLab offers a free tier with all essential features for self-hosting. Paid tiers include advanced features like enhanced security and analytics.

**Q: Can I run GitLab on a Raspberry Pi?**  
A: Yes, but it’s resource-intensive. Consider using lightweight alternatives like Gitea or GitBucket for low-powered devices.

**Q: How do I update GitLab?**  
A: Run the following commands to update GitLab:
```
sudo apt update
sudo apt upgrade -y
sudo gitlab-ctl reconfigure
```

**Q: How do I back up GitLab?**  
A: Use the built-in backup tool:
```
sudo gitlab-backup create
```
Backups are stored in `/var/opt/gitlab/backups` by default.

**Q: How do I secure my GitLab server?**  
A: Enable SSL, configure a firewall to block unused ports, and ensure regular updates.

**Q: Can I access GitLab remotely?**  
A: Yes, configure a static IP or domain, and open the necessary ports on your firewall/router.

**Q: What are some GitLab alternatives?**  
A: Alternatives include Gitea, GitHub Enterprise Server, and Bitbucket Server.

---

Self-hosting GitLab in your homelab provides full control over your version control system and development workflows. Enjoy exploring its powerful features!