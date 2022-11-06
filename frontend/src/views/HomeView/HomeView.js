import React, { useContext, useEffect, useState } from "react";
import "./HomeView.css";
import { API_URL, checkResponseOk } from "../../constants";
import { TextBlock } from "../../layouts";
import { AuthContext, TextEditorContext } from "../../contextProviders";
import { Button } from "primereact/button";

const HomeView = () => {
	const [textBlockList, setTextBlockList] = useState([]);
	const authContext = useContext(AuthContext);
	const openTextEditor = useContext(TextEditorContext);

	useEffect(() => {
		fetchTextBlockList();
	}, []);

	const fetchTextBlockList = () => {
		fetch(API_URL + "textBlock")
			.then((response) => checkResponseOk(response))
			.then((response) => {
				setTextBlockList(response);
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
			});
	};

	const addNewTextBlock = (description) => {
		fetch(API_URL + `textBlock`, {
			method: "POST",
			headers: { ...authContext.getAuthHeader(), "Content-Type": "application/json" },
			body: JSON.stringify({ description: description, image: null }),
		})
			.then((response) => checkResponseOk(response))
			.then(() => {
				fetchTextBlockList();
				authContext.showDataUpdateSuccess("Zmiany zostałe zapisane");
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
				authContext.showDataUpdateError(`Błąd serwera: "${err}", zmiany nie zostały zapisane`);
			});
	};

	const createNewBlock = () => {
		openTextEditor("Nowy blok", "Nowy_tekst", addNewTextBlock);
	};

	return (
		<div className='home-view'>
			{textBlockList.map((item, index) => (
				<TextBlock key={index} index={index} id={item.id} image={item.image} description={item.description} updateParentCallback={fetchTextBlockList} />
			))}
			{authContext.isLogged ? (
				<div className='new-block'>
					<Button className='add-block-btn p-button-sm p-button-secondary' onClick={createNewBlock} label='Dodaj nowy blok'></Button>
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default HomeView;
