import withDeptAuth from "../../../utils/withDeptAuth";
import DepartmentContainer from "./departmentContainer";
import DashboardLayout from "./departmentLayout";
import Header from "@/components/UI/Header";

const dashboard = () => {
  return (
    <>
      <Header>
        <DepartmentContainer />
      </Header>
    </>
  );
};
export default withDeptAuth(dashboard);
