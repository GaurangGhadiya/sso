import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function CardItem({ title, url }) {
	const [isFavorite, setIsFavorite] = useState(false);

	return (
		<Card className="yo">
			<CardMedia
				component="img"
				alt="green iguana"
				image={url}
				style={{
					width: "200px", // Set your desired width
					height: "90px", // Set your desired height
					objectFit: "contain", // Adjust how the image fits within the specified dimensions
				}}
			/>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div" fontWeight="bold">
					{title}
				</Typography>
				{/* <Typography variant="body2" color="text.secondary">
                    {data.address}
                </Typography> */}
			</CardContent>
			<CardActions sx={{ justifyContent: "space-between" }}>
				<div>
					<Button classsName="features" size="small">
						Visit
					</Button>
					{/* <Button classsName="features" size="small">
                        {data.bathroom} Bathrooms
                    </Button> */}
				</div>
				<div onClick={() => setIsFavorite(!isFavorite)}>
					{isFavorite ? (
						<FavoriteIcon color="error" />
					) : (
						<FavoriteBorderIcon color="error" />
					)}
				</div>
			</CardActions>
		</Card>
	);
}

export default CardItem;
