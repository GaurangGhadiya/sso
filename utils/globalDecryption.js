import CryptoJS from "crypto-js";

export default function decryptEmployeeCode(urlEncodedEncrypted) {
  // URL-decode the encrypted string
  // const decodedEncrypted = decodeURIComponent(urlEncodedEncrypted);
  // Replace all '+' characters back to spaces
  // const formattedEncrypted = decodedEncrypted.replace(/\+/g, " ");
  // Trim the secret key to remove any unintended whitespace

  try {
    const secretKey = process.env.NEXT_PUBLIC_API_SARVATRA_SECRET_KEY;
    // Decrypt the employee code

    const bytes = CryptoJS.AES.decrypt(urlEncodedEncrypted, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (e) {}
}
