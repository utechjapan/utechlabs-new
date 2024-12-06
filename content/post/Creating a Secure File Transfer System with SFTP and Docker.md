---
title: "Creating a Secure File Transfer System with SFTP and Docker"
date: 2024-12-04
tags: ["homelab", "SFTP", "file transfer", "Docker"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---

## What You’ll Need

- A server or virtual machine with Docker installed.  
- Basic understanding of networking and file permissions.  
- An SSH client for testing SFTP connections.  

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

3. **Enable and start Docker**:  
    ````bash
    sudo systemctl enable docker && sudo systemctl start docker
    ````

---

## Step 2: Set Up the SFTP Directory

1. **Create a directory structure for SFTP users**:  
    ````bash
    mkdir -p ~/sftp/shared
    mkdir -p ~/sftp/user1
    ````

2. **Set the appropriate permissions**:  
    ````bash
    chmod 700 ~/sftp/user1
    chmod 755 ~/sftp/shared
    ````

---

## Step 3: Deploy the SFTP Server Using Docker

1. **Pull the SFTP Docker image**:  
    ````bash
    docker pull atmoz/sftp
    ````

2. **Run the SFTP container**:  
    ````bash
    docker run -d --name sftp-server \
      -p 2222:22 \
      -v ~/sftp:/home \
      atmoz/sftp \
      user1:password:1001
    ````

   - Replace `user1` and `password` with your desired username and password.  
   - `1001` represents the user’s UID.  

3. **Verify the container is running**:  
    ````bash
    docker ps
    ````

---

## Step 4: Test the SFTP Server

1. **Connect to the server using an SFTP client**:  
    ````bash
    sftp -P 2222 user1@<server_ip>
    ````

2. **Navigate to the home directory**:  
    ```
    cd /home/user1
    ```

3. **Upload and download files to test functionality**:  
    ```
    put testfile.txt
    get testfile.txt
    ```

---

## Step 5: Configure Additional Users

1. **Stop the SFTP container**:  
    ````bash
    docker stop sftp-server
    ````

2. **Edit the `docker run` command to add more users**:  
    ````bash
    docker run -d --name sftp-server \
      -p 2222:22 \
      -v ~/sftp:/home \
      atmoz/sftp \
      user1:password:1001 \
      user2:password:1002
    ````

   - Replace `user2` and `1002` with the new user’s details.  

3. **Restart the container**:  
    ````bash
    docker start sftp-server
    ````

---

## Step 6: Secure Your SFTP Server

1. **Change the default password for users regularly**:  
    - Stop the container, modify the run command, and restart.  

2. **Limit external access to SFTP**:  
    - Configure your firewall to allow only specific IPs to connect to port `2222`.

3. **Monitor container logs for suspicious activity**:  
    ````bash
    docker logs sftp-server
    ````

---

## FAQs

**Q: Can I use a different port for SFTP?**  
A: Yes, change `-p 2222:22` to another port (e.g., `-p 2223:22`).

**Q: How do I add more shared directories?**  
A: Bind additional host directories to the container:  
    ````bash
    docker run -d --name sftp-server \
      -p 2222:22 \
      -v ~/sftp:/home \
      -v ~/additional:/additional \
      atmoz/sftp
    ````

**Q: Is password-based authentication secure for SFTP?**  
A: It’s secure if you use strong passwords, but SSH key-based authentication is recommended for better security.

**Q: How do I back up user data?**  
A: Use `tar` or `rsync` to back up the `~/sftp` directory:  
    ````bash
    tar -czvf sftp-backup.tar.gz ~/sftp
    ````

**Q: Can I restrict users to their home directories?**  
A: Yes, the Docker image automatically restricts users to their specified home directories.

**Q: How do I update the SFTP server?**  
A: Pull the latest image and recreate the container:  
    ````bash
    docker pull atmoz/sftp
    docker stop sftp-server
    docker rm sftp-server
    docker run -d --name sftp-server \
      -p 2222:22 \
      -v ~/sftp:/home \
      atmoz/sftp
    ````

**Q: Can I use SFTP without Docker?**  
A: Yes, you can set up SFTP natively with OpenSSH, but Docker simplifies deployment and management.

---

By deploying an SFTP server with Docker, you can create a secure and efficient file transfer system for your homelab. Enjoy fast, private, and flexible file sharing!
