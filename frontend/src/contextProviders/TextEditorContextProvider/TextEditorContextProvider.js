import React, { createContext, useState } from "react";
import "./TextEditorModal.css";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

export const TextEditorContext = createContext({});

export const TextEditorContextProvider = ({ children }) => {
	const [title, setTitle] = useState("Edytor tekstu");
	const [subtitle, setSubtitle] = useState("Podtytuł");
	const [text, setText] = useState("Nowy tekst");
	const [visibility, setVisibility] = useState(false);
	const [saveTextCallback, setSaveTextCallback] = useState(() => () => {});

	const openTextEditor = (title = "Edytor tekstu", subtitle = "Podtytuł", text = "Nowy_tekst", callback = () => {}) => {
		setTitle(title);
		setSubtitle(subtitle);
		setText(text);
		setVisibility(true);
		setSaveTextCallback(() => (text) => callback(text));
	};

	const saveChanges = () => {
		setVisibility(false);
		saveTextCallback(text);
		// setTitle("Edytor tekstu");
		// setSubtitle("Podtytuł");
		// setText("Nowy tekst");
		// setSaveTextCallback(() => () => {});
	};

	return (
		<TextEditorContext.Provider value={openTextEditor}>
			<div className='text-editor-modal' style={{ visibility: visibility ? "visible" : "hidden" }} onClick={() => setVisibility(false)}>
				<div className='modal-window' onClick={(event) => event.stopPropagation()}>
					<h1 className='title'>{title}</h1>
					<h2 className='subtitle'>{subtitle}</h2>
					<InputTextarea className='textarea' value={text} onChange={(e) => setText(e.target.value)} autoResize />
					<Button className='save-text-btn p-button-sm p-button-secondary' onClick={saveChanges} icon='pi pi-check' label='Zapisz'></Button>
				</div>
			</div>
			{children}
		</TextEditorContext.Provider>
	);
};
