---
title: "Running a Pi-hole and Unbound Setup for Enhanced DNS Privacy"
date: 2024-12-04
tags: ["homelab", "Pi-hole", "Unbound", "DNS", "privacy"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---

## What You’ll Need

- A Raspberry Pi or server running Pi-hole.  
- Basic knowledge of Linux commands.  
- An active internet connection.  

---

## Step 1: Update Your Pi-hole Installation

1. **Log into your Pi-hole server via SSH**:  
    ````bash
    ssh pi@<pi-hole_ip_address>
    ````

2. **Update Pi-hole to the latest version**:  
    ````bash
    pihole -up
    ````

3. **Ensure the system is up to date**:  
    ````bash
    sudo apt update && sudo apt upgrade -y
    ````

---

## Step 2: Install Unbound

1. **Install Unbound on your Pi-hole server**:  
    ````bash
    sudo apt install unbound -y
    ````

2. **Verify the installation**:  
    ````bash
    unbound -h
    ````

---

## Step 3: Configure Unbound for Recursive DNS

1. **Create a configuration file for Unbound**:  
    ````bash
    sudo nano /etc/unbound/unbound.conf.d/pi-hole.conf
    ````

2. **Add the following configuration**:  
    ````yaml
    server:
      verbosity: 1
      interface: 127.0.0.1
      port: 5335
      root-hints: "/var/lib/unbound/root.hints"
      cache-min-ttl: 3600
      cache-max-ttl: 86400
      prefetch: yes
      num-threads: 2
      private-address: 192.168.0.0/16
      private-address: 172.16.0.0/12
      private-address: 10.0.0.0/8
    ````

3. **Download root hints file**:  
    ````bash
    sudo curl -o /var/lib/unbound/root.hints https://www.internic.net/domain/named.root
    ````

4. **Restart Unbound**:  
    ````bash
    sudo systemctl restart unbound
    ````

---

## Step 4: Integrate Pi-hole with Unbound

1. **Set Pi-hole to use Unbound as its upstream DNS**:  
    - Open the Pi-hole admin interface at `http://<pi-hole_ip_address>/admin`.  
    - Navigate to **Settings** > **DNS**.  
    - Add `127.0.0.1#5335` as a custom upstream DNS server.  

2. **Disable other upstream DNS servers** to ensure queries are routed through Unbound.

---

## Step 5: Test the Setup

1. **Verify that Unbound is resolving DNS queries**:  
    ````bash
    dig google.com @127.0.0.1 -p 5335
    ````

   The response should include `SERVER: 127.0.0.1#5335`.

2. **Check DNS queries in the Pi-hole dashboard**:  
   Open the Pi-hole web interface and confirm that queries are passing through Unbound.

---

## Step 6: Monitor and Maintain

1. **Monitor DNS performance in Pi-hole logs**:  
    ````bash
    pihole -t
    ````

2. **Update the root hints file periodically**:  
    ````bash
    sudo curl -o /var/lib/unbound/root.hints https://www.internic.net/domain/named.root
    ````

3. **Keep Pi-hole and Unbound updated**:  
    ````bash
    sudo apt update && sudo apt upgrade -y
    ````

---

## FAQs

**Q: Why use Unbound with Pi-hole?**  
A: Unbound acts as a recursive DNS resolver, improving privacy by bypassing third-party DNS providers and resolving queries directly from authoritative servers.

**Q: Can I use Unbound with other DNS services?**  
A: Yes, but the primary advantage is pairing it with Pi-hole for enhanced privacy and ad blocking.

**Q: How do I troubleshoot Unbound issues?**  
A: Check the Unbound logs:  
    ````bash
    sudo journalctl -u unbound
    ````

**Q: Does this setup work with IPv6?**  
A: Yes, ensure Unbound is configured to handle both IPv4 and IPv6 queries.

**Q: How can I check DNS query performance?**  
A: Use tools like `dig` or monitor the query log in the Pi-hole admin interface.

**Q: Can I run this on a Raspberry Pi Zero?**  
A: Yes, but performance may be limited for larger networks due to the Pi Zero’s hardware constraints.

**Q: What happens if Unbound fails?**  
A: DNS resolution will stop unless you configure fallback DNS servers in Pi-hole.

---

By combining Pi-hole and Unbound, you can enhance DNS privacy and improve network performance in your homelab. Enjoy a more secure and efficient browsing experience!
