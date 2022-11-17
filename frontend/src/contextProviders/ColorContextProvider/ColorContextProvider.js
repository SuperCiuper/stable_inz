import React, { createContext, useEffect, useState } from "react";
import { API_URL, checkResponseOk } from "../../constants";

var defaultColors = {
	backgroundMain: "#fff6de",
	backgroundContent: "#d19b5e",
	panel: "#ffffff",
	header: "#d19b5e",
	detail: "#111111",
	button: "#000000",
	highlight: "#ffff82",
};

export const ColorContext = createContext({ colorContext: { ...defaultColors } });

export const ColorContextProvider = ({ children }) => {
	const [colorContext, setColorContext] = useState(defaultColors);

	useEffect(() => {
		fetch(API_URL + "colorInfo")
			.then((response) => checkResponseOk(response))
			.then((response) => setColorContext(response))
			.catch((err) => {
				console.error(`Server response: ${err}`);
			});
	}, []);

	return <ColorContext.Provider value={{ colorContext, setColorContext }}>{children}</ColorContext.Provider>;
};
