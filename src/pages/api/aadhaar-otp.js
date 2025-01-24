const xml2js = require("xml2js");

export default async function handler(req, res) {
	try {
		const postData = {
			aadhaarNumber: req.body.aadhaarNumber.replace(/-/g, ""),
			appId: "HP_SDPRH_PROD",
			name: "",
			otp: "",
			transactionId: "",
		};

		const response = await fetch(
			"https://himparivarservices.hp.gov.in/ekyc_cdac/authenticate/authenticationOtp",
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
					if (result.OtpRes.$.err) {
						res
							.status(500)
							.json({
								error:
									"Something went wrong, please  try again later " +
									result.OtpRes.$.err,
							});
					} else {
						res.status(200).json(result.OtpRes.$.txn);
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
