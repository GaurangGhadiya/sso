import { useRouter } from "next/router";
import { useEffect } from "react";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import axios from "axios";
import expirationDate from "../../utils/cookiesExpire";

const ParichaySSO = () => {
  const router = useRouter();
  const { token } = router.query;

  const getStateLists = async (token) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/validateToken`,
        {
          service_id: "10000046",
          data: CryptoJS.AES.encrypt(JSON.stringify({
            token: token,
            secret_key: process.env.NEXT_PUBLIC_API_SECRET_KEY
              // "3c2b293d35f3332f7ac8acbc4be675101e22f8ce301557c5a894ceb632f38bff",
            // service_id: "10000046",
        }), process.env.NEXT_PUBLIC_API_SECRET_KEY).toString()
    }

      );

      if (response) {
        if (response.status === 200 || response.status === "OK") {
          let url = "";
          const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

          var decr = CryptoJS.AES.decrypt(response?.data?.data, secretKey);
          decr = decr.toString(CryptoJS.enc.Utf8);

          let data = {};

          if (decr) {
            try {
              let json_data = JSON.parse(decr);
              data = json_data;

              try {
                var currentTime = new Date();

                let expirationTime = new Date(currentTime.getTime() + 10 * 60 * 1000);

                Cookies.set("role", "user", { expires: expirationDate });
                Cookies.set("uid", data.sso_id, { expires: expirationDate });
                Cookies.set("name", data.name, { expires: expirationDate });

                Cookies.set("user_data", JSON.stringify(data), {
                  expires: expirationTime,
                  sameSite: "None",
                  secure: true,
                });

                router.push("/dashboard");
              } catch (err) {
                console.warn(err);
              }


            } catch (e) {
              console.warn(e)
            }
          }



        }

      }
    } catch (e) {}
  };

  useEffect(() => {
    const { token } = router.query;

    if (token) {
      getStateLists(token);
    }
  }, [token]);
};
export default ParichaySSO;
