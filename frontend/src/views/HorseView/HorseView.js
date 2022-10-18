import React, { useEffect, useState } from "react";
import "./HorseView.css";
import { API_URL } from "../../constants";
import { BiographyBlock } from "../../layouts";

const HorseView = () => {
	const [textBlockList, setTextBlockList] = useState([]);

	useEffect(() => {
		fetch(API_URL + "textBlock")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setTextBlockList(response);
			});
	}, []);

	console.log(textBlockList);

	return (
		<div className='HorseView'>
			{textBlockList.map((item, index) => (
				<BiographyBlock key={index} index={index} image={item.image}>
					{item.description}
				</BiographyBlock>
			))}
		</div>
	);
};

export default HorseView;
