import React, { useEffect, useState } from "react";
import "./HorseView.css";
import { API_URL } from "../../constants";
import { PersonalCard } from "../../components";

const HorseView = () => {
	const [horseList, setHorseList] = useState([]);

	useEffect(() => {
		fetch(API_URL + "horse")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setHorseList(response);
			});
	}, []);

	console.log(horseList);

	return (
		<div className='HorseView'>
			{horseList.map((item, index) => (
				<PersonalCard key={index} title={item.name} images={item.images}>
					{item.description}
				</PersonalCard>
			))}
		</div>
	);
};

export default HorseView;
