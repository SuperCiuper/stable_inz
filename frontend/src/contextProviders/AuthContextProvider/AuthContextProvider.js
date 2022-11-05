import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";
import { Toast } from "primereact/toast";

const EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 hours

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
	const navigate = useNavigate();
	const toast = useRef(null);

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
					localStorage.setItem("authToken", JSON.stringify(response.accessToken));
					setAuthContext((prevState) => {
						prevState.isLogged = true;
						prevState.getAuthHeader = () => {
							return { "x-access-token": response.accessToken };
						};
						return { ...prevState };
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
		localStorage.removeItem("authToken");
		setAuthContext((prevState) => {
			prevState.isLogged = false;
			prevState.getAuthHeader = () => {
				return {};
			};
			return { ...prevState };
		});
		navigate("/");
	}, [navigate]);

	const [authContext, setAuthContext] = useState({
		loginUser: loginUser,
		logoutUser: logoutUser,
		getAuthHeader: localStorage.getItem("authToken")
			? () => {
					return { "x-access-token": JSON.parse(localStorage.getItem("authToken")) };
			  }
			: () => {
					return {};
			  },
		showDataUpdateSuccess: showDataUpdateSuccess,
		showDataUpdateError: showDataUpdateError,
		isLogged: localStorage.getItem("authToken") ? true : false,
	});

	useEffect(() => {
		let interval = setInterval(() => {
			if (authContext.isLogged) {
				toast.current.show({ severity: "warn", summary: "Wylogowano", detail: "Przekroczony czas sesji, wylogowano!", life: 10000 });
				logoutUser();
			}
		}, EXPIRATION_TIME);

		return () => clearInterval(interval);
	}, [authContext, logoutUser]);

	console.log(authContext);

	return (
		<AuthContext.Provider value={authContext}>
			<Toast ref={toast} />
			{children}
		</AuthContext.Provider>
	);
};
