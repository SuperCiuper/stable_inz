import { useContext, useState } from "react";
import { AuthContext, ColorContext } from "../../App";
import "./ColorEditor.css";
import { ColorPicker } from "primereact/colorpicker";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Button } from "primereact/button";
import { API_URL } from "../../constants";

const ColorEditor = () => {
	const { colorContext, setColorContext } = useContext(ColorContext);
	const authContext = useContext(AuthContext);
	const [editedColors, setEditedColors] = useState({ ...colorContext });

	console.log(colorContext);
	console.log(editedColors);

	const saveEditedColors = () => {
		console.log(editedColors);

		fetch(API_URL + "colorInfo", {
			method: "PATCH",
			headers: { ...authContext.getAuthHeader(), "Content-Type": "application/json" },
			body: JSON.stringify(editedColors),
		})
			.then((response) => (response.ok ? response : Promise.reject("Response not ok")))
			.then(
				() => {
					console.log(editedColors);
					setColorContext({ ...editedColors });
					authContext.showDataUpdateSuccess("Kolory zostały zapisane");
					//forceUpdate();
				},
				(err) => {
					console.log(err);
					authContext.showDataUpdateError("Błąd serwera, zmiany nie zostały zapisane");
				}
			);
	};

	const confirmColorChange = (event) => {
		confirmPopup({
			target: event.currentTarget,
			message: "Zapisać kolory?",
			icon: "pi pi-exclamation-triangle",
			acceptLabel: "Tak",
			rejectLabel: "Nie",
			accept: saveEditedColors,
		});
	};

	return (
		<div className='color-editor' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			{Object.keys(editedColors).map((color, index) => (
				<div className='color-item' key={index}>
					<ColorPicker
						id={color}
						value={editedColors[color]}
						onChange={(event) =>
							setEditedColors((prevState) => {
								prevState[color] = event.value;
								return prevState;
							})
						}
					></ColorPicker>
					<div className='color-name'>{color}</div>
				</div>
			))}
			<ConfirmPopup />
			<Button onClick={confirmColorChange} icon='pi pi-check' label='Zapisz' className='p-button-sm p-button-secondary'></Button>
		</div>
	);
};

export default ColorEditor;
