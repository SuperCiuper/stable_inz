import React, { useContext, useEffect, useRef, useState } from "react";
import "./HorseView.css";
import { API_URL, checkResponseOk } from "../../constants";
import { PersonalCard } from "../../components";
import { AuthContext } from "../../contextProviders";
import { Button } from "primereact/button";
import { ImageSelectorModal, TextEditorModal } from "../../components";
import { Toast } from "primereact/toast";

const HorseView = () => {
	const [horseList, setHorseList] = useState([]);
	const [imageSelectorModalVisibility, setImageSelectorModalVisibility] = useState(false);
	const [textEditorModalNameVisibility, setTextEditorModalNameVisibility] = useState(false);
	const [textEditorModalDescriptionVisibility, setTextEditorModalDescriptionVisibility] = useState(false);
	const [newHorse, setNewHorse] = useState({});
	const authContext = useContext(AuthContext);
	const toast = useRef(null);

	const toggleImageSelectorModal = () => {
		setImageSelectorModalVisibility((prevState) => !prevState);
	};

	const toggleTextEditorModalName = () => {
		setTextEditorModalNameVisibility((prevState) => !prevState);
	};

	const toggleTextEditorModalDescription = () => {
		setTextEditorModalDescriptionVisibility((prevState) => !prevState);
	};

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

	const setNewHorseName = (name) => {
		if (name === null || name === "" || name === undefined || name === "Imię") {
			addingNewHorseError("Imię nie zostało wybrane");
			return;
		}
		setNewHorse({ name: name });
		toggleTextEditorModalDescription();
	};

	const setNewHorseDescription = (description) => {
		if (description === null || description === "" || description === undefined) {
			addingNewHorseError("Nie dodano opisu");
			return;
		}
		setNewHorse((prevState) => {
			return { ...prevState, description: description };
		});
		toggleImageSelectorModal();
	};

	const addNewHorse = (newImages) => {
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
		setNewHorse({});
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
					<TextEditorModal
						visibilityToggle={toggleTextEditorModalName}
						visible={textEditorModalNameVisibility}
						subtitle={`Imię nowego konia`}
						text='Imię'
						saveText={setNewHorseName}
					></TextEditorModal>
					<TextEditorModal
						visibilityToggle={toggleTextEditorModalDescription}
						visible={textEditorModalDescriptionVisibility}
						subtitle={`Opis ${newHorse.name}`}
						text='Opis'
						saveText={setNewHorseDescription}
					></TextEditorModal>
					<ImageSelectorModal
						visibilityToggle={toggleImageSelectorModal}
						visible={imageSelectorModalVisibility}
						title={`Wybierz profilowe konia ${newHorse.name}`}
						images={[]}
						returnImageCallback={addNewHorse}
						singleImage={true}
					></ImageSelectorModal>
					<div className='new-horse'>
						<Button className='add-block-btn p-button-sm p-button-secondary' onClick={toggleTextEditorModalName} label='Dodaj nowego konia'></Button>
					</div>
				</>
			) : (
				""
			)}
		</div>
	);
};

export default HorseView;
