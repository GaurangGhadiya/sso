// Import the necessary modules
import { parse } from 'node-html-parser'; // You may need to install this package

export default async function handler(req, res) {
  // Get the user agent from the request headers
  const userAgent = req.headers['user-agent'];

  // Check if the user agent indicates a mobile device
  const isMobile = /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // Send the response based on the device type
  if (isMobile) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json({ device: 'mobile' });
  } else {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json({ device: 'desktop' });
  }
}
