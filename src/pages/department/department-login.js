import Header from "../../components/UI/Header";
import DepartmentLogin from "../../components/Login/DepartmentLogin";
import withDeptCheck from "../../../utils/withDeptCheck";
const LoginDept = () => {
  return (
    <>
      {/* <Header> */}
      <DepartmentLogin />
      {/* </Header> */}
    </>
  );
};
export default withDeptCheck(LoginDept);
