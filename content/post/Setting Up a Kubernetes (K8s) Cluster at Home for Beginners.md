---
title: "Setting Up a Kubernetes (K8s) Cluster at Home for Beginners"
date: 2024-12-04
tags: ["homelab", "Kubernetes", "K8s", "containers"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---
Kubernetes (K8s) is a powerful container orchestration platform used to manage applications at scale. Building a Kubernetes cluster in your homelab allows you to experiment with cloud-native concepts, deploy containerized applications, and learn skills for production-grade environments. In this guide, we’ll walk through setting up a basic Kubernetes cluster at home.

---

## What You’ll Need

- At least two devices (can be physical machines, VMs, or Raspberry Pis):  
  - One as a control plane (master node).  
  - One or more as worker nodes.  
- Linux installed on each device (Ubuntu 20.04 or newer is recommended).  
- A reliable network connection.  
- Basic understanding of Linux commands.

---

## Step 1: Prepare the Nodes

1. **Install Ubuntu** on all devices (or use your preferred Linux distro).  
2. Update and upgrade the system on each node:  
```
sudo apt update && sudo apt upgrade -y
```
3. Set static IP addresses for all nodes to ensure stability in the cluster. Configure this via `/etc/netplan` or your router's DHCP settings.  
4. Disable swap on all nodes to meet Kubernetes requirements:  
```
sudo swapoff -a
```
To make it permanent, edit `/etc/fstab` and comment out the swap entry.  
5. Install `containerd` as the container runtime:  
```
sudo apt install -y containerd sudo systemctl enable containerd --now
```

---

## Step 2: Install kubeadm, kubectl, and kubelet

1. Add the Kubernetes repository to each node:  
```
sudo apt update && sudo apt install -y apt-transport-https curl curl -s

https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

---

## Step 3: Initialize the Control Plane

1. On the control plane node, initialize the cluster:  
```
sudo kubeadm init --pod-network-cidr=192.168.0.0/16
```

Replace `--pod-network-cidr` if you are using a different network plugin.  
2. Configure `kubectl` for the current user:  
```
mkdir -p $HOME/.kube sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
3. Note the join command provided at the end of the initialization process. You’ll use this to add worker nodes.

---

## Step 4: Install a Network Plugin

1. Install a network plugin to enable communication between pods. For example, install Calico:  
```
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

---

## Step 5: Join Worker Nodes to the Cluster

1. On each worker node, use the join command from Step 3 to add them to the cluster:  
```
sudo kubeadm join <control_plane_ip>:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```
2. Verify the nodes are connected by running the following on the control plane:  
```
kubectl get nodes
```

---

## Step 6: Deploy Your First Application (Optional)

1. Create a deployment:  
```
kubectl create deployment nginx --image=nginx
```
2. Expose the deployment as a service:  
```
kubectl expose deployment nginx --type=NodePort --port=80
```
3. Access the application by finding the NodePort:  
```
kubectl get services
```

---

## Step 7: Monitor and Maintain the Cluster

1. Use `kubectl` commands to monitor pods and nodes:  
```
kubectl get pods -A kubectl get nodes
```
2. Regularly update Kubernetes tools and node packages.  
3. Backup the cluster configuration and workloads using tools like `Velero`.

---

## FAQs

**Q: Can I run Kubernetes on a single node?**  
A: Yes, you can use Minikube or set up a single-node cluster for testing, but it won't replicate a multi-node production environment.

**Q: Which container runtime works best for Kubernetes?**  
A: Kubernetes supports several container runtimes like `containerd` (recommended), `CRI-O`, and `Docker` (deprecated since Kubernetes 1.20).

**Q: How do I upgrade Kubernetes versions?**  
A: Follow the Kubernetes upgrade guide to update `kubeadm`, `kubelet`, and the cluster:  
```
sudo kubeadm upgrade plan
```

**Q: Can I access my Kubernetes dashboard?**  
A: Yes, install the Kubernetes dashboard and create an admin token for secure access.

**Q: What happens if a node goes offline?**  
A: Pods running on that node will be unavailable unless you configure high availability with multiple replicas.

**Q: How do I reset the cluster if something breaks?**  
A: Use the following commands to reset nodes:  
```
sudo kubeadm reset && sudo rm -rf $HOME/.kube
```

**Q: Is Kubernetes overkill for a homelab?**  
A: It depends on your goals. Kubernetes is ideal for learning cloud-native applications and managing complex deployments.

---

By setting up Kubernetes in your homelab, you’ll gain hands-on experience with container orchestration and cloud-native technologies. Enjoy your journey into K8s!
