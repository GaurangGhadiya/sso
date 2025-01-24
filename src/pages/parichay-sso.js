import { useRouter } from "next/router";
import { useEffect } from "react";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import expirationDate from "../../utils/cookiesExpire";

const ParichaySSO = () => {
  const router = useRouter();
  const { role } = router.query;

  // function aesDecrypt(encryptedData, key) {
  //     // Decode the base64-encoded string
  //     const ciphertext = CryptoJS.enc.Base64.parse(encryptedData);

  //     // Create a WordArray from the ciphertext
  //     const encrypted = CryptoJS.lib.CipherParams.create({ ciphertext });

  //     // Create the decryption options
  //     const options = {
  //         iv: CryptoJS.enc.Hex.parse(key), // Use the key as the IV (assuming the key is 32 characters in hexadecimal)
  //         mode: CryptoJS.mode.CFB,
  //         padding: CryptoJS.pad.Pkcs7,
  //     };

  //     // Decrypt the data
  //     const decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Hex.parse(key), options);

  //     // Convert the decrypted data to a string
  //     return decrypted.toString(CryptoJS.enc.Utf8);
  // }

  useEffect(() => {
    if (role) {
      const encryptedData = role;
      Cookies.set("govEnc", encryptedData, { expires: expirationDate });

      router.push("government-employee-dashboard");

      // const route = useRouter();
      // const govLogin = Cookies.get('govEnc');
      // if (govLogin) {
      //     route.push('/government-employee-dashboard')
      // }
    }
  }, [role]);
};
export default ParichaySSO;
