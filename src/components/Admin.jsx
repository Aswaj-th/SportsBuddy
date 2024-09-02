import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs, doc , addDoc, updateDoc} from "firebase/firestore";  
import { db } from '../config/firestore';
import EventDetailsAdmin from './EventDetailsAdmin';
import { useNavigate } from 'react-router-dom';

const Admin = ({citiesRef, areasRef, sportsRef, sportsEventsRef,setIsAdmin, setUserId, setIsLoggedIn}) => {

	let navigate = useNavigate();

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
	const [isUpdatingCity, setIsUpdatingCity] = useState(false);
	const [isUpdatingArea, setIsUpdatingArea] = useState(false);
	const [isUpdatingSport, setIsUpdatingSport] = useState(false);
	const [prevSportName, setPrevSportName] = useState("");
	const [prevCityName, setPrevCityName] = useState("");
	const [prevAreaName, setPrevAreaName] = useState("");

	const findCityId = (city) => {
        for(let i = 0; i < cities.length; i++) {
            if(cities[i].name == city) return cities[i].id
        }
    }

	const findSportId = (sport) => {
        for(let i = 0; i < sports.length; i++) {
            if(sports[i].name == sport) return sports[i].id
        }
    }

	const findAreaId = (area, city) => {
        for(let i = 0; i < areas.length; i++) {
			// console.log(areas[i].area)
            if(areas[i].data.area == area && areas[i].data.cityName == city) return areas[i].id
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
		if(isUpdatingCity) {
			const currentCityRef = doc(db, "cities", findCityId(prevCityName));
			try {
				await updateDoc(currentCityRef, {
					name: cityName
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
							title: 'Successfully Updated City!',
							showConfirmButton: false,
							timer: 1500,
						});
					},
				});
				getCities();
				setCityName("");
				setIsUpdatingCity(false);
				setPrevCityName("");
				setAddCity(false);
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
							text: 'Error Updating Sport',
							showConfirmButton: true,
						});
					},
				});
			}
			return;
		}
		const checkUser = query(citiesRef, where("name", "==", cityName));
		const querySnapshot = await getDocs(checkUser);
		if(querySnapshot.size === 0) {
			try {
				await addDoc(citiesRef, {"name": cityName})
				Swal.fire({
					timer: 500,
					showConfirmButton: false,
					willOpen: () => {
						Swal.showLoading();
					},
					willClose: () => {
	
						Swal.fire({
							icon: 'success',
							title: 'Successfully Added City!',
							showConfirmButton: false,
							timer: 1500,
						});
					},
				});
				getCities();
				setCityName("");
				setAddCity(false);
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
							text: 'Error Adding City',
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
						text: 'This City already exists',
						showConfirmButton: true,
					});
				},
			});
		}
	}

	const handleAddArea = async (e) => {
		e.preventDefault();
		if(isUpdatingArea) {
			const currentAreaRef = doc(db, "areas", findAreaId(prevAreaName, selectedCity));
			try {
				await updateDoc(currentAreaRef, {
					"area": areaName
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
							title: 'Successfully Updated Area!',
							showConfirmButton: false,
							timer: 1500,
						});
					},
				});
				getAreas();
				setAreaName("");
				setIsUpdatingArea(false);
				setPrevAreaName("");
				setSelectedCity("");
				setAddArea(false);
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
							text: 'Error Updating Area',
							showConfirmButton: true,
						});
					},
				});
			}
			return;
		}
		const checkUser = query(areasRef, where("area", "==", areaName), where("cityName", "==", selectedCity));
		const querySnapshot = await getDocs(checkUser);
		if(querySnapshot.size === 0) {
			try {
				await addDoc(areasRef, {
					"area": areaName,
					"cityName": selectedCity,
					"city": doc(db, "areas", findCityId(selectedCity))
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
							title: 'Successfully Added Area!',
							showConfirmButton: false,
							timer: 1500,
						});
					},
				});
				setAreaName("");
				setSelectedCity("");
				getAreas();
				setAddArea(false);
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
							text: 'Error Adding Area',
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
						text: 'This Area already exists',
						showConfirmButton: true,
					});
				},
			});
		}
	}

	const handleAddSport = async (e) => {
		e.preventDefault();
		if(isUpdatingSport) {
			const currentSportRef = doc(db, "sportNames", findSportId(prevSportName));
			try {
				await updateDoc(currentSportRef, {
					name: sportName
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
							title: 'Successfully Updated Sport!',
							showConfirmButton: false,
							timer: 1500,
						});
					},
				});
				getSports();
				setSportName("");
				setIsUpdatingSport(false);
				setPrevSportName("");
				setAddSport(false);
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
							text: 'Error Updating Sport',
							showConfirmButton: true,
						});
					},
				});
			}
			return;
		}
		const checkUser = query(sportsRef, where("name", "==", sportName));
		const querySnapshot = await getDocs(checkUser);
		if(querySnapshot.size === 0) {
			try {
				await addDoc(sportsRef, {"name": sportName})
				Swal.fire({
					timer: 500,
					showConfirmButton: false,
					willOpen: () => {
						Swal.showLoading();
					},
					willClose: () => {
	
						Swal.fire({
							icon: 'success',
							title: 'Successfully Added Sport!',
							showConfirmButton: false,
							timer: 1500,
						});
					},
				});
				getSports();
				setSportName("");
				setAddSport(false);
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
							text: 'Error Adding Sport',
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
						text: 'This Sport already exists',
						showConfirmButton: true,
					});
				},
			});
		}
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
				<div onClick={() => setAddCity(true)} className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
					Add City
				</div>
			</div>
			{cities.map((el, i) => {
				return (
					<div key={i} className="flex justify-between m-2">
						<div className='flex items-center'>
							<svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
							</svg>
							<div>{el.name}</div>
						</div>
						<div className="flex">
							<div onClick={() => {
								let errorChance = false;
								areas.forEach((area) => {
									if(area.data.cityName === el.name) errorChance = true;
								})
								if(errorChance === true) {
									Swal.fire({
										icon: 'error',
										title: 'Error!',
										text: 'Error Updating City as there are already areas within the city',
										showConfirmButton: true,
									});
									return;
								}
								setAddCity(true);
								setIsUpdatingCity(true);
								setPrevCityName(el.name);
								setCityName(el.name);
							}} className="cursor-pointer mx-2 inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
								Update City
							</div>
							<div onClick={() => {
								setAddArea(true);
								setSelectedCity(el.name)
							}} className="cursor-pointer inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
								Add area
							</div>
						</div>
					</div>
				)
			})}
		</div>
		{addCity && 
		<>
		<form className='max-w-sm mx-auto'>
			<div className="mb-5">
				<label htmlFor="cityName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City Name</label>
				<input value={cityName} onChange={(e) => setCityName(e.target.value)} type="text" name="cityName" id="cityName" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
			</div>
			<div className="flex justify-around">
				<button type="submit" onClick={(e) => handleAddCity(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
				<button onClick={() => {
					setAddCity(false);
					setCityName("");
				}} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">close</button>
			</div>
		</form>
		</>}
		{addArea && 
		<>
		<form className='max-w-sm mx-auto'>
			<div className="mb-5">
				<label htmlFor="areaName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Area Name</label>
				<input value={areaName} onChange={(e) => setAreaName(e.target.value)} type="text" name="areaName" id="areaName" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
			</div>
			<div className="flex justify-around">
				<button type="submit" onClick={(e) => handleAddArea(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
				<button onClick={() => {
					setAddArea(false);
					setSelectedCity("");
					setAreaName("");
					setIsUpdatingArea(false);
				}} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">close</button>
			</div>
			</form>
		</>}
		<div className="p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<div className="flex justify-between">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sports available</h5>
				<div onClick={() => setAddSport(true)} className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
					Add Sports
				</div>
			</div>
			<ul className="text-left text-gray-500 list-disc list-inside dark:text-gray-400">
				{sports.map((el, i) => {
					return 	(
						<div key={i} className="flex justify-between m-2">
						<div className='flex items-center'>
						<svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
							<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
						</svg>
						<div>{el.name}</div>
						</div>
						<div onClick={() => {
							setAddSport(true);
							setIsUpdatingSport(true);
							setPrevSportName(el.name);
							setSportName(el.name);
						}} className="cursor-pointer inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
							Update Sport
						</div>
						</div>
					)
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
			<div className="flex justify-around">
				<button type="submit" onClick={(e) => handleAddSport(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
				<button onClick={() => {
					setAddSport(false)
					setSportName("");
				}} className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">close</button>
			</div>
		</form>
		</>}
		<div className="p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<div className="flex justify-between">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Areas available</h5>
			</div>
			<ul className="text-left text-gray-500 list-disc list-inside dark:text-gray-400">
				{areas.map((el, i) => {
					return 	(
						<div key={i} className="flex justify-between m-2">
						<div className='flex items-center'>
						<svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
							<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
						</svg>
						<div>{el.data.area}, {el.data.cityName}</div>
						</div>
						<div onClick={() => {
							setAddArea(true);
							setIsUpdatingArea(true);
							setPrevAreaName(el.data.area);
							setAreaName(el.data.area);
							setSelectedCity(el.data.cityName);
						}} className="cursor-pointer inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
							Update Area
						</div>
						</div>
					)
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