import React, { useEffect, useState } from 'react';
import { Box, Button, CardMedia, Chip, Divider, Grid, IconButton, Modal, Paper } from '@mui/material';


import { useDispatch, useSelector } from 'react-redux';
import AllServices from './User/AllServices';

import styles from '../Login/Login.module.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 30,
    maxHeight: '80vh',
    overflow: 'hidden',
    overflowY: 'auto',
    p: 4,
    borderRadius: 1
};


const Container = (props) => {




    return (
        <>
            <main className="p-6 space-y-6">

                <Grid
                    container
                    spacing={4}
                    sx={{ padding: 2, marginBottom: 10 }}
                >

                    <Grid item={true} xs={12} >

                        <AllServices />
                    </Grid>



                </Grid>




            </main>

        </>
    );
};

export default Container;