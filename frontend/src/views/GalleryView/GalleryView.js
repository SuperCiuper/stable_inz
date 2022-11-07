import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, ImageSelectorContext } from "../../contextProviders";
import "./GalleryView.css";
import { API_URL, DUMMY_IMAGE, checkResponseOk } from "../../constants";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";

const GalleryView = () => {
	// TODO check what happens with more photos
	const authContext = useContext(AuthContext);
	const { openImageSelector, fetchImages } = useContext(ImageSelectorContext);
	const [imageList, setImageList] = useState([]);
	const fileUpload = useRef(null);

	const fetchImageList = () => {
		fetch(API_URL + "image")
			.then((response) => checkResponseOk(response))
			.then((response) => {
				/* shuffle images to get different gallery every time */
				for (let i = response.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[response[i], response[j]] = [response[j], response[i]];
				}

				setImageList(response);
			})
			.catch((err) => {
				console.error(`Server response: ${err}`);
			});
	};

	useEffect(() => {
		fetchImageList();
	}, []);

	const fetchUpdatedImages = () => {
		fetchImages();
		fetchImageList();
	};

	const uploadImages = async ({ files }) => {
		console.log(files);

		const formData = new FormData();
		for (const image of files) {
			formData.append("images", image);
		}

		authContext.performDataUpdate("image", "POST", formData, fetchUpdatedImages);
		console.log(fileUpload);
		fileUpload.current.clear();
		console.log("xd");
	};

	const saveImages = (images) => {
		authContext.performDataUpdate("image", "DELETE", images, fetchUpdatedImages);
	};

	const deleteImages = () => {
		openImageSelector(`Wybierz zdjęcia, które chcesz usunąć`, [], saveImages);
	};

	return (
		<div className='gallery-view'>
			{authContext.isLogged ? (
				<div className='button-bar'>
					<FileUpload
						className='btn'
						ref={fileUpload}
						mode='basic'
						accept='image/*'
						maxFileSize={1000000}
						multiple
						chooseOptions={{ className: "btn p-button-sm p-button-success", label: "Dodaj zdjęcia", icon: "pi pi-images" }}
						auto
						customUpload
						uploadHandler={uploadImages}
						onUpload={() => {
							console.log("after");
						}}
					/>
					<Button className='btn p-button-sm p-button-danger' onClick={deleteImages} icon='pi pi-trash' label='Usuń zdjęcia'></Button>
				</div>
			) : (
				""
			)}
			{imageList.map((item, index) => (
				<div className='image-container' key={index}>
					{/* eslint-disable-next-line */}
					<Image
						className='image-item'
						src={`${API_URL}image/${item}`}
						onError={(e) => (e.target.src = `${API_URL}image/${DUMMY_IMAGE}`)}
						alt={`Image ${item} not found`}
						preview
					/>
				</div>
			))}
			<div className='image-container'></div>
		</div>
	);
};

export default GalleryView;
