import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import { Edit } from "@mui/icons-material";
import Link from "next/link";

const ViewAllServices = () => {

    const [allServices, setAllServices] = useState({});


    const getDate = (timeZone) => {
        const dateString = timeZone;
        const dateObject = new Date(dateString);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");

        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate;
    }

    const dispatch = useDispatch();

    useEffect(() => {

        const dataToSend = {
            dept_user_id: Cookies.get('uid'),
        }

        const getAllServices = async () => {

            try {
                const response = await api.post('/get-all-service', dataToSend);
                if (response.status === 200) {

                    const services = response.data.map((item, index) => ({
                        name: item.name,
                        service_id: item.service_id,
                        status: item.status,
                        success_url: item.success_url,
                        createdAt: getDate(item.createdAt),
                    }));

                    setAllServices(services)
                }
            } catch (error) {

                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                } else if (error?.response?.data) {
                    dispatch(callAlert({ message: error.response.data, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }


            }

        }

        getAllServices();
    }, [])


    return (
        <main className="p-6 space-y-6">
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
                <Grid item={true} xs={12}   >



                    <Typography variant="h5" mb={3} mt={2}>Registered Services</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="Registered Services Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Service ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Success URL</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Created On</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Action</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allServices.length > 0 ? allServices.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.service_id}</TableCell>
                                        <TableCell align="right">{row.status === 1 ? <Typography color={'#4CAF50'}>Active</Typography> : <Typography color={'#FFC107'}>Pending</Typography>}</TableCell>
                                        <TableCell align="right">{row.success_url}</TableCell>
                                        <TableCell align="right">{row.createdAt}</TableCell>
                                        <TableCell align="right"><Link href={`edit-service/${row.service_id}`}><Edit /></Link></TableCell>
                                    </TableRow>
                                )) : (

                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            <Typography color={'error'}>Service not available.</Typography>
                                        </TableCell>
                                    </TableRow>

                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Grid>
            </Grid>
        </main>
    )
}
export default ViewAllServices;