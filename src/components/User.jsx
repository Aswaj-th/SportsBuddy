import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs } from "firebase/firestore";  
import List from './List';
import EventDetails from './EventDetails';

const User = ({sportsEventsRef}) => {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		async function getData() {
			const querySnapshot = await getDocs(sportsEventsRef);
			let tempArray = []
			querySnapshot.forEach(doc => {
				let data = doc.data();
				data.area = getDocs(data.area).forEach;
				data.city = getDocs(data.city);
				data.createdBy = getDocs
				tempArray.push(data);
				// console.log(data);
			})
			console.log(tempArray);
			setEvents(tempArray);
		}
		getData();
	}, []);

	return (
		<>
		<h1 className="txt-3xl">
			user Page
		</h1>
		<EventDetails />
		</>
	);
};

export default User;