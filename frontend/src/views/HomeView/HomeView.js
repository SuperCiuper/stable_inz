import React, { useContext, useEffect, useState } from "react";
import "./HomeView.css";
import { API_URL } from "../../constants";
import { TextBlock } from "../../layouts";
import { AuthContext } from "../../contextProviders";
import { Button } from "primereact/button";
import { TextEditorModal } from "../../components";

const HomeView = () => {
	const [textBlockList, setTextBlockList] = useState([]);
	const authContext = useContext(AuthContext);
	const [textEditorModalVisibility, setTextEditorModalVisibility] = useState(false);

	const toggleTextEditorModal = () => {
		setTextEditorModalVisibility((prevState) => !prevState);
	};

	useEffect(() => {
		fetchTextBlockList();
	}, []);

	const fetchTextBlockList = () => {
		fetch(API_URL + "textBlock")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setTextBlockList(response);
			});
	};

	const addNewTextBlock = (description) => {
		fetch(API_URL + `textBlock`, {
			method: "POST",
			headers: { ...authContext.getAuthHeader(), "Content-Type": "application/json" },
			body: JSON.stringify({ description: description, image: null }),
		})
			.then((response) => (response.ok ? response : Promise.reject("Response not ok")))
			.then(
				() => {
					fetchTextBlockList();
					authContext.showDataUpdateSuccess("Zmiany zostałe zapisane");
				},
				(err) => {
					console.log(err);
					authContext.showDataUpdateError("Błąd serwera, zmiany nie zostały zapisane");
				}
			);
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
