// my-project/library-frontend/pages/api/config.js

export default function handler(req, res) {
    // Read the environment variable here, where it IS available on the server
    const nodeApiUrl = process.env.NEXT_PUBLIC_NODE_API_URL;
  
    if (!nodeApiUrl) {
      // This case indicates a configuration error in app.yaml
      console.error('NEXT_PUBLIC_NODE_API_URL is NOT set on the frontend server.');
      return res.status(500).json({ error: 'API URL not configured on server' });
    }
  
    // Return the variable as JSON
    res.status(200).json({ nodeApiUrl });
  }