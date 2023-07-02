import { CircularProgress } from "@mui/material";

import React, { useLayoutEffect, useState } from "react";

const RequestAndRender = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [responseData, setResponseData] = useState(false);

	let Loader, Component;
	//definir donde se ejecuta cada cosa
	if (!props.loaderComponent) {
		Loader = () => <CircularProgress color="error" />;
	} else {
		Loader = props.loaderComponent;
	}
	if (!props.component) {
		Component = props.children;
	} else {
		Component = props.component;
	}

	// if (!props.errorComponent) {
	// 	Error = () => <Typography>Error al traer la información</Typography>;
	// } else {
	// 	Error = props.errorComponent;
	// }

	useLayoutEffect(() => {
		if (props.requester) {
			props
				.requester()
				.then((resp) => {
					setResponseData(resp);
					if (props.onResponse) {
						props.onResponse(resp);
					}
				})
				.catch((error) => {
					setResponseData(error);
					if (props.onError) {
						props.onError(error);
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
		//eslint-disable-next-line
	}, []);

	return isLoading ? <Loader /> : <Component response={responseData} />;
};

export default RequestAndRender;
