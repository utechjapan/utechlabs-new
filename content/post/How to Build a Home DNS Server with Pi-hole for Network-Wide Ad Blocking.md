---
title: "How to Build a Home DNS Server with Pi-hole for Network-Wide Ad Blocking"
date: 2024-12-04
tags: ["homelab", "Pi-hole", "DNS", "ad-blocking"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---
Are you tired of intrusive ads, tracking scripts, and sluggish internet performance caused by unnecessary network traffic? A Pi-hole DNS server can solve these problems by acting as a network-wide ad blocker and improving overall browsing speed. This blog post will walk you through the process of setting up Pi-hole at home, step by step.

---

## What You’ll Need

- A Raspberry Pi (recommended: Raspberry Pi 3 or newer) or any machine that can run Docker.  
- MicroSD card (if using a Raspberry Pi).  
- Home router with access to DNS settings.  
- Basic understanding of Linux commands.

---

## Step 1: Install the Operating System

If using a Raspberry Pi:  
1. Download the latest version of **Raspberry Pi OS Lite** from the official Raspberry Pi website.  
2. Flash the image to a MicroSD card using tools like [Rufus](https://rufus.ie/) or [balenaEtcher](https://www.balena.io/etcher/).  
3. Insert the SD card into your Raspberry Pi and power it up.

---

## Step 2: Update and Prepare Your System

1. Log into the Raspberry Pi or the server via SSH (default user for Raspberry Pi OS is `pi`, and the password is `raspberry`).  

```
ssh pi@<raspberry_pi_ip_address>`
```

2. Update the system packages:  
```
`sudo apt update && sudo apt upgrade -y`
```

3. Install dependencies:  
```
`sudo apt install curl -y`
```

---

## Step 3: Install Pi-hole

1. Use the one-line installation command from the Pi-hole official website:  
```
`curl -sSL https://install.pi-hole.net | bash`
```

2. Follow the interactive setup prompts:  
   - Choose your upstream DNS provider (e.g., Google, OpenDNS, Cloudflare).  
   - Set the static IP address for your Pi-hole server.  
   - Confirm installation of the admin interface.

---

## Step 4: Configure Your Router

1. Access your router's admin dashboard (usually accessible at `192.168.1.1` or `192.168.0.1`).  
2. Go to the **DNS settings** and update the primary DNS server to point to your Pi-hole’s IP address.  
3. Save the changes and restart the router.

---

## Step 5: Access the Pi-hole Admin Panel

1. Open a web browser and navigate to `http://<your_pihole_ip>/admin`.  
2. Log in using the password provided at the end of the installation (or set a new one using the command below):  
```
`pihole -a -p`
```

3. From here, you can view blocked domains, customize blocklists, and tweak settings.

---

## Step 6: Advanced Configuration (Optional)

1. **Add More Blocklists**:  
   - Go to `Settings` > `Blocklists`.  
   - Add URLs of additional blocklists, such as [StevenBlack’s list](https://github.com/StevenBlack/hosts).  

2. **Integrate with Unbound for Local DNS Resolution**:  
```
`sudo apt install unbound -y`  
```

   Configure `/etc/unbound/unbound.conf.d/pi-hole.conf` for enhanced DNS privacy.

---

## Step 7: Monitor and Maintain

- Use the Pi-hole web interface to monitor blocked queries.  
- Regularly update Pi-hole:  
```
`pihole -up`
```

---

## FAQs

**Q: Can I run Pi-hole on a different device instead of a Raspberry Pi?**  
A: Yes, Pi-hole can run on any Linux-based device, including a virtual machine, Docker container, or bare-metal server.

**Q: Will Pi-hole block ads on YouTube and other apps?**  
A: Pi-hole primarily blocks ads at the DNS level, so while it can block many ads, platform-specific ads like YouTube pre-rolls might still appear.

**Q: What happens if Pi-hole goes offline?**  
A: If Pi-hole is unavailable, DNS queries won’t resolve unless you configure a fallback DNS server in your router or devices.

**Q: Can I use Pi-hole with IPv6?**  
A: Absolutely! During installation, Pi-hole can be configured to handle both IPv4 and IPv6 traffic.

**Q: How do I reset the admin password?**  
A: Use the following command:  
 ```
 `pihole -a -p`
```

**Q: Does Pi-hole log my DNS queries?**  
A: Yes, but you can configure it to anonymize or disable logging entirely through the web interface.

**Q: How do I uninstall Pi-hole if needed?**  
A: Run the following command:  
```
`pihole uninstall`
```

---

By following these steps, you can enjoy an ad-free and faster internet experience. Happy homelabbing!
