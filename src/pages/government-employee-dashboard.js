import AllServices from "@/components/Dashboard/Parichay/AllServices";
import ParichayContainer from "@/components/Dashboard/Parichay/parichayContainer";
import ParichayLayout from "@/components/Dashboard/Parichay/parichayLayout";
import HeaderGovUser from "@/components/UI/HeaderGovUser";
import { useEffect, useState } from "react";

const govEmp = () => {



    return (
        <>
            {/* <HeaderGovUser /> */}
            <ParichayLayout>
                <ParichayContainer />
            </ParichayLayout>
            {/* <AllServices /> */}
        </>
    )
}
export default govEmp;