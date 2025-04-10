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
     ? 'https://api.clixz.org' 
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
  },

  cors: {
    allowedOrigins: process.env.NODE_ENV === 'production'
      ? ['https://clixz.org', 'https://www.clixz.org']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

};

export default config;
