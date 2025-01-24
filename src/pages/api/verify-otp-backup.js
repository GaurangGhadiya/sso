import CryptoJS from "crypto-js";

const xml2js = require("xml2js");

export default async function handler(req, res) {
  try {
    const postData = {
      aadhaarNumber: req.body.aadhaarNumber.replace(/-/g, ""),
      appId: 'HP_SDPRH_PROD',
      name: "Test",
      otp: req.body.otp,
      transactionId: req.body.tnxID,
    };

    const response = await fetch(
      "https://himparivarservices.hp.gov.in/ekyc_cdac/authenticate/authenticationKyc",
      {
        method: "POST",
        body: JSON.stringify(postData),
      }
    );

    const jsonData = await response.json();

    if (jsonData.STATUS === "OK") {
      const xmlData = jsonData.RESPONSE;

      const parser = new xml2js.Parser({ explicitArray: false });

      parser.parseString(xmlData, (err, result) => {
        if (err) {
          res.status(500).json({ error: "Error parsing XML data" });
        } else {
          if (result.KycRes.$.err) {
            res.status(500).json({ error: "An error occurred" });
          } else {
            try {
              // Convert the object to a string using JSON.stringify
              const objToEncrypt = {
                uidData: result.KycRes.UidData,
                vault: result.KycRes
              };

              // Encrypt the stringified object
              const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(objToEncrypt), // Convert object to string
                process.env.NEXT_PUBLIC_API_SECRET_KEY
              ).toString(); // Call `.toString()` to ensure the result is a string

              // Prepare the response object
              const obj = { data: encryptedData };

              // Send the encrypted data in the response
              res.status(200).json(obj);
            } catch (e) {
              console.error(e);
              res.status(500).json({ error: "Error during encryption" });
            }
          }
        }
      });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
