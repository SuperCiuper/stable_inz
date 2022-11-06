import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ColorContext, TextEditorContext } from "../../contextProviders";
import "./PriceListView.css";
import { API_URL, checkResponseOk } from "../../constants";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const PriceListView = () => {
	const authContext = useContext(AuthContext);
	const { colorContext } = useContext(ColorContext);
	const openTextEditor = useContext(TextEditorContext);
	const [priceList, setPriceList] = useState([]);
	const toast = useRef(null);

	const fetchPriceList = () => {
		fetch(API_URL + "priceList")
			.then((response) => checkResponseOk(response))
			.then((response) => {
				setPriceList(response);
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
			});
	};

	useEffect(() => {
		fetchPriceList();
	}, []);

	const handleFetch = (method, body) => {
		authContext.performDataUpdate("price", method, body, fetchPriceList);
	};

	const saveName = (item, newName = "") => {
		handleFetch("PATCH", { ...item, name: newName });
	};

	const editName = (item) => {
		openTextEditor(`Nowa nazwa ${item.name}`, item.name, (name) => saveName(item, name));
	};

	const savePrice = (item, newPrice = "") => {
		handleFetch("PATCH", { ...item, price: newPrice });
	};

	const editPrice = (item) => {
		openTextEditor(`Nowa cena ${item.name}`, item.price, (price) => savePrice(item, price));
	};

	const deletePrice = (item) => {
		handleFetch("DELETE", { id: item.id });
	};

	const addNewPriceError = (message) => {
		toast.current.show({ severity: "error", summary: "Błąd", detail: message, life: 6000 });
	};

	const setNewPricePrice = (newPrice, price) => {
		if (price === null || price === "" || price === undefined) {
			addNewPriceError("Nie dodano opisu");
			return;
		}
		handleFetch("POST", { ...newPrice, price: price });
	};

	const setNewPriceName = (name) => {
		if (name === null || name === "" || name === undefined) {
			addNewPriceError("Nowy przedmiot nie został dodany");
			return;
		}
		openTextEditor(`Cena ${name}`, "", (price) => setNewPricePrice({ name: name }, price), true);
	};

	const createNewPrice = () => {
		openTextEditor("Nazwa nowego przedmiotu", "", setNewPriceName, true);
	};

	return (
		<div className='priceList-view'>
			<table style={{ borderColor: `#${colorContext.detailRGB}` }}>
				<thead style={{ backgroundColor: `#${colorContext.mainRGB}` }}>
					<tr>
						<th style={{ borderColor: `#${colorContext.detailRGB}` }}>Usługa</th>
						<th style={{ borderColor: `#${colorContext.detailRGB}` }}>Cena</th>
						{authContext.isLogged ? <th style={{ borderColor: `#${colorContext.detailRGB}` }}>Usuń</th> : ""}
					</tr>
				</thead>
				<tbody style={{ backgroundColor: `#${colorContext.backgroundRGB}` }}>
					{priceList.map((item, index) => (
						<tr key={index}>
							<td
								onClick={authContext.isLogged ? () => editName(item) : () => {}}
								style={{ borderColor: `#${colorContext.detailRGB}`, cursor: authContext.isLogged ? "pointer" : "inherit" }}
							>
								{item.name}
							</td>
							<td
								onClick={authContext.isLogged ? () => editPrice(item) : () => {}}
								style={{ borderColor: `#${colorContext.detailRGB}`, cursor: authContext.isLogged ? "pointer" : "inherit" }}
							>
								{item.price}
							</td>
							{authContext.isLogged ? (
								<td className='delete-tab' style={{ borderColor: `#${colorContext.detailRGB}` }}>
									<Button className='delete-price-btn p-button-sm p-button-danger' icon='pi pi-trash' onClick={() => deletePrice(item)} />
								</td>
							) : (
								""
							)}
						</tr>
					))}
					{authContext.isLogged ? (
						<tr>
							<td className='new-price' colSpan='3'>
								<Toast ref={toast} />
								<Button className='add-price-btn p-button-sm p-button-secondary' onClick={createNewPrice} label='Dodaj nowy przedmiot'></Button>
							</td>
						</tr>
					) : (
						""
					)}
				</tbody>
			</table>
		</div>
	);
};

export default PriceListView;
