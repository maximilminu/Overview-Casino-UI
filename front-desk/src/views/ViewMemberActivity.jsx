import * as React from "react";
import { Backdrop, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useLocation, useOutlet, useParams } from "react-router-dom";
import UserInformationTab from "../components/UserInformationTab";
import ListActivityMember from "../components/ListActivityMember";
import { ApiContext } from "@oc/api-context";
import { useState } from "react";
import { NotifyUserContext } from "@oc/notify-user-context";
import { useContext } from "react";
import Roulette from "../components/Spinner/Roulette";

const ViewMemberActivity = () => {
	const url = useLocation();
	const theme = useTheme();
	const [user, setUser] = useState({});
	const down600px = useMediaQuery(theme.breakpoints.down("sm"));
	const { id } = useParams();
	const NotifyUser = useContext(NotifyUserContext);
	const { Get } = React.useContext(ApiContext);
	const [visits, setVisits] = useState();
	const [img, setImg] = useState();
	const ifOutlet = useOutlet();

	React.useEffect(() => {
		Get(`/member/v1/by-id/${id}`)
			.then(({ data }) => {
				const dateConvert = new Date(data.Birthdate)
					.toLocaleString("es-AR")
					.split(",")[0];

				data.Birthdate = dateConvert;

				setUser(data);
			})
			.catch((error) => {
				NotifyUser.Warning(
					`Error para obtener los datos del usuario, (${error.request.status})`
				);
			});

		// eslint-disable-next-line
		Get(`/visit/v1/by-memberID/${id}`)
			.then(({ data }) => {
				setVisits(data);
			})
			.catch((error) => {
				NotifyUser.Warning(
					`Error para obtener los datos del usuario, (${error.request.status})`
				);
			});

		Get(`/storage/avatar/${id}/1000?t=${Date.now()}`).then(({ data }) => {
			setImg(data);
		});
		// eslint-disable-next-line
	}, [id]);

	return ifOutlet ? (
		<Outlet />
	) : (
		<>
			{user.Name ? (
				<Grid
					container
					spacing={0.5}
					sx={{ justifyContent: "space-around", marginTop: "20px" }}
				>
					<Grid
						item
						xs={12}
						sm={9}
						md={4}
						lg={4}
						xl={3}
						sx={{
							padding: { sm: "40px" },
							display: { md: "flex", lg: "flex" },
							justifyContent: { md: "center", lg: "center" },
						}}
					>
						<UserInformationTab user={user} img={img} />
					</Grid>
					<Grid item sx={{ marginBottom: down600px && "50px" }} xs={12} md={8}>
						<ListActivityMember visits={visits} />
					</Grid>
				</Grid>
			) : (
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
					open={true}
				>
					<Roulette />
				</Backdrop>
			)}
		</>
	);
};

export default ViewMemberActivity;
