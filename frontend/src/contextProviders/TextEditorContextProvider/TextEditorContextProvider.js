import React, { createContext, useState } from "react";
import "./TextEditorModal.css";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

export const TextEditorContext = createContext({});

export const TextEditorContextProvider = ({ children }) => {
	const [title, setTitle] = useState("Edytor tekstu");
	const [text, setText] = useState("Nowy tekst");
	const [visibility, setVisibility] = useState(false);
	const [saveTextCallback, setSaveTextCallback] = useState(() => () => {});
	const [center, setCenter] = useState(false);

	const openTextEditor = (title = "Edytor tekstu", text = "Nowy_tekst", callback = () => {}, center = false) => {
		setTitle(title);
		setText(text);
		setVisibility(true);
		setSaveTextCallback(() => (text) => callback(text));
		setCenter(center);
	};

	const saveChanges = () => {
		setVisibility(false);
		saveTextCallback(text);
		// setTitle("Edytor tekstu");
		// setText("Nowy tekst");
		// setSaveTextCallback(() => () => {});
	};

	return (
		<TextEditorContext.Provider value={openTextEditor}>
			<div className='text-editor-modal' style={{ visibility: visibility ? "visible" : "hidden" }} onClick={() => setVisibility(false)}>
				<div className='modal-window' onClick={(event) => event.stopPropagation()}>
					<h2 className='title'>{title}</h2>
					<InputTextarea
						className='textarea'
						value={text}
						onChange={(e) => setText(e.target.value)}
						autoResize
						style={{ textAlign: center ? "center" : "left" }}
					/>
					<Button className='save-text-btn p-button-sm p-button-secondary' onClick={saveChanges} label='Zapisz'></Button>
				</div>
			</div>
			{children}
		</TextEditorContext.Provider>
	);
};
