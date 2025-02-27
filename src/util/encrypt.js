const secretKey = "dWV0De=sV-D%=C5iJF$*|Ft,|7;id/";
import CryptoJS from "crypto-js";


export const dataEncrypt = (value) => {
  return CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString();   
}

export const dataDecrypt = (value) => {
  const data = CryptoJS.AES.decrypt(value, secretKey);
  return JSON.parse(data.toString(CryptoJS.enc.Utf8));
};