import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { Footer, Header } from "./layouts";
import { API_URL } from "./constants";
import { Toast } from "primereact/toast";

const EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 hours

const defaultColors = {
	mainRGB: "fff6de",
	supportRGB: "d19b5e",
	backgroundRGB: "fdffe8",
	detailRGB: "111111",
	buttonsRGB: "000000",
	highlightRGB: "FFFF82",
};

export const AuthContext = createContext({});
export const ColorContext = createContext();

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
	const [colorContext, setColorContext] = useState(defaultColors);
	const navigate = useNavigate();
	const toast = useRef(null);

	console.log(colorContext);
	console.log(useWindowDimensions()); // TODO check if needed

	useEffect(() => {
		fetch(API_URL + "colorInfo")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setColorContext(response);
			});
	}, []);

	const showDataUpdateSuccess = (message) => {
		toast.current.show({ severity: "success", summary: "Sukces", detail: message, life: 2000 });
	};

	const showDataUpdateError = (message) => {
		toast.current.show({ severity: "error", summary: "Błąd", detail: message, life: 6000 });
	};

	const loginUser = (password) => {
		fetch(API_URL + "auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				password: password,
			}),
		})
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then(
				(response) => {
					setAuthContext((prevState) => {
						prevState.isLogged = true;
						prevState.getAuthHeader = () => {
							return { "x-access-token": response.accessToken };
						};
						return prevState;
					});

					navigate("/");
				},
				(err) => {
					console.log(err);
					showDataUpdateError("Próba logowania nie powiodła się");
				}
			);
	};

	const logoutUser = useCallback(() => {
		setAuthContext((prevState) => {
			prevState.isLogged = false;
			prevState.getAuthHeader = () => {
				return {};
			};
			return prevState;
		});
		navigate("/");
	}, [navigate]);

	const [authContext, setAuthContext] = useState({
		loginUser: loginUser,
		logoutUser: logoutUser,
		getAuthHeader: () => {
			return {};
		},
		showDataUpdateSuccess: showDataUpdateSuccess,
		showDataUpdateError: showDataUpdateError,
		isLogged: false,
	});

	useEffect(() => {
		let interval = setInterval(() => {
			if (authContext.isLogged) {
				toast.current.show({ severity: "warn", summary: "Wylogowano", detail: "Przekroczony czas sesji, zostałeś wylogowany!", life: 10000 });
				logoutUser();
			}
		}, EXPIRATION_TIME);

		return () => clearInterval(interval);
	}, [authContext, logoutUser]);

	return (
		<ColorContext.Provider value={{ colorContext, setColorContext }}>
			<AuthContext.Provider value={authContext}>
				<div className='App' style={{ backgroundColor: `#${colorContext.mainRGB}` }}>
					<Toast ref={toast} />
					<Header />
					<div className='Content' style={{ backgroundColor: `#${colorContext.backgroundRGB}` }}>
						<Outlet />
					</div>
					<Footer />
				</div>
			</AuthContext.Provider>
		</ColorContext.Provider>
	);
};

export default App;
