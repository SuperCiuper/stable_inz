import React, { createContext, useEffect, useState } from "react";
import { API_URL } from "../constants";

const defaultColors = {
	mainRGB: "fff6de",
	supportRGB: "d19b5e",
	backgroundRGB: "fdffe8",
	detailRGB: "111111",
	buttonsRGB: "000000",
	highlightRGB: "FFFF82",
};

export const ColorContext = createContext(defaultColors);

export const ColorContextProvider = ({ children }) => {
	const [colorContext, setColorContext] = useState(defaultColors);

	useEffect(() => {
		fetch(API_URL + "colorInfo")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setColorContext(response);
			});
	}, []);

	return <ColorContext.Provider value={{ colorContext, setColorContext }}>{children}</ColorContext.Provider>;
};
