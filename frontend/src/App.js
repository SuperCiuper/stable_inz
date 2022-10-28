import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { Footer, Header } from "./layouts";
import { AuthContextProvider, ColorContext, ColorContextProvider } from "./contextProviders";

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
	const colorContext = useContext(ColorContext);

	console.log(colorContext);
	console.log(useWindowDimensions()); // TODO check if needed

	return (
		<AuthContextProvider>
			<ColorContextProvider>
				<div className='App' style={{ backgroundColor: `#${colorContext.mainRGB}` }}>
					<Header />
					<div className='Content' style={{ backgroundColor: `#${colorContext.backgroundRGB}` }}>
						<Outlet />
					</div>
					<Footer />
				</div>
			</ColorContextProvider>{" "}
		</AuthContextProvider>
	);
};

export default App;
