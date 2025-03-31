/**
 * Application configuration
 * 
 * This file centralizes environment-specific configuration settings.
 * In production, use the EC2 instance URL or custom domain.
 * In development, use localhost.
 */

const config = {
  // List of email addresses allowed to create events
  allowedEventCreators: [
    'frankieg1610@gmail.com',
  ],
  
  // API base URL
  apiUrl: process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
     ? 'http://ec2-54-176-215-71.us-west-1.compute.amazonaws.com' 
     : 'http://localhost:8000'),
  
  // S3 bucket configuration
  s3: {
    bucketName: 'donshack-project-media-spring-2025',
    region: 'us-west-1',
    baseUrl: 'https://donshack-project-media-spring-2025.s3.us-west-1.amazonaws.com'
  },
  
  // Auth0 configuration
  auth0: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN || 'donshack24.us.auth0.com',
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'liC47L5l4ADMUs78jb7pqfZJ4R3KYOJe',
    redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI || window.location.origin + '/#/profile'
  }
};

export default config;
