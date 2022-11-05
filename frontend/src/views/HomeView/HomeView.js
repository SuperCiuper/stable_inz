import React, { useContext, useEffect, useState } from "react";
import "./HomeView.css";
import { API_URL, checkResponseOk } from "../../constants";
import { TextBlock } from "../../layouts";
import { AuthContext } from "../../contextProviders";
import { Button } from "primereact/button";
import { TextEditorModal } from "../../components";

const HomeView = () => {
	const [textBlockList, setTextBlockList] = useState([]);
	const [textEditorModalVisibility, setTextEditorModalVisibility] = useState(false);
	const authContext = useContext(AuthContext);

	const toggleTextEditorModal = () => {
		setTextEditorModalVisibility((prevState) => !prevState);
	};

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

	return (
		<div className='home-view'>
			{textBlockList.map((item, index) => (
				<TextBlock key={index} index={index} id={item.id} image={item.image} description={item.description} updateParentCallback={fetchTextBlockList} />
			))}
			{authContext.isLogged ? (
				<>
					<TextEditorModal
						visibilityToggle={toggleTextEditorModal}
						visible={textEditorModalVisibility}
						subtitle={`Nowy blok`}
						text='Nowy tekst'
						saveText={addNewTextBlock}
					></TextEditorModal>
					<div className='new-block'>
						<Button className='add-block-btn p-button-sm p-button-secondary' onClick={toggleTextEditorModal} label='Dodaj nowy blok'></Button>
					</div>
				</>
			) : (
				""
			)}
		</div>
	);
};

export default HomeView;
