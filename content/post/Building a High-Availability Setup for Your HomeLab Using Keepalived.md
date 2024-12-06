---
title: "Building a High-Availability Setup for Your HomeLab Using Keepalived"
date: 2024-12-04
tags: ["homelab", "high-availability", "Keepalived", "failover"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---

## What You’ll Need

- At least two servers or virtual machines (referred to as primary and backup nodes).  
- A Linux-based OS installed on both (Ubuntu 20.04 or newer is recommended).  
- A shared virtual IP address (VIP) for failover.  

---

## Step 1: Install Keepalived

1. **Log into both nodes and update the system**:  
    ````bash
    sudo apt update && sudo apt upgrade -y
    ````

2. **Install Keepalived on both nodes**:  
    ````bash
    sudo apt install -y keepalived
    ````

3. **Verify the installation**:  
    ````bash
    keepalived --version
    ````

---

## Step 2: Configure Keepalived on the Primary Node

1. **Edit the Keepalived configuration file**:  
    ````bash
    sudo nano /etc/keepalived/keepalived.conf
    ````

2. **Add the following configuration**:  
    ```ini
    vrrp_instance VI_1 {
        state MASTER
        interface eth0
        virtual_router_id 51
        priority 100
        advert_int 1
        authentication {
            auth_type PASS
            auth_pass securepassword
        }
        virtual_ipaddress {
            192.168.1.100
        }
    }
    ````

    - Replace `eth0` with your network interface name (use `ip a` to find it).  
    - Replace `192.168.1.100` with your desired virtual IP (VIP).  
    - Use a secure password for `auth_pass`.

3. **Restart Keepalived**:  
    ````bash
    sudo systemctl restart keepalived
    ````

4. **Enable Keepalived to start on boot**:  
    ````bash
    sudo systemctl enable keepalived
    ````

---

## Step 3: Configure Keepalived on the Backup Node

1. **Edit the Keepalived configuration file**:  
    ````bash
    sudo nano /etc/keepalived/keepalived.conf
    ````

2. **Add the following configuration**:  
    ```ini
    vrrp_instance VI_1 {
        state BACKUP
        interface eth0
        virtual_router_id 51
        priority 90
        advert_int 1
        authentication {
            auth_type PASS
            auth_pass securepassword
        }
        virtual_ipaddress {
            192.168.1.100
        }
    }
    ````

    Ensure the `state` is set to `BACKUP` and `priority` is lower than the primary node.

3. **Restart Keepalived**:  
    ````bash
    sudo systemctl restart keepalived
    ````

4. **Enable Keepalived to start on boot**:  
    ````bash
    sudo systemctl enable keepalived
    ````

---

## Step 4: Test the High-Availability Setup

1. **Check the VIP on the primary node**:  
    ````bash
    ip a | grep 192.168.1.100
    ````

   The VIP should be bound to the primary node’s interface.

2. **Simulate a failover**:  
    - Stop Keepalived on the primary node:  
        ````bash
        sudo systemctl stop keepalived
        ````
    - Check the VIP on the backup node:  
        ````bash
        ip a | grep 192.168.1.100
        ````

   The VIP should now be assigned to the backup node.

3. **Restart Keepalived on the primary node**:  
    ````bash
    sudo systemctl start keepalived
    ````

---

## Step 5: Monitor and Maintain

1. **Check Keepalived logs for troubleshooting**:  
    ````bash
    sudo journalctl -u keepalived
    ````

2. **Verify that Keepalived is running**:  
    ````bash
    sudo systemctl status keepalived
    ````

3. **Update Keepalived and system packages regularly**:  
    ````bash
    sudo apt update && sudo apt upgrade -y
    ````

---

## FAQs

**Q: Can I use Keepalived with multiple backup nodes?**  
A: Yes, Keepalived supports multiple backup nodes by assigning unique priorities to each one.

**Q: Does Keepalived work with IPv6?**  
A: Yes, Keepalived supports both IPv4 and IPv6 addresses.

**Q: How do I troubleshoot failover issues?**  
A: Check the following:  
   - Logs in `/var/log/syslog` or `journalctl`.  
   - Network configuration (correct interfaces and VIP settings).  
   - Ensure the authentication `auth_pass` is identical on all nodes.

**Q: Can I use Keepalived for load balancing?**  
A: Yes, Keepalived supports Layer 4 load balancing through the LVS (Linux Virtual Server) feature.

**Q: How do I ensure the VIP is reachable across subnets?**  
A: Enable proxy ARP or configure static routes for the VIP.

**Q: Can Keepalived monitor service health?**  
A: Yes, Keepalived can monitor services with health-check scripts and perform failover based on service availability.

---

By setting up Keepalived, you can create a highly available environment for critical services in your homelab. This ensures minimal downtime and a reliable infrastructure. Happy experimenting!
