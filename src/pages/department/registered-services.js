// "use client";
import AddDepartmentService from "@/components/DepartmentService/AddDepartmentService";
import Header from "@/components/UI/Header";
import withDeptAuth from "../../../utils/withDeptAuth";
import { useState } from "react";
import DashboardLayout from "./departmentLayout";

import ViewAllServices from "@/components/DepartmentService/ViewAllServices";

function RegisteredServices(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});

  return (
    <Header>
      <ViewAllServices />
    </Header>
  );
}

export default withDeptAuth(RegisteredServices);
