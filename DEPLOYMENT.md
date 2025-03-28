# Donshack Application Deployment Guide

This guide provides instructions for deploying the Donshack application on AWS using EC2 for the backend and S3 for media storage. Follow these steps carefully to set up a secure production environment.

## Architecture Overview

The deployment architecture consists of:

- **EC2 instance**: Hosts the Django backend application
- **S3 bucket**: Stores media files (photos, event covers, etc.)
- **PostgreSQL**: Database for application data
- **Nginx**: Web server/reverse proxy for the backend
- **Docker**: Containerization for the backend application
- **IAM Role**: For secure S3 access without hardcoded credentials

## Prerequisites

1. AWS account with permissions to create:
   - EC2 instances
   - S3 buckets
   - IAM roles
2. A domain name (optional but recommended)
3. SSH key pair for EC2 access

## 1. Setting Up AWS Resources

### 1.1 Create S3 Bucket

1. Sign in to the AWS Management Console
2. Navigate to S3 service
3. Create a new bucket:

   - Name: `donshack-project-media-spring-2025`
   - Region: `us-west-1`
   - Block all public access: Enabled
   - Versioning: Enabled (recommended)

4. Configure CORS for the bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
       "AllowedOrigins": ["https://your-frontend-domain.com"],
       "ExposeHeaders": ["ETag", "x-amz-meta-custom-header"]
     }
   ]
   ```

### 1.2 Create IAM Role for EC2

1. Navigate to IAM service
2. Create a new role:
   - Select EC2 as the trusted entity
   - Attach policy:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "s3:PutObject",
             "s3:GetObject",
             "s3:DeleteObject",
             "s3:ListBucket"
           ],
           "Resource": [
             "arn:aws:s3:::donshack-project-media-spring-2025",
             "arn:aws:s3:::donshack-project-media-spring-2025/*"
           ]
         }
       ]
     }
     ```
   - Name the role (e.g., `donshack-ec2-s3-role`)

### 1.3 Launch EC2 Instance

1. Navigate to EC2 service
2. Launch a new instance:

   - Choose Amazon Linux 2 or Ubuntu Server
   - Instance type: t3.small (recommended for production)
   - IAM role: Select the role created in step 1.2
   - Storage: 20GB+ (adjust based on your needs)
   - Security group:
     - SSH (port 22) from your IP
     - HTTP (port 80) from anywhere
     - HTTPS (port 443) from anywhere
   - Key pair: Create or select an existing key pair
   - Name the instance (e.g., `donshack-backend`)

3. Connect to your EC2 instance:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-instance-ip
   ```

## 2. Backend Deployment

### 2.1 Setup EC2 Instance

Upload the `ec2-setup.sh` script to your EC2 instance and run it:

```bash
# On your local machine
scp -i your-key.pem donshack-spring-2024/ec2-setup.sh ubuntu@your-ec2-instance-ip:~/

# On the EC2 instance
chmod +x ec2-setup.sh
./ec2-setup.sh
```

This script will:

- Update system packages
- Install required software (Nginx, PostgreSQL, Docker, etc.)
- Configure Nginx as a reverse proxy
- Create a PostgreSQL database
- Set up Docker Compose configuration
- Create an environment file template

### 2.2 Copy Application Code

Copy your application code to the EC2 instance:

```bash
# Create a zip of your backend code
cd donshack-spring-2024
zip -r backend.zip backend/

# Upload to EC2
scp -i your-key.pem backend.zip ubuntu@your-ec2-instance-ip:~/donshack/

# On EC2
cd ~/donshack
unzip backend.zip
```

### 2.3 Configure Environment Variables

Create and configure the `.env` file on the EC2 instance:

```bash
cd ~/donshack
cp .env.example .env
nano .env
```

Update the values with your actual settings:

- Generate a strong `SECRET_KEY`
- Set proper database credentials
- Set your frontend domain for CORS

### 2.4 Update Nginx Configuration

Edit the Nginx configuration with your actual domain:

```bash
sudo nano /etc/nginx/sites-available/donshack
```

Replace `your-ec2-instance-domain.amazonaws.com` with your actual domain or EC2 public DNS.

### 2.5 Start the Application

```bash
cd ~/donshack
docker-compose up -d
```

## 3. Frontend Deployment

### 3.1 Update Environment Variables

Create a `.env` file in your frontend project:

```
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_AUTH0_DOMAIN=donshack24.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
```

### 3.2 Build the Frontend

```bash
cd donshack-spring-2024/frontend/events_application
npm run build
```

### 3.3 Deploy to Hosting Service

You can deploy the frontend to:

- Vercel
- Netlify
- AWS Amplify
- AWS S3 + CloudFront

Follow the hosting service's specific deployment instructions.

## 4. Final Configuration

### 4.1 Set Up DNS

Configure your domain's DNS to point to your backend and frontend:

- Create an A record for your backend subdomain (e.g., `api.yourdomain.com`) pointing to your EC2 instance IP
- Configure your frontend domain according to your hosting provider

### 4.2 Set Up SSL (HTTPS)

For proper security, set up SSL certificates:

```bash
# On EC2 instance
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-backend-domain.com
```

## 5. Maintenance

### 5.1 Backup Strategy

- Database: Set up regular PostgreSQL backups
- Media files: S3 already provides durability, but consider versioning and cross-region replication

### 5.2 Monitoring

- Set up CloudWatch for EC2 monitoring
- Configure S3 metrics for storage usage
- Implement application-level logging

### 5.3 Updating the Application

To deploy updates:

```bash
# On EC2 instance
cd ~/donshack
git pull  # If using git
docker-compose down
docker-compose up -d --build
```

## Code Changes Reference

The following files were modified to support AWS deployment:

1. `settings.py`: Updated for IAM role authentication, PostgreSQL, and production settings
2. `views.py`: Added S3 client helper function for IAM role support
3. `config.js`: Created for frontend environment configuration
4. `frontend components`: Updated to use config for API endpoints
5. `requirements.txt`: Added PostgreSQL and production dependencies
6. `.env.example`: Created as a template for environment variables
7. `ec2-setup.sh`: Created for EC2 instance setup

## Troubleshooting

### S3 Access Issues

- Verify IAM role is attached to the EC2 instance
- Check S3 bucket policy
- Review application logs for specific errors

### Database Connection Issues

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure the security group allows database access

### Nginx/Web Server Issues

- Check Nginx logs: `sudo cat /var/log/nginx/error.log`
- Verify Nginx configuration: `sudo nginx -t`
- Check application logs for backend issues
