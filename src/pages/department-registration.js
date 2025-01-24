import DepartmentStepForm from "@/components/DepartmentRegistration/DepartmentStepForm";
import Header from "@/components/UI/Header";
import withDeptCheck from "../../utils/withDeptCheck";

const departmentRegistration = () => {
  return (
    <>
      {/* <Header /> */}
      <DepartmentStepForm />
    </>
  );
};
export default withDeptCheck(departmentRegistration);
