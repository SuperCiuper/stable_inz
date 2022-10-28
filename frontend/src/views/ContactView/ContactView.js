import React, { useContext, useEffect, useState } from "react";
import { ColorContext } from "../../App";
import "./ContactView.css";
import { API_URL, GMAP_API_KEY } from "../../constants";

const defaultContactInfo = {
	street: "Klepacka 21",
	zipCode: "15-698",
	city: "Biedastok",
	phoneNumber: 123456789,
	mail: "stajnia.malta@gmail.com",
	gmapLat: "53.053995",
	gmapLng: "23.095907",
};

const ContactView = () => {
	const [contactInfo, setContactInfo] = useState(defaultContactInfo);
	const { colorContext } = useContext(ColorContext);

	useEffect(() => {
		fetch(API_URL + "contactInfo")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setContactInfo(response);
			});

		console.log("X");
	}, []);

	console.log(contactInfo);
	console.log({ lat: parseFloat(contactInfo.gmapLat), lng: parseFloat(contactInfo.gmapLng) });
	return (
		<div className='contact-view'>
			<img
				className='google-map'
				style={{ borderColor: `#${colorContext.detailRGB}` }}
				src={`https://maps.googleapis.com/maps/api/staticmap?center=${parseFloat(contactInfo.gmapLat)},${parseFloat(
					contactInfo.gmapLng
				)}&zoom=12&size=640x640&markers=${parseFloat(contactInfo.gmapLat)},${parseFloat(contactInfo.gmapLng)}&key=${GMAP_API_KEY}`}
				alt='Google map'
			/>
			<div className='contact-info'>
				<p>
					<b>ADRES</b> <br />
					{contactInfo.street}
					<br />
					{contactInfo.zipCode} {contactInfo.city},
				</p>
				<p>
					<b>NUMER TELEFONU</b>
					<br />
					{contactInfo.phoneNumber}
				</p>
				<p>
					<b>MAIL</b>
					<br />
					{contactInfo.mail}
				</p>
			</div>
		</div>
	);
};

export default ContactView;
