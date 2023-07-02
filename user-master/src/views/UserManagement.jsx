import React, {
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Outlet, useMatches, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import schema from "../schema.json";
import { Box } from "@mui/system";

const Home = () => {
	const { Get } = useContext(ApiContext);
	const NotifyUser = useContext(NotifyUserContext);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [footerHeight, setFooterHeight] = useState(0);
	const [userSchema, setUserSchema] = useState(false);
	const [userSearch, setUserSearch] = useState(false);
	const [area, setArea] = useState(false);

	const buttonsRef = useRef([]);
	const navBarSearchListeners = useRef({});
	const navBarSearchListenersIds = useRef(0);
	const navigate = useNavigate();
	const { userListFilter } = useParams();
	const matches = useMatches();
	useLayoutEffect(() => {
		//if (state) {

		Get("/area/v1/tree")
			.then(({ data }) => {
				setArea(data);
			})
			.catch((err) => {
				NotifyUser.Error(
					`Problemas con el servicio de áreas. Notifique al servicio técnicos (${err.response.status}).`
				);
				console.error(err);
			});

		Get("/user/v1/roles")
			.then(({ data }) => {
				const roles = data.map((role) => ({
					const: role.ID,
					title: role.Name,
				}));

				const updatedSchema = {
					...schema,
					properties: {
						...schema.properties,
						Role: {
							...schema.properties.Role,
							oneOf: roles,
							enum: roles.map((role) => role.title),
						},
					},
				};

				setUserSchema(updatedSchema);
			})
			.catch((err) => {
				NotifyUser.Error(
					`Problemas con el servicio de roles. Notifique al servicio técnicos (${err.response.status}).`
				);
			});

		//eslint-disable-next-line
	}, []);
	useEffect(() => {
		if (userListFilter) {
			doGet(encodeURIComponent(userListFilter));
		}

		//eslint-disable-next-line
	}, [userListFilter]);

	const onSearch = (data) => {
		navigate(`/user-management/user-list/${encodeURIComponent(data)}`);
	};
	const doGet = (p) => {
		Get(`/user/v1/${p === "%3AuserListFilter" ? "users" : `search/${p}`}`)
			.then(({ data }) => {
				// if (data?.length === 1 && userSearch === false) {
				if (data && data.length === 1) {
					navigate(`/user-management/user-list/${p}/view-user/${data[0].ID}`);
					return;
				}
				setUserSearch(data);
			})
			.catch((err) => {
				NotifyUser.Error(
					`Problemas con la lista de usuarios. Notifique al servicio técnicos.`
				);
			});
	};
	const onNavbarSearchListener = (listener) => {
		const id = navBarSearchListenersIds.current++;
		navBarSearchListeners.current[id] = listener;
		return () => {
			delete navBarSearchListeners.current[id];
		};
	};

	return (
		<>
			<Navbar
				onHeightChange={setHeaderHeight}
				buttonsRef={buttonsRef}
				onSearch={onSearch}
			/>
			<Box
				container="true"
				sx={{
					position: "fixed",
					top: headerHeight,
					bottom: footerHeight,
					left: 0,
					right: 0,

					backgroundColor: matches.length > 1 && "#eeeeeeb0",
				}}
			>
				{area && userSchema && (
					<Outlet
						context={{
							onNavbarSearchListener,
							area,
							userSchema,

							userSearch,
							doGet,
						}}
					/>
				)}
			</Box>
			<Footer onHeightChange={setFooterHeight} />
		</>
	);
};

export default Home;
