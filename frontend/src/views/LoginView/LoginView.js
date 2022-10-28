import React, { useContext, useState } from "react";
import { AuthContext } from "../../App";
import "./LoginView.css";

const LoginView = () => {
	const authContext = useContext(AuthContext);
	const [password, setPassword] = useState("");

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			authContext.loginUser(password);
			setPassword("");
		}
	};

	return (
		<div className='login-view'>
			<p>
				<b>HASŁO</b>
			</p>
			<input type='password' value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={handleKeyDown} />
		</div>
	);
};

export default LoginView;
