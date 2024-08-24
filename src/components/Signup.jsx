import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs, addDoc } from "firebase/firestore";  
import { Navigate } from 'react-router-dom';

const SignUp = ({usersRef}) => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSignUp = async e => {
	e.preventDefault();

	const checkUser = query(usersRef, where("email", "==", email));
	const querySnapshot = await getDocs(checkUser);

	if (querySnapshot.size === 0) {
		const newUser = {
			email,
			password,
			isAdmin: false
		}

		try {
			await addDoc(usersRef, {
			...newUser
			})
			Swal.fire({
				timer: 500,
				showConfirmButton: false,
				willOpen: () => {
					Swal.showLoading();
				},
				willClose: () => {

					Swal.fire({
						icon: 'success',
						title: 'Successfully signed up!',
						showConfirmButton: false,
						timer: 1500,
					});
				},
			});
			return <Navigate to="/login" replace />
		} catch (error) {
			console.log(error)
			Swal.fire({
				timer: 500,
				showConfirmButton: false,
				willOpen: () => {
					Swal.showLoading();
				},
				willClose: () => {
					Swal.fire({
						icon: 'error',
						title: 'Error!',
						text: 'Error signing up',
						showConfirmButton: true,
					});
				},
			});
			}
		} else {
			Swal.fire({
				timer: 500,
				showConfirmButton: false,
				willOpen: () => {
					Swal.showLoading();
				},
				willClose: () => {
					Swal.fire({
						icon: 'error',
						title: 'Error!',
						text: 'User with this email already exists',
						showConfirmButton: true,
					});
				},
			});
		}
	};

	return (
		<>
		<div className="container">
			<form onSubmit={handleSignUp} className="max-w-sm mx-auto">
				<h1 className='text-3xl p-6'>Signup</h1>
				<div className="mb-5">
					<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
					<input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Enter your email' required />
				</div>
				<div className="mb-5">
					<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
					<input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='qwerty' required />
				</div>
				<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
			</form>
		</div>
		</>
	);
};

export default SignUp;