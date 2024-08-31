import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs, getDoc } from "firebase/firestore";  
import List from './List';
import EventDetails from './EventDetails';
import { useNavigate } from 'react-router-dom';

const User = ({sportsEventsRef, userId, setIsAdmin, setUserId, setIsLoggedIn}) => {
	let navigate = useNavigate();
	const [events, setEvents] = useState([]);

	useEffect(() => {
		async function getData() {
			const querySnapshot = await getDocs(sportsEventsRef);
			let tempArray = []
			querySnapshot.forEach(doc => {
				let data = {id: doc.id,
					data: doc.data()
				}
				tempArray.push(data);
			})
			setEvents(tempArray);
		}
		getData();
	}, []);

	const handleLogOut = () => {
		Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Log me out"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Success",
                    text: "You have successfully logged out",
                    icon: "success",
					willClose: () => {
						setIsLoggedIn(false);
						setIsAdmin(false);
						setUserId(null);
						navigate('/login', {replace: true})
					}
                })
            }
          });
	}

	return (
		<>
		<div className="flex justify-end p-4">
			<div onClick={handleLogOut} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/6 sm:w-1/6 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log Out</div>
		</div>
		<div className="txt-3xl">
			Hey there,
			<div className="flex justify-center p-4">
				<div onClick={() => navigate('/add', {replace: true})} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/6 sm:w-1/6 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Event</div>
			</div>
		</div>
		{events.map((data, i) => {
			return (
			<EventDetails fullData={data} key={i} userId={userId} setEvents={setEvents} />
			)
		})}
		</>
	);
};

export default User;