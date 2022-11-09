import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { Footer, Header } from "./layouts";
import { ColorContext } from "./contextProviders";

const App = () => {
	const { colorContext } = useContext(ColorContext);

	return (
		<div className='App' style={{ backgroundColor: `#${colorContext.mainRGB}` }}>
			<Header />
			<div className='Content' style={{ backgroundColor: `#${colorContext.backgroundRGB}` }}>
				<Outlet />
			</div>
			<Footer />
		</div>
	);
};

export default App;
