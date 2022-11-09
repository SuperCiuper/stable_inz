import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, checkResponseOk } from "../../constants";
import { Toast } from "primereact/toast";

const BUFFER_EXPIRATION_TIME = 30 * 1000; // 30 seconds

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
	const navigate = useNavigate();
	const toast = useRef(null);

	const loginUser = (password) => {
		fetch(API_URL + "auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				password: password,
			}),
		})
			.then((response) => checkResponseOk(response))
			.then((response) => {
				localStorage.setItem("authToken", JSON.stringify(response.accessToken));
				localStorage.setItem("expirationTime", Date.now() + response.expiresIn - BUFFER_EXPIRATION_TIME);

				setAuthContext((prevState) => {
					prevState.isLogged = true;
					prevState.getAuthHeader = () => {
						return { "x-access-token": response.accessToken };
					};
					return { ...prevState };
				});
				navigate("/");
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
				toast.current.show({ severity: "error", summary: "Błąd", detail: "Próba logowania nie powiodła się", life: 10000 });
			});
	};

	const logoutUser = useCallback(() => {
		console.warn("logout");
		localStorage.removeItem("authToken");
		localStorage.removeItem("expirationTime");

		setAuthContext((prevState) => {
			prevState.isLogged = false;
			prevState.getAuthHeader = () => {
				return {};
			};
			return { ...prevState };
		});
		navigate("/");
	}, [navigate]);

	const performDataUpdate = (url, method, body, callback) => {
		const authToken = localStorage.getItem("authToken");
		if (authToken === null || authContext === undefined) {
			toast.current.show({ severity: "error", summary: "Token lost", detail: "Nie znaleziono tokena, wylogowano!", life: 10000 });
			logoutUser();
			return;
		}
		fetch(
			API_URL + url,
			url === "image" && method === "POST"
				? {
						method: "POST",
						headers: { "x-access-token": JSON.parse(authToken) },
						body: body,
				  }
				: {
						method: method,
						headers: { "x-access-token": JSON.parse(authToken), "Content-Type": "application/json" },
						body: JSON.stringify(body),
				  }
		)
			.then((response) => checkResponseOk(response))
			.then(() => {
				callback();
				toast.current.show({ severity: "success", summary: "Sukces", detail: "Zmiany zostałe zapisane", life: 2000 });
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
				if (err === "No token provided!") {
					toast.current.show({ severity: "error", summary: "Błąd", detail: `"${err}", token zgubiony, zostałeś wylogowany!`, life: 6000 });
					logoutUser();
					return;
				}
				if (err === "Unauthorized!") {
					toast.current.show({ severity: "warn", summary: "Brak uprawnień", detail: "Nie masz uprawnień, aby modyfikować ten zasób!", life: 6000 });
					return;
				}
				toast.current.show({ severity: "error", summary: "Błąd", detail: `Błąd serwera: "${err}", zmiany nie zostały zapisane`, life: 6000 });
			});
	};

	const [authContext, setAuthContext] = useState({
		loginUser: loginUser,
		logoutUser: logoutUser,
		performDataUpdate: performDataUpdate,
		isLogged: localStorage.getItem("authToken") ? true : false,
	});

	useEffect(() => {
		if (authContext.isLogged) {
			const expirationTime = localStorage.getItem("expirationTime");
			if (expirationTime === null || expirationTime === undefined || Date.now() >= expirationTime) {
				toast.current.show({ severity: "warn", summary: "Wylogowano", detail: "Przekroczony czas sesji, wylogowano!", life: 10000 });
				logoutUser();
				return;
			}

			let interval = setInterval(() => {
				if (authContext.isLogged) {
					toast.current.show({ severity: "warn", summary: "Wylogowano", detail: "Przekroczony czas sesji, wylogowano!", life: 10000 });
					logoutUser();
				}
			}, expirationTime - Date.now());

			return () => clearInterval(interval);
		}
	}, [authContext, logoutUser]);

	return (
		<AuthContext.Provider value={authContext}>
			<Toast ref={toast} />
			{children}
		</AuthContext.Provider>
	);
};
