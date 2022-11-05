import React, { useContext, useEffect, useRef, useState } from "react";
import "./HorseView.css";
import { API_URL, checkResponseOk } from "../../constants";
import { PersonalCard } from "../../components";
import { AuthContext, ImageSelectorContext, TextEditorContext } from "../../contextProviders";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const HorseView = () => {
	const authContext = useContext(AuthContext);
	const { openImageSelector } = useContext(ImageSelectorContext);
	const openTextEditor = useContext(TextEditorContext);
	const [horseList, setHorseList] = useState([]);
	const toast = useRef(null);

	useEffect(() => {
		fetchHorseList();
	}, []);

	const fetchHorseList = () => {
		fetch(API_URL + "horse")
			.then((response) => checkResponseOk(response))
			.then((response) => {
				setHorseList(response);
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
			});
	};

	const addingNewHorseError = (message) => {
		toast.current.show({ severity: "error", summary: "Błąd", detail: message, life: 6000 });
	};

	const addNewHorse = (newHorse, newImages) => {
		let image = newImages.length === 0 ? null : newImages[0];

		if (image === null || image === "" || image === undefined) {
			addingNewHorseError("Profilowe nie zostało wybrane");
			return;
		}

		fetch(API_URL + "horse", {
			method: "POST",
			headers: { ...authContext.getAuthHeader(), "Content-Type": "application/json" },
			body: JSON.stringify({ name: newHorse.name, description: newHorse.description, image: image }),
		})
			.then((response) => checkResponseOk(response))
			.then(() => {
				fetchHorseList();
				authContext.showDataUpdateSuccess("Zmiany zostałe zapisane");
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
				authContext.showDataUpdateError(`Błąd serwera: "${err}", zmiany nie zostały zapisane`);
			});
	};

	const setNewHorseDescription = (newHorse, description) => {
		if (description === null || description === "" || description === undefined) {
			addingNewHorseError("Nie dodano opisu");
			return;
		}
		openImageSelector(`Wybierz profilowe konia ${newHorse.name}`, [], (images) => addNewHorse({ ...newHorse, description: description }, images), true);
	};

	const setNewHorseName = (name) => {
		if (name === null || name === "" || name === undefined || name === "Imię") {
			addingNewHorseError("Imię nie zostało wybrane");
			return;
		}
		openTextEditor(undefined, `Opis ${name}`, "Opis", (description) => setNewHorseDescription({ name: name }, description));
	};

	const createNewHorseName = () => {
		openTextEditor(undefined, "Imię nowego konia", "Imię", setNewHorseName);
	};

	return (
		<div className='horse-view'>
			{horseList.map((item, index) => (
				<PersonalCard
					key={index}
					name={item.name}
					images={item.images}
					description={item.description}
					index={index} //TODO: check if key can be used
					personType='horse'
					updateParentCallback={fetchHorseList}
				/>
			))}
			{authContext.isLogged ? (
				<>
					<Toast ref={toast} />
					<div className='new-horse'>
						<Button className='add-horse-btn p-button-sm p-button-secondary' onClick={createNewHorseName} label='Dodaj nowego konia'></Button>
					</div>
				</>
			) : (
				""
			)}
		</div>
	);
};

export default HorseView;
