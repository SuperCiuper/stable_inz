import { useContext, useState } from "react";
import { ColorContext } from "../../contextProviders";
import "./TextBlock.css";
import { API_URL } from "../../constants";
import { AuthContext } from "../../contextProviders";
import { ImageSelectorModal, TextEditorModal } from "../../components";
import { Button } from "primereact/button";

const ImageBlock = ({ image }) => {
	return (
		<div className='ImageBlock'>
			{/* eslint-disable-next-line */}
			<img src={`${API_URL}image/${image}`} alt={`Image ${image} not found`}></img>
		</div>
	);
};

const TextBlock = ({ index, id, image, description, updateParentCallback, children }) => {
	const { colorContext } = useContext(ColorContext);
	const authContext = useContext(AuthContext);
	const [textEditorModalVisibility, setTextEditorModalVisibility] = useState(false);
	const [imageSelectorModalVisibility, setImageSelectorModalVisibility] = useState(false);

	const toggleTextEditorModal = () => {
		setTextEditorModalVisibility((prevState) => !prevState);
	};

	const toggleImageSelectorModal = () => {
		setImageSelectorModalVisibility((prevState) => !prevState);
	};

	const saveText = (newDescription = description) => {
		fetch(API_URL + `textBlock/${id}`, {
			method: "PATCH",
			headers: { ...authContext.getAuthHeader(), "Content-Type": "application/json" },
			body: JSON.stringify({ description: newDescription, image: image }),
		})
			.then((response) => (response.ok ? response : Promise.reject("Response not ok")))
			.then(
				() => {
					updateParentCallback();
					authContext.showDataUpdateSuccess("Zmiany zostałe zapisane");
				},
				(err) => {
					console.log(err);
					authContext.showDataUpdateError("Błąd serwera, zmiany nie zostały zapisane");
				}
			);
	};

	const saveImage = (newImage = image) => {
		fetch(API_URL + `textBlock/${id}`, {
			method: "PATCH",
			headers: { ...authContext.getAuthHeader(), "Content-Type": "application/json" },
			body: JSON.stringify({ description: description, image: newImage }),
		})
			.then((response) => (response.ok ? response : Promise.reject("Response not ok")))
			.then(
				() => {
					updateParentCallback();
					authContext.showDataUpdateSuccess("Zmiany zostałe zapisane");
				},
				(err) => {
					console.log(err);
					authContext.showDataUpdateError("Błąd serwera, zmiany nie zostały zapisane");
				}
			);
	};

	const deleteBlock = () => {
		console.log("click");
		fetch(API_URL + `textBlock/${id}`, {
			method: "DELETE",
			headers: { ...authContext.getAuthHeader() },
		})
			.then((response) => (response.ok ? response : Promise.reject("Response not ok")))
			.then(
				() => {
					updateParentCallback();
					authContext.showDataUpdateSuccess("Zmiany zostałe zapisane");
				},
				(err) => {
					console.log(err);
					authContext.showDataUpdateError("Błąd serwera, zmiany nie zostały zapisane");
				}
			);
	};

	return (
		<div className='text-block' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			{authContext.isLogged ? (
				<>
					<TextEditorModal
						visibilityToggle={toggleTextEditorModal}
						visible={textEditorModalVisibility}
						subtitle={`Opis bloku ${index + 1}`}
						text={description}
						saveText={saveText}
					></TextEditorModal>
					<ImageSelectorModal
						visibilityToggle={toggleImageSelectorModal}
						visible={imageSelectorModalVisibility}
						title={`Wybierz obrazek dla ${index + 1}. bloku `}
						image={image}
						returnImageCallback={saveImage}
					></ImageSelectorModal>
				</>
			) : (
				""
			)}

			{image && index % 2 === 1 ? <ImageBlock image={image} /> : ""}
			<div className='content'>
				<p
					className='description'
					onClick={authContext.isLogged ? toggleTextEditorModal : () => {}}
					style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
				>
					{description}
				</p>
				{authContext.isLogged ? (
					<div className='button-bar'>
						<Button
							className='edit-image-btn p-button-sm p-button-warning'
							onClick={toggleImageSelectorModal}
							icon='pi pi-images'
							label='Ustaw zdjęcie'
						></Button>
						<Button className='edit-image-btn p-button-sm p-button-danger' onClick={deleteBlock} icon='pi pi-trash' label='Usuń blok'></Button>
					</div>
				) : (
					""
				)}
			</div>
			{image && index % 2 === 0 ? <ImageBlock image={image} /> : ""}
		</div>
	);
};

export default TextBlock;
