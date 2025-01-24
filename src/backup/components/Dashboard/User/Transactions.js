import { Box, Button, Card, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";

const Transactions = ({ showServiceTrans }) => {

    const getDate = (timeZone) => {
        const dateString = timeZone;
        const dateObject = new Date(dateString);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");
        const hours = String(dateObject.getHours()).padStart(2, "0");
        const minutes = String(dateObject.getMinutes()).padStart(2, "0");

        // Determine if it's AM or PM
        const amOrPm = hours >= 12 ? "PM" : "AM";

        // Convert hours to 12-hour format
        const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

        const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;

        return formattedDateTime;
    };


    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }


    const rowsPerPageOptions = [5, 10, 25];

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <main className="p-6 space-y-6">

            <Card style={{ margin: 10 }} >
                <Grid
                    container
                    spacing={4}
                    sx={{ padding: 2 }}
                >
                    <Grid item={true} xs={12}   >

                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                            <Typography style={{ color: '#0e8193' }} mb={3} mt={2} >User Transaction Summary</Typography>
                        </Box>


                        {/* <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                            <Typography variant="h5" mb={3} mt={2}>User Transaction Summary</Typography>
                        </Box> */}

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="Department Transaction Summary Table">
                                <TableHead>
                                    <TableRow>

                                        <TableCell style={{ fontWeight: 'bold' }} align="left">#</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }} align="left">Username</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }} align="left">Client IP</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }} align="left">Browser Name</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }} align="left">Browser Version</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }} align="left">OS Name</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }} align="left">City</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }} align="left">Latitude</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }} align="left">Longitude</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', textWrap: "nowrap" }} align="right">Login Time</TableCell>
                                        <TableCell style={{ fontWeight: 'bold', textWrap: "nowrap" }} align="right">Logout Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {showServiceTrans.length > 0 ? (rowsPerPage > 0
                                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : rows
                                    ).map((row, index) => (

                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >

                                            <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.clientIp}</TableCell>
                                            <TableCell>{row.browserName}</TableCell>
                                            <TableCell>{row.browserVersion}</TableCell>
                                            <TableCell>{row.osName}</TableCell>
                                            <TableCell>{row.city}</TableCell>
                                            <TableCell>{row.lat}</TableCell>
                                            <TableCell>{row.lng}</TableCell>
                                            <TableCell>{row.loginTime && getDate(row.loginTime)}</TableCell>
                                            <TableCell>{row.logoutTime && getDate(row.logoutTime)}</TableCell>

                                        </TableRow>
                                    )) : (

                                        <TableRow>
                                            <TableCell colSpan={11} component="th" scope="row">
                                                <Typography color={'error'}>Transactions not available.</Typography>
                                            </TableCell>
                                        </TableRow>

                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={{}}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onPageChange}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>

                    <Grid
                        container
                    // sx={{ background: "#FFF" }}
                    >



                    </Grid>
                </Grid>
            </Card>
        </main>
    )
}
export default Transactions;