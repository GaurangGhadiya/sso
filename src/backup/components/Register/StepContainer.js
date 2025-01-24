import { Paper, Container, CircularProgress } from "@mui/material";

const StepContainer = (props) => {
  return (
    <Container maxWidth="md" sx={{ position: "relative", display: "flex" }}>
      <Paper
        elevation={1}
        style={{
          padding: 16,
          marginTop: 10,
          marginBottom: 10,
          width: "100%",
        }}
      >
        {props.children}

        {props.loading && (
          <div style={{ position: "absolute", bottom: "12px" }}>
            {/* <CircularProgress style={{ height: '20px', width: "20px" }} /> */}
          </div>
        )}
      </Paper>
    </Container>
  );
};
export default StepContainer;
