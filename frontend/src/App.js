import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { Footer, Header } from "./layouts";
import { API_URL } from "./constants";

export const ColorContext = React.createContext({
	stableName: "Super stable",
	mainRGB: "fff6de",
	supportRGB: "d19b5e",
	backgroundRGB: "fdffe8",
	detailRGB: "111111",
});

const App = () => {
	const [mainInfo, setMainInfo] = useState({
		stableName: "Super stable",
		mainRGB: "fff6de",
		supportRGB: "d19b5e",
		backgroundRGB: "fdffe8",
		detailRGB: "111111",
	});

	useEffect(() => {
		fetch(API_URL + "mainInfo")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setMainInfo(response);
			});
	}, []);

	console.log(mainInfo);

	return (
		<div className='App' style={{ backgroundColor: `#${mainInfo.mainRGB}` }}>
			<ColorContext.Provider value={(({ stableName, ...obj }) => obj)(mainInfo)}>
				<Header stableName={mainInfo.stableName} />
				<div className='Content' style={{ backgroundColor: `#${mainInfo.backgroundRGB}` }}>
					<Outlet />
				</div>
				<Footer />
			</ColorContext.Provider>
		</div>
	);
};

export default App;
