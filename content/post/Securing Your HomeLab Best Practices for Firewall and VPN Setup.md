---
title: "Securing Your HomeLab: Best Practices for Firewall and VPN Setup"
date: 2024-12-04
tags: ["homelab", "security", "firewall", "VPN"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---
Running a homelab introduces exciting possibilities, but it also opens potential security vulnerabilities. Securing your homelab with a firewall and VPN ensures safe access to your systems and protects your network from unauthorized intrusions. In this guide, we’ll explore best practices for setting up a secure firewall and VPN for your homelab.

---

## What You’ll Need

- A dedicated router or a device to run firewall software (e.g., pfSense, OPNSense).  
- VPN software or hardware (e.g., WireGuard, OpenVPN).  
- Basic networking knowledge for configuring IPs and port forwarding.  

---

## Step 1: Set Up a Dedicated Firewall

### **Option 1: Install pfSense**

1. **Download pfSense**:  
   - Get the latest ISO from the [pfSense download page](https://www.pfsense.org/download/).  
2. **Create a Bootable USB Drive**:  
   - Use [Rufus](https://rufus.ie/) or similar tools to flash the ISO onto a USB drive.  
3. **Install pfSense on Your Firewall Device**:  
   - Boot from the USB drive and follow the installation wizard.  
4. **Initial Configuration**:  
   - Access the pfSense web interface at `http://192.168.1.1`.  
   - Configure the WAN (internet) and LAN (internal network) interfaces.  

### **Option 2: Install OPNSense**  
OPNSense is a robust alternative to pfSense. The installation steps are nearly identical.

---

### **Firewall Rules**

1. Block all inbound traffic by default and allow only necessary ports.  
2. Enable logging for critical rules to monitor suspicious activity.  
3. Segment your homelab network using VLANs:  
   - Assign separate VLANs for different purposes (e.g., IoT, media server, Kubernetes).  
   - Use managed switches to configure VLANs effectively.  

---

## Step 2: Configure VPN for Secure Remote Access

### **Option 1: Install WireGuard**

1. **Install WireGuard on Your Firewall**:  
```
sudo apt install wireguard
```
2. **Generate Keys**:  
```
wg genkey | tee privatekey | wg pubkey > publickey
```
3. **Configure the WireGuard Interface**:  
Add the following configuration to `/etc/wireguard/wg0.conf`:  
```
[Interface] Address = 10.0.0.1/24 PrivateKey = <your_private_key> ListenPort = 51820
```
4. **Start WireGuard**:  
```
sudo wg-quick up wg0
```

### **Option 2: Install OpenVPN**

1. Use a script to simplify OpenVPN setup:  
```
curl -O https://raw.githubusercontent.com/angristan/openvpn-install/master/openvpn-install.sh chmod +x openvpn-install.sh sudo ./openvpn-install.sh
```
2. Follow the prompts to configure the VPN.  

---

## Step 3: Harden Your Network

1. **Use Strong Passwords and Keys**:  
- Avoid default credentials.  
- Use SSH keys instead of passwords for remote access.  

2. **Enable Intrusion Detection Systems (IDS/IPS)**:  
- In pfSense or OPNSense, enable tools like Snort or Suricata.  

3. **Implement Two-Factor Authentication (2FA)**:  
- Use 2FA for VPNs and administrative portals wherever possible.  

4. **Keep Firmware and Software Updated**:  
- Regularly check for updates to your firewall and VPN software.  

---

## Step 4: Monitor Network Traffic

1. Use network monitoring tools like:  
- **ntopng**: Visualize network usage.  
- **NetFlow**: Analyze data flows for anomalies.  

2. Set up alerts for suspicious activity:  
- Configure pfSense to email logs or integrate with SIEM tools.

---

## FAQs

**Q: Why should I segment my network with VLANs?**  
A: VLANs isolate traffic, preventing devices on one VLAN from accessing others. This is especially useful for securing IoT devices or sensitive systems.

**Q: Which is better: WireGuard or OpenVPN?**  
A: WireGuard is faster and simpler, but OpenVPN is more mature and widely supported. Choose based on your needs.

**Q: How do I test my VPN setup?**  
A: Connect to the VPN from a remote device and verify access to internal resources. Use tools like `ping` to test connectivity.

**Q: Can I use my existing router as a firewall?**  
A: Many consumer routers include basic firewall functionality, but dedicated devices like pfSense offer far more control and features.

**Q: What port should I use for WireGuard?**  
A: The default is `51820`, but you can change it to avoid common scans.

**Q: What happens if my VPN server goes offline?**  
A: You won’t be able to access your homelab remotely. Ensure high uptime with a stable internet connection and a UPS for power backup.

**Q: How can I protect against brute-force attacks?**  
A: Use strong passwords, enable 2FA, and monitor login attempts using your firewall’s logs.

---

With a robust firewall and VPN setup, you can ensure your homelab remains secure while enjoying remote access to your systems. Happy homelabbing!
