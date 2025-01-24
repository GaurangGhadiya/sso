import { Box, Container, Divider, Typography, Paper, Tab } from "@mui/material";
import { useState } from "react";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import UserNameDept from "./UserNameDept";
import Link from "next/link";


const DepartmentLogin = () => {

    const [value, setValue] = useState('1');


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 2, position: 'relative' }} >
            <Paper elevation={1} style={{ padding: '16px' }} >

                <Typography marginBottom={3} variant="h5" textAlign={'center'}>Department Login</Typography>
                <Divider />

                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Username" value="1" />
                        </TabList>
                    </Box>


                    <TabPanel value="1">
                        <UserNameDept />
                    </TabPanel>


                    <Link href="/department-registration">
                        <Typography textAlign={'center'} variant="body2" color={'primary'}>New Department? Sign up for Him Access</Typography>
                    </Link>


                </TabContext>

            </Paper>


        </Container>

    )
}
export default DepartmentLogin;