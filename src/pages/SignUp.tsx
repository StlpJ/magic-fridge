import "../styles/SignUp.css";
import Logofrigo from "../assets/images/formateurs.png";

export default function SignUp() {
	return (
		<div className="signup-card">
			<p className="signup-error">Soon available</p>
			<img alt="formateurs" src={Logofrigo} className="signup-image" />
		</div>
	);
}
