"use client";
import AddDepartmentService from "@/components/DepartmentService/AddDepartmentService";
import Header from "@/components/UI/Header";
import withDeptAuth from "../../../utils/withDeptAuth";
import { useState } from "react";
import DashboardLayout from "./departmentLayout";

function DepartmentService(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});

  return (
    <Header>
      <AddDepartmentService />
    </Header>
  );
}

export default withDeptAuth(DepartmentService);
