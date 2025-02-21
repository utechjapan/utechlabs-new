---
title: "HomeLab Networking: Configuring pfSense for Advanced Firewall Rules"
date: 2024-12-04
tags: ["homelab", "networking", "pfSense", "firewall"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---

## What You’ll Need

- A dedicated device or virtual machine to install pfSense.  
- A basic understanding of networking concepts.  
- Access to your home network’s router for setup.  

---

## Step 1: Install pfSense

1. **Download pfSense ISO**:  
    - Visit the [official pfSense website](https://www.pfsense.org/download/) and download the ISO.  
    - Choose the correct architecture for your hardware (e.g., AMD64).  

2. **Create a Bootable USB Drive**:  
    ````bash
    sudo dd if=/path/to/pfsense.iso of=/dev/sdX bs=1M
    ````

    - Replace `/path/to/pfsense.iso` with the path to the ISO file.  
    - Replace `/dev/sdX` with the correct USB drive identifier.  

3. **Install pfSense on Your Device**:  
    - Boot the target device from the USB drive.  
    - Follow the installation prompts to install pfSense.  

---

## Step 2: Basic Configuration

1. **Log into the pfSense Web Interface**:  
   - Open a browser and navigate to `http://192.168.1.1`.  
   - Default credentials:  
     - **Username**: `admin`  
     - **Password**: `pfsense`  

2. **Run the Setup Wizard**:  
   - Configure your LAN and WAN interfaces.  
   - Set a secure admin password.  

---

## Step 3: Create Firewall Rules

1. **Navigate to the Firewall Rules Page**:  
   - Go to **Firewall** > **Rules** in the pfSense web interface.  

2. **Add a Rule to Block Specific Traffic**:  
   - Click **Add** to create a new rule.  
   - Set the **Action** to `Block`.  
   - Specify the source and destination IP ranges.  
   - Save and apply the rule.  

3. **Add a Rule to Allow LAN to WAN Traffic**:  
    ````yaml
    Action: Pass
    Interface: LAN
    Protocol: Any
    Source: LAN net
    Destination: Any
    ````

   - Save and apply changes.

---

## Step 4: Enable VLANs for Network Segmentation

1. **Create VLANs**:  
   - Go to **Interfaces** > **Assignments** > **VLANs**.  
   - Add VLAN IDs (e.g., `10` for IoT, `20` for trusted devices).  

2. **Assign VLAN Interfaces**:  
   - Navigate to **Interfaces** > **Assignments**.  
   - Assign each VLAN to a new interface.  

3. **Configure Firewall Rules for VLANs**:  
   - Set up rules to isolate VLAN traffic or allow specific inter-VLAN communication.  

---

## Step 5: Configure DNS and DHCP

1. **Set Up DNS Resolver**:  
   - Go to **Services** > **DNS Resolver**.  
   - Enable the resolver and configure overrides if needed.  

2. **Configure DHCP for Each VLAN**:  
   - Navigate to **Services** > **DHCP Server**.  
   - Assign IP ranges for each VLAN.  

---

## Step 6: Monitor and Maintain pfSense

1. **Enable Logging**:  
   - Go to **Status** > **System Logs**.  
   - Monitor logs for firewall events and network activity.  

2. **Regularly Update pfSense**:  
    ````bash
    pkg update && pkg upgrade
    ````

3. **Backup pfSense Configuration**:  
   - Navigate to **Diagnostics** > **Backup & Restore**.  
   - Save a copy of your configuration file.  

---

## FAQs

**Q: Why should I use pfSense in my homelab?**  
A: pfSense offers enterprise-grade features like firewall rules, VLANs, and VPNs for enhanced network control.

**Q: Can pfSense run on a Raspberry Pi?**  
A: No, pfSense requires x86_64 architecture. Consider alternatives like OPNsense for ARM devices.

**Q: How do I restore pfSense after a failure?**  
A: Use the configuration backup file to quickly restore settings from the web interface.

**Q: Can I use pfSense for VPNs?**  
A: Yes, pfSense supports VPN setups like OpenVPN and IPsec for secure remote access.

**Q: How do I block specific websites with pfSense?**  
A: Use pfSense’s DNS resolver with overrides or install the Squid proxy package for advanced filtering.

**Q: What’s the difference between pfSense and OPNsense?**  
A: Both are open-source firewall solutions; pfSense is more mature, while OPNsense focuses on frequent updates and user-friendly features.

**Q: How do I test firewall rules?**  
A: Use tools like `ping` and `traceroute` to verify connectivity and logs to analyze blocked traffic.

---

By configuring pfSense, you can achieve a secure, segmented, and well-managed network for your homelab. Enjoy enhanced control and peace of mind!
