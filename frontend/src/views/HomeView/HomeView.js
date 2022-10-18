import React, { useEffect, useState } from "react";
import "./HomeView.css";
import { API_URL } from "../../constants";
import { TextBlock } from "../../layouts";

const HomeView = () => {
	const [textBlockList, setTextBlockList] = useState([]);

	useEffect(() => {
		fetch(API_URL + "textBlock")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setTextBlockList(response);
			});
	}, []);

	return (
		<div className='HomeView'>
			{textBlockList.map((item, index) => (
				<TextBlock key={index} index={index} image={item.image}>
					{item.description}
				</TextBlock>
			))}
		</div>
	);
};

export default HomeView;
