import "./typing.css";

export default function Typing() {
	// const handleClick = () => {
	// 	const firstBall = document.getElementById("firstBall");
	// 	const thirdBall = document.getElementById("thirdBall");
	// 	const secondBall = document.getElementById("secondBall");
	// 	const checkmark = document.querySelector("svg");

	// 	firstBall.animate(
	// 		[{ opacity: 0.2 }, { opacity: 0.1, offset: 0.1 }, { opacity: 0 }],
	// 		3000
	// 	);
	// 	thirdBall.animate(
	// 		[{ opacity: 0.2 }, { opacity: 0.1, offset: 0.1 }, { opacity: 0 }],
	// 		3000
	// 	);
	// 	secondBall.animate(
	// 		[
	// 			{ opacity: 0.5, transform: "scale(0.5)", backgroundColor: "gray" },
	// 			{ opacity: 1, transform: "scale(1)", backgroundColor: "green" },
	// 			{ opacity: 0, transform: "scale(1.5)", backgroundColor: "green" },
	// 		],
	// 		{ duration: 1500, fill: "forwards" }
	// 	);

	// 	setTimeout(function () {
	// 		firstBall.style.display = "none";
	// 		thirdBall.style.display = "none";
	// 		checkmark.style.display = "none";
	// 	}, 1000);
	// };
	return (
			<div className="loader">
				<span id="firstBall" />
				<span id="secondBall" />
				<span id="thirdBall" />
			</div>
	);
}
