import { Paper, Container, CircularProgress, Box } from "@mui/material";

const StepContainer = (props) => {
	return (
		<Container maxWidth="md" sx={{ position: "relative", display: "flex" }}>
			<Box
				style={{
					padding: 16,
					marginTop: 10,
					marginBottom: 10,
				}}
			>
				{props.children}

				{props.loading && (
					<div style={{ position: "absolute", bottom: "12px" }}>
						{/* <CircularProgress style={{ height: '20px', width: "20px" }} /> */}
					</div>
				)}
			</Box>
		</Container>
	);
};
export default StepContainer;
