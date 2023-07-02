import { Backdrop, Grid } from "@mui/material";
import React, { useContext, useLayoutEffect, useState } from "react";

import moment from "moment";
import Roulette from "../components/Spinner/Roulette";

import { ApiContext } from "@oc/api-context";

import CounterTable from "../components/CounterTable";

const Table = () => {
	const [loading, setLoading] = useState(true);

	const { Get } = useContext(ApiContext);

	const [selectedDate, setSelectedDate] = useState();

	const [data, setData] = useState();

	const getDateInUnix = (date) => {
		const selectedDate = moment(date).startOf("day");
		return selectedDate.valueOf();
	};

	const handleDateChange = (date) => {
		setLoading(true);
		setData();
		setSelectedDate(new Date(date));
	};

	// const unix = 1670209200000;

	useLayoutEffect(() => {
		const dateInUnix = getDateInUnix(selectedDate);
		Get(`/egm-meter/v1/profit?Time=${dateInUnix}`)
			.then(({ data }) => {
				setData(data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
		//eslint-disable-next-line
	}, [selectedDate]);

	return (
		<>
			{loading ? (
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
					open={true}
				>
					<Roulette />
				</Backdrop>
			) : (
				<Grid
					md={8}
					item
					sx={{ height: "90%", marginTop: "25px", padding: "1rem 10rem" }}
				>
					{data && (
						<CounterTable
							data={data}
							setLoading={setLoading}
							loading={loading}
							handleDateChange={handleDateChange}
							selectedDate={selectedDate}
						/>
					)}
				</Grid>
			)}
		</>
	);
};

export default Table;
