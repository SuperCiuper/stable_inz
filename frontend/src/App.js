import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { Footer, Header } from "./layouts";
import { API_URL } from "./constants";

const defaultColors = {
	mainRGB: "fff6de",
	supportRGB: "d19b5e",
	backgroundRGB: "fdffe8",
	detailRGB: "111111",
	buttonsRGB: "000000",
	highlightRGB: "FFFF82",
};

export const ColorContext = React.createContext(defaultColors);

export const useWindowDimensions = () => {
	const [windowDimensions, setWindowDimensions] = useState({
		dynamicWidth: window.innerWidth,
		dynamicHeight: window.innerHeight,
	});

	const setDimensions = () => {
		setWindowDimensions({
			dynamicWidth: window.innerWidth,
			dynamicHeight: window.innerHeight,
		});
	};

	useEffect(() => {
		window.addEventListener("resize", setDimensions);
		return () => window.removeEventListener("resize", setDimensions);
	}, [windowDimensions]);

	return windowDimensions;
};

const App = () => {
	const [mainInfo, setMainInfo] = useState(defaultColors);

	console.log(useWindowDimensions()); // check if needed

	useEffect(() => {
		fetch(API_URL + "mainInfo")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setMainInfo(response);
			});
	}, []);

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
