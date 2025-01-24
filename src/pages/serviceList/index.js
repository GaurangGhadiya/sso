import React from 'react'
import Layout from "@/components/Dashboard/layout";
import AllServices from '../../components/Dashboard/User/AllServices';
import { Grid } from '@mui/material';

const ServiceList = () => {
    return (
        <Layout>
            <main className="p-6 space-y-6">
                <Grid
                    container
                    spacing={4}
                    sx={{ padding: 2, marginBottom: 10 }}
                >

                    <Grid item={true} xs={12}  >
            <AllServices />

                    </Grid>
                    </Grid>
                </main>
      </Layout>
  )
}

export default ServiceList