import React, { useEffect, useState } from "react";
import "./HomeView.css";
import { API_URL } from "../../constants";
import { TextBlock } from "../../layouts";

const HomeView = () => {
	const [textBlockList, setTextBlockList] = useState([]);
	console.log(textBlockList);

	useEffect(() => {
		fetch(API_URL + "textBlock")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setTextBlockList(response);
			});
	}, []);

	const updateTextBlock = (index, newTextBlock) => {
		console.log("XD");

		setTextBlockList((prevState) => {
			prevState[index] = newTextBlock;
			return [...prevState];
		});
	};

	return (
		<div className='home-view'>
			{textBlockList.map((item, index) => (
				<TextBlock key={index} index={index} id={item.id} image={item.image} description={item.description} updateParentCallback={updateTextBlock} />
			))}
		</div>
	);
};

export default HomeView;
