"use client"
import React, { useContext, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
// import Head from "next/head";
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from 'react-redux';

import HeaderUser from "@/components/UI/HeaderUser";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/Transactions";
import { Grid } from "@mui/material";
import CryptoJS from "crypto-js";
import { encryptBody } from "../../utils/globalEncryption";

// import { Steps } from 'antd';




const drawWidth = 220;


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    bgcolor: 'background.paper',
    borderRadius: 2,
    // border: '2px solid #000',
    boxShadow: 24, overflow: 'auto'
};


const innerStyle = {
    overflow: 'auto',
    width: 400,
    height: 400,
};



function TransactionHistory(props) {

    const [showServiceTrans, setShowServiceTrans] = useState({});

    const dispatch = useDispatch();

    const uid = Cookies.get('uid');


    useEffect(() => {



        const getTnx = async () => {
            const reqData = {
                uid
            }

            try {

                const response = await api.post("/transaction-details-by-uid", { data: encryptBody(JSON.stringify(reqData)) });

                if (response.status === 200) {
                    if (response.status === 200 || response.status === "OK") {
                        let url = "";
                        const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

                        var decr = CryptoJS.AES.decrypt(response.data.data, secretKey);
                        decr = decr.toString(CryptoJS.enc.Utf8);

                        let data = {};

                        if (decr) {
                            try {
                                let json_data = JSON.parse(decr);
                                data = json_data;

                                setShowServiceTrans(data)


                            } catch (e) {
                                console.warn(e)
                            }
                        }



                    }
                }

            } catch (error) {

                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }


            }
        }

        if (uid) {
            getTnx();
        }



    }, [uid])



    return (

        <Layout>
            <Transactions showServiceTrans={showServiceTrans} />
        </Layout>


    );
}

export default withAuth(TransactionHistory);
// export default TransactionHistory;



// export const getServerSideProps = async (context) => {
//     // Fetch data from an API or a database

//     // Return the data as props
//     return {
//         props: {
//             data,
//         },
//     };
// };
