import { Paper, Container, CircularProgress } from "@mui/material";


const StepContainer = (props) => {
    return (
        <Container maxWidth="md" sx={{ marginTop: 2, position: 'relative' }} >
            <Paper elevation={1} style={{ padding: '16px' }} >


                {props.children}

                {props.loading && (
                    <div style={{ position: 'absolute', bottom: '12px' }}>
                        <CircularProgress style={{ height: '20px', width: "20px" }} />
                    </div>
                )}

            </Paper>

        </Container>
    )
}
export default StepContainer;