import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function TopCard(props) {
    const theme = useTheme();

    return (
        <Card sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <CardMedia
                    component="img"
                    sx={{ width: 110, padding: 2 }}
                    image={props.image}
                />
                <CardContent sx={{ flex: '1 0 auto' }} >
                    <Typography component="div" variant="h6">
                        {props.name}
                    </Typography>
                    {/* <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                    </Typography> */}
                </CardContent>


            </Box>

        </Card>
    );
}
