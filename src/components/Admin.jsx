import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs, doc , addDoc} from "firebase/firestore";  
import { db } from '../config/firestore';
import List from './List';
import EventDetailsAdmin from './EventDetailsAdmin';

const Admin = ({citiesRef, areasRef, sportsRef, sportsEventsRef}) => {

	const [sports, setSports] = useState([]);
	const [cities, setCities] = useState([]);
	const [areas, setAreas] = useState([]);
	const [events, setEvents] = useState([])
	const [addCity, setAddCity] = useState(false);
	const [addArea, setAddArea] = useState(false);
	const [addSport, setAddSport] = useState(false);
	const [cityName, setCityName] = useState("");
	const [areaName, setAreaName] = useState("");
	const [sportName, setSportName] = useState("");
	const [selectedCity, setSelectedCity] = useState("");

	const findCityId = (city) => {
        for(let i = 0; i < cities.length; i++) {
            if(cities[i].name == city) return cities[i].id
        }
    }

	async function getCities() {
		const querySnapshot = await getDocs(citiesRef);
		let tempArray = []
		querySnapshot.forEach(doc => {
			let data = {
				id: doc.id,
				name: doc.data().name
			}
			tempArray.push(data);
		})
		// console.log(tempArray)
		setCities(tempArray);
	}
	async function getAreas() {
		const querySnapshot = await getDocs(areasRef);
		let tempArray = []
		querySnapshot.forEach(doc => {
			let data = {
				id: doc.id,
				data: doc.data()
			}
			tempArray.push(data);
		})
		// console.log(tempArray)
		setAreas(tempArray);
	}
	async function getSports() {
		const querySnapshot = await getDocs(sportsRef);
		let tempArray = []
		querySnapshot.forEach(doc => {
			let data = {
				id: doc.id,
				name: doc.data().name
			}
			tempArray.push(data);
		})
		// console.log(tempArray);
		setSports(tempArray);
	}

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
		getSports();
        getCities();
        getAreas();
		getData();
		// console.log(areas);
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

	const handleAddCity = async (e) => {
		e.preventDefault();
		const docRef = await addDoc(citiesRef, {"name": cityName});
		setCityName("");
		getCities();
		setAddCity(false);
	}

	const handleAddArea = async (e) => {
		e.preventDefault();
		const docRef = await addDoc(areasRef, {
			"area": areaName,
			"cityName": selectedCity,
			"city": doc(db, "areas", findCityId(selectedCity))
		});
		setAreaName("");
		setSelectedCity("");
		getAreas();
		setAddArea(false);
	}

	const handleAddSport = async (e) => {
		e.preventDefault();
		const docRef = await addDoc(sportsRef, {"name": sportName});
		getSports();
		setSportName("");
		setAddSport(false);
	}

	return (
		<>
		<div className="flex justify-between p-4">
			<div className="text-2xl">Admin</div>
			<div onClick={handleLogOut} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/6 sm:w-1/6 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log Out</div>
		</div>
		<div className="p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<div className="flex justify-between">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Cities available</h5>
				<div onClick={() => setAddCity(true)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
					Add City
				</div>
			</div>
			<ul className="text-left text-gray-500 list-disc list-inside dark:text-gray-400">
				{cities.map((el, i) => {
					return (
						<li key={i}>
							<div className="flex justify-between">
								<div>{el.name}</div>
								<div onClick={() => {
									setAddArea(true);
									setSelectedCity(el.name)
								}} className="inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
									Add area
								</div>
							</div>
						</li>
					)
				})}
			</ul>
		</div>
		{addCity && 
		<>
		<form className='max-w-sm mx-auto'>
			<div className="mb-5">
				<label htmlFor="cityName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City Name</label>
				<input value={cityName} onChange={(e) => setCityName(e.target.value)} type="text" name="cityName" id="cityName" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
			</div>
			<button type="submit" onClick={(e) => handleAddCity(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
		</form>
		</>}
		{addArea && 
		<>
		<form className='max-w-sm mx-auto'>
			<div className="mb-5">
				<label htmlFor="areaName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Area Name</label>
				<input value={areaName} onChange={(e) => setAreaName(e.target.value)} type="text" name="areaName" id="areaName" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
			</div>
			<button type="submit" onClick={(e) => handleAddArea(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
		</form>
		</>}
		<div className="p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<div className="flex justify-between">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sports available</h5>
				<div onClick={() => setAddSport(true)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
					Add Sports
				</div>
			</div>
			<ul className="text-left text-gray-500 list-disc list-inside dark:text-gray-400">
				{sports.map((el, i) => {
					return <li key={i}>{el.name}</li>
				})}
			</ul>
		</div>
		{addSport && 
		<>
		<form className='max-w-sm mx-auto'>
			<div className="mb-5">
				<label htmlFor="sportName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sport name</label>
				<input value={sportName} onChange={(e) => setSportName(e.target.value)} type="text" name="sportName" id="sportName" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
			</div>
			<button type="submit" onClick={(e) => handleAddSport(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
		</form>
		</>}
		<div className="p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<div className="flex justify-between">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Areas available</h5>
			</div>
			<ul className="text-left text-gray-500 list-disc list-inside dark:text-gray-400">
				{areas.map((el, i) => {
					return <li key={i}>{el.data.area}, {el.data.cityName}</li>
				})}
			</ul>
		</div>
		<h1 className='text-3xl font-bold'>All Events</h1>
		{events.map((data, i) => {
				return (
				<EventDetailsAdmin fullData={data} key={data.id} setEvents={setEvents} />
				)
			})}
		</>
	);
};

export default Admin;