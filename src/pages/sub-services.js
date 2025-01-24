import AllServices from "@/components/Dashboard/Parichay/AllServices";
import SubServiceComponent from "@/components/Dashboard/Parichay/SubServices";
import ParichayContainer from "@/components/Dashboard/Parichay/parichayContainer";
import ParichayLayout from "@/components/Dashboard/Parichay/parichayLayout";
import HeaderGovUser from "@/components/UI/HeaderGovUser";
import { useEffect, useState } from "react";

const SubServices = () => {
  return (
    <>
      {/* <HeaderGovUser /> */}
      <ParichayLayout>
        <SubServiceComponent />
      </ParichayLayout>
      {/* <AllServices /> */}
    </>
  );
};
export default SubServices;
