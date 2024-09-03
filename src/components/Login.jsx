import { useState } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = ({usersRef, setIsAdmin, setIsLoggedIn, setUserId}) => {

	let navigate = useNavigate();

	const redirect = (data) => {
		if(data.data.hasOwnProperty("isAdmin") && data.data.isAdmin) {
			// console.log("heuy")
			setIsLoggedIn(true);
			setIsAdmin(true);
			setUserId({id: data.id, email: data.data.email});
			navigate('/admin', { replace: true });
		} else {
			setIsLoggedIn(true);
			setUserId({id: data.id, email:data.data.email});
			navigate('/user', { replace: true });
		}
	}

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async e => {
		e.preventDefault();

		const checkUser = query(usersRef, where("email", "==", email), where("password", "==", password));
		const querySnapshot = await getDocs(checkUser);

		if (querySnapshot.size === 1) {
			Swal.fire({
				timer: 1500,
				showConfirmButton: false,
				willOpen: () => {
					Swal.showLoading();
				},
				willClose: () => {

					Swal.fire({
						icon: 'success',
						title: 'Successfully logged in!',
						showConfirmButton: false,
						timer: 500,
						willClose: () => {
							querySnapshot.forEach(doc => {
								const data = {
									id: doc.id,
									data: doc.data()
								}
								// console.log(data);
								return redirect(data);
							})
						}
					});
				},
			});
		} else {
			Swal.fire({
				timer: 1500,
				showConfirmButton: false,
				willOpen: () => {
					Swal.showLoading();
				},
				willClose: () => {
					Swal.fire({
						icon: 'error',
						title: 'Error!',
						text: 'Incorrect email or password.',
						showConfirmButton: true,
					});
				},
			});
		}
	};

	return (
		<>
		<div className="container">
			<form onSubmit={handleLogin} className="max-w-sm mx-auto">
				<h1 className='text-3xl p-6'>Login</h1>
				<div className="mb-5">
					<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
					<input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Enter your email' required />
				</div>
				<div className="mb-5">
					<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
					<input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='qwerty' required />
				</div>
				<div className="mb-5 flex justify-around">
					<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
					<div onClick={() => navigate('/signup', {replace: true})}className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Signup</div>
				</div>
			</form>
		</div>
		</>
);
};

export default Login;