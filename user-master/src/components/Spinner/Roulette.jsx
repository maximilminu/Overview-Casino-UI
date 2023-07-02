import React from "react";
import "./Roulette.css";

const Roulette = () => {
	return (
		<div className="container">
			<div className="spinner"></div>
			<div className="center">+</div>
			<div className="lines"></div>
			<div className="ball"></div>
		</div>
	);
};

export default Roulette;
