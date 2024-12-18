---
title: "Running a Home Surveillance System with ZoneMinder or Shinobi"
date: 2024-12-04
tags: ["homelab", "surveillance", "ZoneMinder", "Shinobi", "security cameras"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---

## What You’ll Need

- A server or virtual machine with sufficient resources (recommended: 8 GB RAM, 4 CPUs, and 1 TB of storage).  
- IP cameras or USB webcams.  
- A Linux distribution (e.g., Ubuntu 20.04 or newer).  
- Basic knowledge of networking and Linux commands.

---

## Step 1: Decide Between ZoneMinder and Shinobi

**ZoneMinder**  
- A mature, feature-rich open-source surveillance system.  
- Offers advanced features like PTZ (Pan-Tilt-Zoom), motion detection, and event-based recording.  
- Suitable for users comfortable with a detailed configuration process.

**Shinobi**  
- A modern, lightweight alternative with a clean, user-friendly web interface.  
- Excellent for users who prefer simplicity while still accessing robust functionality.  

For this guide, we’ll focus on Shinobi due to its ease of use and efficient resource utilization.

---

## Step 2: Prepare the Server

1. **Update the System**  
Run the following command to ensure your system has the latest updates:  
```
sudo apt update && sudo apt upgrade -y
```

2. **Install Essential Tools**  
Install required packages for setup:  
```
sudo apt install curl git unzip -y
```

3. **Check Server Resources**  
Ensure your server meets the recommended hardware specifications for smooth operation.

---

## Step 3: Install Shinobi

1. **Clone the Shinobi Repository**  
Clone Shinobi’s repository from GitHub:  
```
git clone https://gitlab.com/Shinobi-Systems/Shinobi.git ~/Shinobi
cd ~/Shinobi
```

2. **Install Dependencies**  
Install Node.js and other required dependencies:  
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
npm install
```

3. **Setup the Database**  
Install MySQL or MariaDB and create a database for Shinobi:  
```
sudo apt install mysql-server -y
sudo mysql -e "CREATE DATABASE ccio; CREATE USER 'shinobi'@'localhost' IDENTIFIED BY 'password'; GRANT ALL PRIVILEGES ON ccio.* TO 'shinobi'@'localhost'; FLUSH PRIVILEGES;"
```

4. **Configure Shinobi**  
Copy the configuration file and modify it for your environment:  
```
cp conf.sample.json conf.json
nano conf.json
```

Update the database credentials and any other necessary settings.

5. **Start Shinobi**  
Start the Shinobi service:  
```
sudo node camera.js
```

6. **Access the Web Interface**  
Open your browser and navigate to `http://<your_server_ip>:8080`. Create an admin account during the first login.

---

## Step 4: Add Cameras

1. **Connect Cameras**  
   - For IP cameras, ensure they are on the same network as the Shinobi server.  
   - For USB webcams, connect them directly to the server.

2. **Add Cameras to Shinobi**  
   - Log into the Shinobi web interface.  
   - Go to **Settings** > **Add Camera**, and configure the stream URL and recording options.  

3. **Test Streams**  
   Verify that live streams and recordings are working as expected.

---

## Step 5: Monitor and Manage

1. **Enable Motion Detection**  
   In the camera settings, enable motion detection and configure the sensitivity.  

2. **Set Storage Limits**  
   Define storage limits for recordings to avoid running out of disk space.  

3. **Backup Your Configuration**  
   Regularly back up your Shinobi configuration and database for easy recovery.

---

## FAQs

**Q: Can I use ZoneMinder instead of Shinobi?**  
A: Yes, ZoneMinder is a robust alternative, but it has a steeper learning curve and requires more resources.

**Q: What types of cameras are supported?**  
A: Both IP cameras (RTSP/ONVIF) and USB webcams are supported.

**Q: How do I access my surveillance system remotely?**  
A: Set up port forwarding or a reverse proxy like Traefik or Nginx to access Shinobi from outside your network securely.

**Q: Does Shinobi support multiple users?**  
A: Yes, you can create multiple user accounts with varying permissions.

**Q: How much disk space do I need?**  
A: Disk space depends on the resolution, frame rate, and retention period of your recordings. Start with 1 TB or more for a multi-camera setup.

---

By using Shinobi or ZoneMinder, you can build a cost-effective, feature-rich surveillance system for your home. Whether you need basic monitoring or advanced functionality, these tools have you covered!
