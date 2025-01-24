import Header from "@/components/UI/Header";
import withDeptAuth from "../../../../utils/withDeptAuth";
import EditService from "@/components/DepartmentService/EditService";
import { useRouter } from "next/router";

const DepartmentService = () => {
  const router = useRouter();
  const { service_id } = router.query;

  return (
    <>
      {/* <Header /> */}
      <EditService service_id={service_id} />
    </>
  );
};
export default withDeptAuth(DepartmentService);
