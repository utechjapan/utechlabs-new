---
title: "How to Create a Media Server at Home with Plex and Jellyfin"
date: 2024-12-04
tags: ["homelab", "media server", "Plex", "Jellyfin"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---
Creating a home media server is one of the most rewarding homelab projects, allowing you to centralize and stream your media collection across all devices. Plex and Jellyfin are two popular tools for setting up a media server, each offering unique features. This guide walks you through installing and configuring both options so you can pick the one that works best for you.

---

## What You’ll Need

- A dedicated machine (e.g., Raspberry Pi, NAS, or a repurposed desktop/laptop).  
- A storage device for your media files (e.g., HDDs, SSDs, or a NAS).  
- A stable internet connection for remote access and metadata fetching.  
- Basic knowledge of Linux commands (optional if using GUI-based installation).

---

## Step 1: Decide Between Plex and Jellyfin

### **Plex**  
- **Pros**: Polished interface, remote streaming capabilities, wide device compatibility.  
- **Cons**: Some features require a subscription (Plex Pass).  

### **Jellyfin**  
- **Pros**: 100% free and open source, privacy-focused, and customizable.  
- **Cons**: Slightly less polished interface compared to Plex.  

Choose your preferred software based on these factors, or try both to see which suits your needs.

---

## Step 2: Install the Software

### **Option 1: Installing Plex**

1. **On a Linux Machine**:  
```
curl https://downloads.plex.tv/plex-keys/PlexSign.key | sudo apt-key add - echo "deb https://downloads.plex.tv/repo/deb public main" | sudo tee /etc/apt/sources.list.d/plexmediaserver.list sudo apt update sudo apt install plexmediaserver
```
2. **On a Raspberry Pi**:  
Plex offers an official build for Raspberry Pi. Download the appropriate `.deb` file from the [Plex downloads page](https://www.plex.tv/media-server-downloads/) and install it:  
```
sudo dpkg -i plexmediaserver_*.deb
```

3. **Access Plex Web Interface**:  
- Open your browser and go to `http://<your_server_ip>:32400/web`.  
- Sign in or create a Plex account to configure your library.

---

### **Option 2: Installing Jellyfin**

1. **On a Linux Machine**:  
```
sudo apt install apt-transport-https ca-certificates software-properties-common wget -O - https://repo.jellyfin.org/jellyfin_team.gpg.key | sudo apt-key add - echo "deb [arch=$( dpkg --print-architecture )] https://repo.jellyfin.org/debian $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/jellyfin.list sudo apt update sudo apt install jellyfin
```

2. **On a Raspberry Pi**:  
- Download the ARM version of Jellyfin from the [official website](https://jellyfin.org/downloads/) and follow the installation guide.  

3. **Access Jellyfin Web Interface**:  
- Open your browser and go to `http://<your_server_ip>:8096`.  
- Follow the setup wizard to create your admin account and configure your media library.

---

## Step 3: Add Media Libraries

1. Go to the "Libraries" section in the web interface (Plex or Jellyfin).  
2. Add a new library for each media type (e.g., Movies, TV Shows, Music).  
3. Select the folder where your media is stored.  
4. Allow Plex or Jellyfin to scan the folder and fetch metadata.

---

## Step 4: Configure Remote Access (Optional)

1. **Plex**:  
- Enable remote access in the server settings.  
- Port forward `32400` on your router to the server's IP address.

2. **Jellyfin**:  
- Set up HTTPS for secure remote access.  
- Port forward `8096` (HTTP) or `8920` (HTTPS) on your router to the server's IP address.

---

## Step 5: Stream Your Media

1. Install the Plex or Jellyfin app on your devices (e.g., phones, smart TVs, tablets).  
2. Sign in to your server and start streaming your media collection.

---

## FAQs

**Q: Which software is better for privacy?**  
A: Jellyfin is more privacy-focused since it doesn’t rely on cloud accounts or external services.

**Q: Do I need a Plex Pass to use Plex?**  
A: No, Plex is free to use for most features, but Plex Pass unlocks additional perks like hardware transcoding, offline downloads, and DVR.

**Q: Can I run Plex or Jellyfin on a Raspberry Pi?**  
A: Yes, both can run efficiently on a Raspberry Pi 4 or newer.

**Q: How do I add subtitles to my media?**  
A: Both Plex and Jellyfin support embedded subtitles and external `.srt` files. You can also fetch subtitles using integrated tools.

**Q: What happens if my media server goes offline?**  
A: You won’t be able to stream your media until the server is back online. Ensure reliable power and network connections.

**Q: Can I sync my media for offline viewing?**  
A: Plex supports offline downloads with a Plex Pass. Jellyfin offers third-party plugins for similar functionality.

**Q: Can I migrate my library from Plex to Jellyfin (or vice versa)?**  
A: Yes, tools like `jellyfin-metadata` or `Plex2Jelly` can help transfer metadata and settings between the platforms.

---

With your media server up and running, you can enjoy your favorite movies, TV shows, and music from anywhere. Happy streaming!
