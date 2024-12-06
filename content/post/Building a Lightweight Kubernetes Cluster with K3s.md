---
title: "Building a Lightweight Kubernetes Cluster with K3s"
date: 2024-12-04
tags: ["homelab", "Kubernetes", "K3s", "lightweight cluster"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---

## What You’ll Need

- At least two nodes (one master, one worker) with Linux installed (e.g., Ubuntu 20.04 or newer).  
- 2 GB RAM and 2 CPUs per node (minimum recommended).  
- Basic networking knowledge.  

---

## Step 1: Prepare the Nodes

1. **Update each node**:  
    ````bash
    sudo apt update && sudo apt upgrade -y
    ````

2. **Install required dependencies**:  
    ````bash
    sudo apt install -y curl apt-transport-https
    ````

3. **Set unique hostnames for each node**:  
    - On the master node:  
      ````bash
      sudo hostnamectl set-hostname master-node
      ````

    - On the worker node(s):  
      ````bash
      sudo hostnamectl set-hostname worker-node-1
      ````

4. **Disable swap on all nodes**:  
    ````bash
    sudo swapoff -a
    ````

    To make it permanent, comment out the swap line in `/etc/fstab`.  

---

## Step 2: Install K3s on the Master Node

1. **Download and install K3s**:  
    ````bash
    curl -sfL https://get.k3s.io | sh -
    ````

2. **Verify the installation**:  
    ````bash
    kubectl get nodes
    ````

   You should see the master node listed as `Ready`.

3. **Retrieve the K3s join token**:  
    ````bash
    sudo cat /var/lib/rancher/k3s/server/node-token
    ````

   Save the token, as you’ll need it to connect the worker nodes.

---

## Step 3: Install K3s on Worker Nodes

1. **Download and install K3s**:  
    Replace `<master_ip>` with the IP address of the master node.  
    ````bash
    curl -sfL https://get.k3s.io | K3S_URL=https://<master_ip>:6443 K3S_TOKEN=<node-token> sh -
    ````

2. **Verify the worker node is connected**:  
    - On the master node:  
      ````bash
      kubectl get nodes
      ````

      The worker node(s) should now appear in the list.

---

## Step 4: Deploy a Test Application

1. **Create a deployment YAML file**:  
    ````bash
    nano nginx-deployment.yaml
    ````

2. **Add the following configuration**:  
    ````yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nginx-deployment
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: nginx
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
          - name: nginx
            image: nginx:latest
            ports:
            - containerPort: 80
    ````

3. **Apply the deployment**:  
    ````bash
    kubectl apply -f nginx-deployment.yaml
    ````

4. **Verify the deployment**:  
    ````bash
    kubectl get pods
    ````

   You should see two running pods for the Nginx application.

---

## Step 5: Expose the Application

1. **Create a service to expose Nginx**:  
    ````bash
    kubectl expose deployment nginx-deployment --type=NodePort --port=80
    ````

2. **Get the service details**:  
    ````bash
    kubectl get service nginx-deployment
    ````

3. **Access the application**:  
   - Note the `NodePort` value (e.g., `30008`).  
   - Open a browser and navigate to `http://<node_ip>:<NodePort>` to see the Nginx welcome page.

---

## Step 6: Manage and Scale Your Cluster

1. **Scale the deployment**:  
    ````bash
    kubectl scale deployment nginx-deployment --replicas=4
    ````

2. **Monitor cluster resources**:  
    ````bash
    kubectl top nodes
    kubectl top pods
    ````

3. **Delete the deployment and service** (optional):  
    ````bash
    kubectl delete deployment nginx-deployment
    kubectl delete service nginx-deployment
    ````

---

## FAQs

**Q: Why use K3s instead of full Kubernetes?**  
A: K3s is lightweight and optimized for resource-constrained environments, making it ideal for homelabs.

**Q: Can I run K3s on a Raspberry Pi?**  
A: Yes, K3s works well on Raspberry Pi (preferably Pi 4) for building ARM-based clusters.

**Q: How do I back up my K3s cluster?**  
A: Back up the `/etc/rancher/k3s` directory and etcd snapshots.

**Q: Can I add more worker nodes later?**  
A: Yes, use the same installation process with the master node’s token.

**Q: How do I secure my cluster?**  
A: Configure Role-Based Access Control (RBAC), use HTTPS for the API server, and regularly update K3s.

**Q: What happens if the master node fails?**  
A: Without HA (High Availability), the cluster’s control plane will be unavailable. For HA, deploy multiple master nodes.

**Q: How do I monitor my K3s cluster?**  
A: Use tools like Prometheus, Grafana, or Kubernetes Dashboard for cluster monitoring.

---

By setting up a lightweight K3s cluster, you can explore the world of container orchestration and learn Kubernetes basics in a resource-efficient way. Happy experimenting!
