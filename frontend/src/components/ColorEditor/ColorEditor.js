import { useContext, useState } from "react";
import { AuthContext, ColorContext } from "../../contextProviders";
import "./ColorEditor.css";
import { ColorPicker } from "primereact/colorpicker";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Button } from "primereact/button";

const ColorEditor = () => {
	const { colorContext, setColorContext } = useContext(ColorContext);
	const authContext = useContext(AuthContext);
	const [editedColors, setEditedColors] = useState({ ...colorContext });

	const saveEditedColors = () => {
		authContext.performDataUpdate("colorInfo", "PATCH", editedColors, () => {
			setColorContext({ ...editedColors });
		});
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
			<Button onClick={confirmColorChange} icon='pi pi-check' label='Zapisz' className='p-button-sm p-button-secondary' />
		</div>
	);
};

export default ColorEditor;
