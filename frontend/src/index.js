import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; // icons
import "primeflex/primeflex.css"; // flex
import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import { ContactView, GalleryView, HomeView, HorseView, LoginView, OfferView, PriceListView } from "./views";
import { GlobalContextProvider } from "./contextProviders";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<GlobalContextProvider>
				<Routes>
					<Route path='/' element={<App />}>
						<Route path='/main' element={<HomeView />} />
						<Route path='/horses' element={<HorseView />} />
						<Route path='/offer' element={<OfferView />} />
						<Route path='/prices' element={<PriceListView />} />
						<Route path='/gallery' element={<GalleryView />} />
						<Route path='/contact' element={<ContactView />} />
						<Route path='/login' element={<LoginView />} />
						<Route path='/*' element={<Navigate replace to='/main' />} />
						<Route index element={<Navigate replace to='/main' />} />
					</Route>
				</Routes>
			</GlobalContextProvider>
		</BrowserRouter>
	</React.StrictMode>
);
