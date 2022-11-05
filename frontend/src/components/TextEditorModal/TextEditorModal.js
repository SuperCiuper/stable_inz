import React, { useState } from "react";
import "./TextEditorModal.css";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

const TextEditorModal = ({ visibilityToggle, visible, subtitle = "subtitle", text = "", saveText = () => {} }) => {
	const [editedText, setEditedText] = useState(text);

	const saveChanges = () => {
		saveText(editedText);
		visibilityToggle();
	};

	return (
		<div className='text-editor-modal' style={{ visibility: visible ? "visible" : "hidden" }} onClick={visibilityToggle}>
			<div className='modal-window' onClick={(event) => event.stopPropagation()}>
				<h1 className='title'>Edytor tekstu</h1>
				<h2 className='subtitle'>{subtitle}</h2>
				<InputTextarea className='textarea' value={editedText} onChange={(e) => setEditedText(e.target.value)} autoResize />
				<Button className='save-text-btn p-button-sm p-button-secondary' onClick={saveChanges} icon='pi pi-check' label='Zapisz'></Button>
			</div>
		</div>
	);
};

export default TextEditorModal;
