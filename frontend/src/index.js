import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; // icons
import "primeflex/primeflex.css"; // flex
import App from "./App";
import { ContactView, HomeView, HorseView, OfferView, PriceListView } from "./views";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<App />}>
					<Route path='/horses' element={<HorseView />} />
					<Route path='/offer' element={<OfferView />} />
					<Route path='/prices' element={<PriceListView />} />
					<Route path='/contact' element={<ContactView />} />
					<Route index element={<HomeView />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
