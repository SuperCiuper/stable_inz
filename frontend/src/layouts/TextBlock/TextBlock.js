import { useContext, useState } from "react";
import { ColorContext } from "../../contextProviders";
import "./TextBlock.css";
import { API_URL } from "../../constants";
import { AuthContext } from "../../contextProviders";
import { TextEditorModal } from "../../components";

const ImageBlock = ({ image }) => {
	return (
		<div className='ImageBlock'>
			{/* eslint-disable-next-line */}
			<img src={`${API_URL}image/${image}`} alt={`Image ${image} not found`}></img>
		</div>
	);
};

const TextBlock = ({ index, id, image, description, updateParentCallback }) => {
	const { colorContext } = useContext(ColorContext);
	const authContext = useContext(AuthContext);
	const [textEditorModalVisibility, setTextEditorModalVisibility] = useState(false);

	const toggleTextEditorModal = () => {
		setTextEditorModalVisibility((prevState) => !prevState);
	};

	const saveText = (newDescription = description, newImage = image) => {
		fetch(API_URL + `textBlock/${id}`, {
			method: "PATCH",
			headers: { ...authContext.getAuthHeader(), "Content-Type": "application/json" },
			body: JSON.stringify({ description: newDescription, image: newImage }),
		})
			.then((response) => (response.ok ? response : Promise.reject("Response not ok")))
			.then(
				() => {
					updateParentCallback(index, { id: id, description: newDescription, image: newImage });
					authContext.showDataUpdateSuccess("Zmiany zostałe zapisane");
				},
				(err) => {
					console.log(err);
					authContext.showDataUpdateError("Błąd serwera, zmiany nie zostały zapisane");
				}
			);
	};

	return (
		<div className='TextBlock' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			<TextEditorModal
				visibilityToggle={toggleTextEditorModal}
				visible={textEditorModalVisibility}
				subtitle={`Opis bloku ${index + 1}`}
				text={description}
				saveText={saveText}
			></TextEditorModal>
			{image && index % 2 === 1 ? <ImageBlock image={image} /> : ""}
			<p
				className='Description'
				onClick={() => (authContext.isLogged ? toggleTextEditorModal() : () => {})}
				style={{ cursor: authContext.isLogged ? "pointer" : "inherit" }}
			>
				{description}
			</p>
			{image && index % 2 === 0 ? <ImageBlock image={image} /> : ""}
		</div>
	);
};

export default TextBlock;
