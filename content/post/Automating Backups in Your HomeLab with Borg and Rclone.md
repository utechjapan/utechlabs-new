---
title: "Automating Backups in Your HomeLab with Borg and Rclone"
date: 2024-12-04
tags: ["homelab", "backups", "Borg", "Rclone", "automation"]
categories: ["Homelab Guides"]
draft: false
showToc: true
---

## What You’ll Need

- A server or device to act as the backup source.  
- BorgBackup installed on the source.  
- Rclone for cloud storage synchronization.  
- A cloud storage account (e.g., Google Drive, AWS S3, Backblaze).  

---

## Step 1: Install BorgBackup

1. **Update and install BorgBackup**:  
    ````bash
    sudo apt update && sudo apt install -y borgbackup
    ````

2. **Verify the installation**:  
    ````bash
    borg --version
    ````

---

## Step 2: Initialize a Borg Repository

1. **Create a directory for backups**:  
    ````bash
    mkdir -p ~/backups/borg
    ````

2. **Initialize the Borg repository**:  
    ````bash
    borg init --encryption=repokey ~/backups/borg
    ````

   - Replace `~/backups/borg` with the desired repository path.  
   - Enter a secure passphrase when prompted.

---

## Step 3: Create a Backup Script

1. **Create a script for automated backups**:  
    ````bash
    nano ~/backup.sh
    ````

2. **Add the following script content**:  
    ````bash
    #!/bin/bash
    TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
    REPO=~/backups/borg
    borg create --progress --stats $REPO::$TIMESTAMP ~/important-data
    borg prune --keep-daily=7 --keep-weekly=4 --keep-monthly=6 $REPO
    ````

   - Replace `~/important-data` with the path to the data you want to back up.  
   - Adjust the `prune` options to fit your retention policy.

3. **Make the script executable**:  
    ````bash
    chmod +x ~/backup.sh
    ````

4. **Test the script**:  
    ````bash
    ~/backup.sh
    ````

---

## Step 4: Install and Configure Rclone

1. **Install Rclone**:  
    ````bash
    sudo apt install -y rclone
    ````

2. **Configure a cloud storage remote**:  
    ````bash
    rclone config
    ````

   - Follow the prompts to set up your cloud storage provider.  
   - Name the remote (e.g., `myremote`) for easy reference.

3. **Test the remote configuration**:  
    ````bash
    rclone ls myremote:
    ````

---

## Step 5: Automate Cloud Sync with Rclone

1. **Modify the backup script to include Rclone**:  
    ````bash
    nano ~/backup.sh
    ````

2. **Add the following line to sync Borg backups to the cloud**:  
    ````bash
    rclone sync ~/backups/borg myremote:backups/borg --progress
    ````

   - Replace `myremote:backups/borg` with your desired cloud storage path.

3. **Save and close the script**.

---

## Step 6: Schedule the Backup Script

1. **Open the crontab editor**:  
    ````bash
    crontab -e
    ````

2. **Add the following line to schedule the backup script**:  
    ````bash
    0 2 * * * ~/backup.sh
    ````

   - This will run the backup script daily at 2:00 AM.  
   - Adjust the schedule as needed.

---

## Step 7: Verify Backups

1. **List Borg backups**:  
    ````bash
    borg list ~/backups/borg
    ````

2. **Check cloud storage files**:  
    ````bash
    rclone ls myremote:backups/borg
    ````

---

## FAQs

**Q: Why use Borg and Rclone together?**  
A: Borg excels at local deduplication and encryption, while Rclone allows seamless synchronization to cloud storage, combining the best of both worlds.

**Q: How do I restore data with Borg?**  
A: Use the following command:  
    ````bash
    borg extract ~/backups/borg::backup_name
    ````

**Q: Can I encrypt backups in the cloud?**  
A: Yes, Borg encrypts data before storing it locally. Rclone will upload the encrypted data to the cloud.

**Q: How do I check for failed backups?**  
A: Check the output logs of your script or configure email notifications for cron jobs.

**Q: Can I use Rclone without Borg?**  
A: Yes, Rclone can independently handle backups, but it lacks Borg’s deduplication and encryption features.

**Q: How much cloud storage do I need?**  
A: This depends on the size of your Borg repository and retention policy. Monitor usage with `rclone size`.

**Q: Is it possible to run backups incrementally?**  
A: Yes, Borg automatically deduplicates and stores only changed data.

---

By combining Borg and Rclone, you can automate and secure your backups both locally and in the cloud, ensuring your homelab data is always protected. Happy backing up!
