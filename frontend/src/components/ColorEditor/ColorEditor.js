import { useContext, useRef, useState } from "react";
import { AuthContext, ColorContext } from "../../contextProviders";
import "./ColorEditor.css";
import { ColorPicker } from "primereact/colorpicker";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const ColorEditor = () => {
	const authContext = useContext(AuthContext);
	const { colorContext, setColorContext } = useContext(ColorContext);
	const [editedColors, setEditedColors] = useState({ ...colorContext });
	const toast = useRef(null);

	const saveEditedColors = () => {
		const colorHexRegex = new RegExp("#[0-9a-f]{6}");
		for (const [color, value] of Object.entries(editedColors)) {
			if (!colorHexRegex.test(value)) {
				console.error();
				toast.current.show({
					severity: "error",
					summary: "Błąd",
					detail: `Wartość ${color}: ${value} jest nieprawidłowa (0-f, 6 znaków)`,
					life: 10000,
				});
				return;
			}
		}
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

	const changeColorInput = (newColor, color) => {
		newColor = newColor.toLowerCase();
		newColor = newColor.slice(0, 8);

		setEditedColors((prevState) => {
			prevState[color] = `#${newColor}`;
			return { ...prevState };
		});
	};

	return (
		<div className='color-editor' style={{ borderColor: colorContext.detail }}>
			<Toast ref={toast} />

			{Object.keys(editedColors).map((color, index) => (
				<div className='color-item' key={index}>
					<input className='hex-input' type='text' value={editedColors[color].slice(1, 7)} onChange={(event) => changeColorInput(event.target.value, color)} />
					<ColorPicker
						id={color}
						value={editedColors[color]}
						onChange={(event) =>
							setEditedColors((prevState) => {
								prevState[color] = `#${event.value}`;
								return { ...prevState };
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
