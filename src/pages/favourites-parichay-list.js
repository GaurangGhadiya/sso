import { useEffect, useState } from "react";
import api from "../../utils/api";
import Cookies from "js-cookie";
import {
	Container,
	Box,
	Typography,
	Grid,
	Paper,
	Rating,
	CardActionArea,
	Divider,
} from "@mui/material";
// import Image from "next/image";
import { useDispatch } from "react-redux";
import { callAlert } from "../../redux/actions/alert";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";
import ParichayLayout from "@/components/Dashboard/Parichay/parichayLayout";
import { useRouter } from "next/router";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { encryptBody } from "../../utils/globalEncryption";
import CryptoJS from "crypto-js"
const gradientStyle = {
	height: "30px",
	background: "linear-gradient(90deg, rgba(24, 118, 209,0.5), transparent)",
	/* You can adjust the angle and colors as needed */
};

const FavouriteParichayList = () => {
	const [servicesList, setservicesList] = useState([]);
	const uid = Cookies.get("govEnc");

	const [name, setName] = useState("");
	const [GovEmail, setGovEmail] = useState("");
	const route = useRouter();

	useEffect(() => {
		const encryptedData = Cookies.get("govEnc");

		let userInfo = "";
		if (encryptedData) {
			try {
				userInfo = JSON.parse(atob(encryptedData));
			} catch (e) {}

			setName(userInfo.name);
			setGovEmail(userInfo.userName);

			getList(userInfo.userName);
		}
		// getList("nakulkumar2010@gmail.com")
		else {
			route.push("./login");
		}
	}, []);

	const getList = async (email) => {
		try {
			let reqData = {
				user_id: email,
				service_type: "parichay",
			}
			const response = await api.post("/favourate-list",
				{ data: encryptBody(JSON.stringify(reqData)) }
				);

			if (response) {
				if (response) {
					let url = "";
					const secretKey = process.env.NEXT_PUBLIC_API_SARVATRA_SECRET_KEY;
					var decr = CryptoJS.AES.decrypt(response?.data?.data, secretKey);
					decr = decr.toString(CryptoJS.enc.Utf8);

					let data = {};

					if (decr) {
						try {
							let json_data = JSON.parse(decr);
							data = json_data;

							setservicesList(data);


						} catch (e) {
							console.warn(e)
						}
					}



				}
			}
		} catch (e) {}
	};

	useEffect(() => {}, []);

	const removeFromFavourite = async (item) => {
		Swal.fire({
			title: "Remove from Favourites?",
			text: `Are you sure you want to remove ${item.app_name} Application from your favorites`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes",
			cancelButtonText: "No",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const reqData = {
					user_id: GovEmail,
					service_ids: [item.id],
					service_type: "parichay",
				};

				try {
					const response = await api.post("/delete-favourite-app", { data: encryptBody(JSON.stringify(reqData)) });

					if (response.status === 200) {
						Swal.fire(
							"Success!",
							`${item.app_name} Application has been Removed from favorites`,
							"success"
						);
					}
				} catch (error) {}
				// For more information about handling dismissals please visit
				// https://sweetalert2.github.io/#handling-dismissals
			} else if (result.dismiss === Swal.DismissReason.cancel) {
			}
		});
	};

	function openInNewWindow(url) {
		// Open the URL in a new window with specific window features
		const newWindow = window.open(url, "_blank", "noopener,noreferrer");

		// Check if the window was successfully opened
		if (newWindow) {
			// Focus the new window (optional)
			newWindow.focus();
		}
	}

	return (
		<ParichayLayout>
			<main className="p-6 space-y-6">
				<Grid container spacing={4} sx={{ padding: 2 }}>
					<Grid item={true} xs={12}>
						<Grid container spacing={2}>
							<Grid item sx={{ width: "100%" }}>
								<Card>
									<Box
										display={"flex"}
										justifyContent={"space-between"}
										alignItems={"center"}
									>
										<Typography
											style={{ color: "#0e8193" }}
											mb={3}
											mt={2}
											ml={2}
										>
											Favourites
										</Typography>
									</Box>

									<Grid container ml={1} mt={2} xs={12}>
										{servicesList &&
											servicesList.length > 0 &&
											servicesList.map((item, index) => (
												<Card
													key={index}
													elevation={4}
													sx={{
														"&:hover": {
															transform: "scale(1.02)", // Scale the card on hover
														},
														width: 230,
														marginRight: 5,
														marginBottom: 5,
													}}
												>
													<CardActionArea
														onClick={() => openInNewWindow(item.app_url)}
													>
														<CardMedia
															style={{
																height: 70, // Adjust this value to suit your layout
																width: "100%", // Adjust this value to suit your layout
																objectFit: "cover",
																// This ensures the image fills the space without stretching
															}}
															component="img"
															image={item.app_logo}
															alt="green iguana"
														/>

														<Divider style={{ marginTop: 12 }}></Divider>

														<Grid container spacing={2}>
															<Grid item xs={9.5}>
																<Typography
																	gutterBottom
																	mt={1}
																	style={{ textAlign: "center", fontSize: 14 }}
																>
																	{item.app_name} {" Application"}
																</Typography>
															</Grid>

															<Grid
																item
																xs={2}
																sx={{
																	justifyContent: "center",
																	alignSelf: "center",
																}}
															>
																<IconButton
																	color="warning"
																	aria-label="delete"
																	size="medium"
																	style={{ marginRight: 14 }}
																	onClick={(event) =>
																		removeFromFavourite(event, item)
																	}
																>
																	<DeleteForeverIcon fontSize="inherit" />
																</IconButton>

																{/* <Rating onClick={() => addToFavourite(item)} style={{ marginRight: 14 }} name="customized-1" defaultValue={0} max={1} /> */}
															</Grid>
														</Grid>
													</CardActionArea>
												</Card>
											))}
									</Grid>
								</Card>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</main>
		</ParichayLayout>
	);
};
export default FavouriteParichayList;
