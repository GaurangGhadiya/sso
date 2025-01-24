
import Layout from "@/components/Dashboard/layout";
import Container from "@/components/Dashboard/Container";
import { Box } from "@mui/material";

import styles from '../../components/Login/Login.module.css'
import withAuth from "../../../utils/withAuth";

const AllServices = () => {


    return (
        <>
            <Layout>

                <Container />
            </Layout>
        </>
    )
}
export default withAuth(AllServices);