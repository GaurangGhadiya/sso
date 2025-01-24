import CryptoJS from "crypto-js";

export default function encryptEmployeeCode(value) {
  if (value) {
    const secretKey = process.env.NEXT_PUBLIC_API_SARVATRA_SECRET_KEY;
    const encrypted = CryptoJS.AES.encrypt(value, secretKey).toString();

    return encrypted;
  } else {
    return "";
  }
}
export function encryptBody(value) {
  if (value) {
    const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;
    const encrypted = CryptoJS.AES.encrypt(value, secretKey).toString();

    return encrypted;
  } else {
    return "";
  }
}
