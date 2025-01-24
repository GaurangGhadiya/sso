// pages/api/userInfo.js

import UAParser from 'ua-parser-js';
import requestIp from 'request-ip';
import axios from 'axios';

export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'];
  const clientIp = requestIp.getClientIp(req);

  const uaParser = new UAParser(userAgent);
  const browserName = uaParser.getBrowser().name;
  const browserVersion = uaParser.getBrowser().version;
  const osName = uaParser.getOS().name;

  // Fetch location information based on IP address using ipinfo.io
  try {


    if (clientIp === '::1') {
      var city = 'localhost';
      var lat = 0;
      var lng = 0; 

    } else {
      // var locationResponse = await axios.get(`https://ipinfo.io/${clientIp}/json`);
      // var locationData = locationResponse.data;
      // var city = locationData.city;
      // var [lat, lng] = locationData.loc.split(',');

      var city = "NA";
      var lat = 0;
      var lng = 0;
    }



    res.status(200).json({
      userAgent,
      clientIp,
      browserName,
      browserVersion,
      osName,
      location: {
        city: city,
        lat: lat,
        lng: lng,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
