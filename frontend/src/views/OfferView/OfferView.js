import React, { useContext, useEffect, useState } from "react";
import { ColorContext } from "../../App";
import "./OfferView.css";
import { API_URL } from "../../constants";
import { Accordion, AccordionTab } from "primereact/accordion";

const OfferView = () => {
	const [offerList, setOfferList] = useState([]);
	const colorContext = useContext(ColorContext);

	useEffect(() => {
		fetch(API_URL + "offer")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setOfferList(response);
			});
	}, []);

	return (
		<div className='offer-view'>
			<Accordion>
				{offerList.map((item) => (
					<AccordionTab
						header={item.item}
						headerStyle={{ borderColor: `#${colorContext.detailRGB}`, background: `#${colorContext.mainRGB}` }}
						contentStyle={{ borderColor: `#${colorContext.detailRGB}`, background: `#${colorContext.mainRGB}` }}
					>
						<p className='description'>{item.description}</p>
						<p>
							<b>Dla kogo: </b>
							{item.forWhom}
						</p>
						<p>
							<b>Proponowana cena: </b>
							{item.proposedPrice}
						</p>
					</AccordionTab>
				))}
			</Accordion>
		</div>
	);
};

export default OfferView;
