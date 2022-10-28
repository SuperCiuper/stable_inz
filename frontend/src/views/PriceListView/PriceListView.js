import React, { useContext, useEffect, useState } from "react";
import { ColorContext } from "../../App";
import "./PriceListView.css";
import { API_URL } from "../../constants";

const PriceListView = () => {
	const [priceList, setPriceList] = useState([]);
	const { colorContext } = useContext(ColorContext);

	useEffect(() => {
		fetch(API_URL + "priceList")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setPriceList(response);
			});
	}, []);

	return (
		<div className='priceList-view'>
			<table style={{ borderColor: `#${colorContext.detailRGB}` }}>
				<thead style={{ backgroundColor: `#${colorContext.mainRGB}` }}>
					<tr>
						<th style={{ borderColor: `#${colorContext.detailRGB}` }}>Usługa</th>
						<th style={{ borderColor: `#${colorContext.detailRGB}` }}>Cena</th>
					</tr>
				</thead>
				<tbody style={{ backgroundColor: `#${colorContext.backgroundRGB}` }}>
					{priceList.map((item, index) => (
						<tr key={index}>
							<td style={{ borderColor: `#${colorContext.detailRGB}` }}>{item.item}</td>
							<td style={{ borderColor: `#${colorContext.detailRGB}` }}>{item.price}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default PriceListView;
