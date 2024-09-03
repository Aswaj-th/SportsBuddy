import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs, getDoc, doc, updateDoc, limit} from "firebase/firestore";
import { db } from '../config/firestore';  
import List from './List';
import EventDetails from './EventDetails';
import { useNavigate } from 'react-router-dom';
import AddEventForm from './AddEventForm';

const User = ({sportsEventsRef, usersRef, userId, setIsAdmin, setUserId, setIsLoggedIn, areasRef, citiesRef, sportsRef}) => {
	let navigate = useNavigate();
	const [events, setEvents] = useState([]);
	const [showAdd, setShowAdd] = useState(false);
	const [defInputs, setDefInputs] = useState({
		sportName: "Badminton",
		sport: doc(db, "sportNames", "3rOAr9np4AJAHfyMAjOf"),
		cityName: "Mumbai",
		city: doc(db, "cities", "V5mm6N2mH6PYWBslfV2H"),
		areaName: "Navi Mumbai",
		area: doc(db, "areas", "F33RAzJQYJBasngVKJKU"),
		desc: "",
		time: "",
		location: "",
		createdBy: doc(db, "users", userId.id),
		createdByName: userId.email,
		number: 0
	})
	const [showPreferences, setShowPreferences] = useState(false);
	const [preferedSports, setPreferedSports] = useState([]);
	const [sportName, setSportName] = useState("");
	const [sports, setSports] = useState([]);

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
			// console.log(tempArray);
			// console.log(preferedSports);
			let newTempArray = tempArray.filter((el) => {
				return preferedSports.includes(el.data.sportName)
			})
			setEvents(newTempArray);
			if(sports.length > 0) setSportName(sports[0].name)
		}
		getData();
	}, [showAdd, preferedSports]);

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

	const handleAddPreference = async (e) => {
		e.preventDefault();
		if(sportName === "") return	
		let tempArray = preferedSports;
		tempArray.push(sportName);
		const currentUserRef = doc(db, "users", userId.id);

		try {
			await updateDoc(currentUserRef, {
				preferences: tempArray
			});
			Swal.fire({
				timer: 500,
				showConfirmButton: false,
				willOpen: () => {
					Swal.showLoading();
				},
				willClose: () => {

					Swal.fire({
						icon: 'success',
						title: 'Successfully Updated Preference!',
						showConfirmButton: false,
						timer: 1500,
					});
				},
			});
			setShowPreferences(false);
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
						text: 'Error Updating Preference',
						showConfirmButton: true,
					});
				},
			});
		}
	}

	useEffect(() => {
		async function getSports() {
			let querySnapshot = await getDocs(sportsRef);
			let allSportsArray = []
			querySnapshot.forEach(doc => {
				let data = {
                    id: doc.id,
                    name: doc.data().name
                }
				allSportsArray.push(data);
			})
			const docRef = doc(db, "users", userId.id)
			const docSnap = await getDoc(docRef);
			let preferedSportsArray = docSnap.data().preferences;
			// console.log(allSportsArray)
            let optionsArray;
			if(preferedSportsArray) {
				optionsArray = allSportsArray.filter((el) => {
					// console.log(el.name)
					if(preferedSportsArray.includes(el.name)) return false;
					else return true;
				})
			} else optionsArray = allSportsArray;
			// console.log(preferedSportsArray);
			// console.log(allSportsArray)
			// console.log(optionsArray);
			setPreferedSports(preferedSportsArray);
			setSports(optionsArray);
		}
		getSports();
	}, [showPreferences])

	const UserData = () => {
		return (
			<>
			<div className="flex justify-end p-4">
				<div onClick={handleLogOut} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/6 sm:w-1/6 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log Out</div>
			</div>
			<div className="txt-3xl">
				Hey there,
				<div className="flex justify-center p-4">
					<div onClick={() => setShowAdd(true)} className="flex items-center justify-center mx-3 cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/6 sm:w-1/6 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Event</div>
					<div onClick={() => setShowPreferences((el) => !el)} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/6 sm:w-1/6 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Preferences</div>
				</div>
			</div>
			{showPreferences &&
				<div className="mb-5">
					<div className="text-xl">Sports Selected:</div>
					<ul className="font-center align-center text-sm space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400 mt-3 mb-6">
						{preferedSports && preferedSports.length > 0 ? 
							preferedSports.map((el, i) => <li key={i}>{el}</li>)
							:
							"You have not selected any sport"
						}
					</ul>
					<label htmlFor="sportName" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Add Sport: </label>
					{sports.length > 0 ? 
						<>
						<select name="sportName" id="sportName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={sportName} onChange={(e) => setSportName(e.target.value)}>
							{sports.map((el, i) => {
								return (<option key={i}>{el.name}</option>)
							})}
						</select>
						<div className="flex justify-between my-2">
							<button onClick={(e) => handleAddPreference(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
							<button onClick={() => {
								setShowPreferences(false);
								setSportName("");
							}} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">close</button>
						</div>
						</> : "You have selected all available sports"
					}
				</div>
			}
			{events.map((data, i) => {
				return (
				<EventDetails setDefInputs={setDefInputs} setShowAdd={setShowAdd} fullData={data} key={data.id} userId={userId} setEvents={setEvents} />
				)
			})}
			</>
		);
	}

	return (
		<>
		{!showAdd ? <UserData /> : <AddEventForm defInputs={defInputs} setShowAdd={setShowAdd} sportsEventsRef={sportsEventsRef} sportsRef={sportsRef} citiesRef={citiesRef} areasRef={areasRef} userId={userId}/>}
		</>
	);
};

export default User;