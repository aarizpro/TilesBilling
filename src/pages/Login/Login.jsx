import { useState,useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [shopName, setShopName] = useState("");
	const url1 ="https://tilesapi.onrender.com/"
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};
	const fetchData = async () => {
        try {
          const response = await axios.get(`${url1}api/profile/66db12a6c3e7636aba3cc685`);
          setShopName(response.data.shopName);
         
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Failed to fetch data');
        }
      };
      useEffect(() => {
        fetchData();
      }, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		try 
		{
			
			//const url = "http://localhost:3000/api/auth";
			const url ="https://tilesapi.onrender.com/api/auth"
			console.log(data);
			const { data: res } = await axios.post(url, data);
			
			localStorage.setItem("token", res.data);
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>{shopName}</h1>
						<h1>Login to Your Account</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sign In
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New Here ?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;