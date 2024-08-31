import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs, getDoc } from "firebase/firestore";  
import List from './List';
import EventDetails from './EventDetails';

const User = ({sportsEventsRef}) => {
	const [events, setEvents] = useState([]);

	useEffect(() => {
		// const getReference = (ref, prop) => {
		// 	let temp = getDoc(ref).then((res) => {
		// 		if(res.exists()) return res.prop;
		// 		else return null;
		// 	})
		// }
		// async function getReferences(data) {
		// 	let res = {}
		// 	res.area = await getDoc(data.area);
		// 	res.createdBy = await getDoc(data.createdBy);
		// 	res.sport = await getDoc(data.sport);
		// 	res.city = await getDoc(data.city);
		// 	res.area = res.area.data().area;
		// 	res.city = res.city.data().name;
		// 	res.createdBy = res.createdBy.data().email;
		// 	res.sport = res.sport.data().name;
		// 	// console.log(res)
		// 	return res;
		// }
		async function getData() {
			const querySnapshot = await getDocs(sportsEventsRef);
			let tempArray = []
			querySnapshot.forEach(doc => {
				let data = doc.data();
				tempArray.push(data);
			})
			setEvents(tempArray);
		}
		getData();
	}, []);

	return (
		<>
		<h1 className="txt-3xl">
			user Page
		</h1>
		{/* {console.log(events)} */}
		{events.map((data, i) => {
			return (
			<EventDetails data={data} key={i}/>
			)
		})}
		</>
	);
};

export default User;