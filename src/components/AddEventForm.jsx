import { useState, useEffect } from 'react';
import {db} from '../config/firestore'
import { query, where, doc, getDocs, collection, addDoc} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const AddEventForm = ({setShowAdd, sportsEventsRef, sportsRef, citiesRef, areasRef, userId, defInputs}
) => {

    let navigate = useNavigate();
    const [sports, setSports] = useState([]);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [inputs, setInputs] = useState(defInputs);

    const findSportId = (sport) => {
        for(let i = 0; i < sports.length; i++) {
            if(sports[i].name == sport) return sports[i].id
        }
    }

    const findCityId = (city) => {
        for(let i = 0; i < cities.length; i++) {
            if(cities[i].name == city) return cities[i].id
        }
    }

    const findAreaId = (area) => {
        for(let i = 0; i < areas.length; i++) {
            if(areas[i].area == area) return areas[i].id
        }
    }

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      if(name == "sportName") {
        setInputs(values => ({...values, [name]:value, ["sport"]: doc(db, "sportNames", findSportId(value))}))
        return;
      }
      if(name == "cityName") {
        setInputs(values => ({...values, [name]:value, ["city"]: doc(db, 'cities', findCityId(value))}))
        return;
      } 
      if(name == "areaName") {
        setInputs(values => ({...values, [name]:value, ["area"]: doc(db, 'areas' + findAreaId(value))}))
        return;
      }
      setInputs(values => ({...values, [name]: value}))
    }
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(inputs);
        const docRef = await addDoc(sportsEventsRef, inputs);
        setInputs(defInputs)
        setShowAdd(false);
    }

    async function getAreas() {
        if(!inputs.city) return;    
        const checkCity = query(areasRef, where("cityName", "==", inputs.cityName));
		const querySnapshot = await getDocs(checkCity);
        let tempArray = []
        querySnapshot.forEach(doc => {
            let data = {
                id: doc.id,
                area: doc.data().area
            }
            // console.log(data);
            tempArray.push(data);
        })
        // console.log(tempArray);
        setAreas(tempArray);
    }

    useEffect(() => {
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
		getSports();
        getCities();
        getAreas();
	}, []);

    useEffect(() => {
        getAreas();
    }, [inputs.cityName, cities, setCities])

    return (
        <>
        <form className="max-w-sm mx-auto">
        <div className="mb-5">
            <label htmlFor="sportName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sport Name</label>
            <select name="sportName" id="sportName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={inputs.sportName} onChange={(e) => handleChange(e)}>
                {sports.map((el, i) => {
                    return <option key={i}>{el.name}</option>
                })}
            </select>
            </div>
        <div className="mb-5">
            <label htmlFor="cityName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
            <select value={inputs.cityName} onChange={(e) => handleChange(e)} name="cityName" id="cityName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {cities.map((el, i) => {
                    return <option key={i}>{el.name}</option>
                })}
            </select>
            </div>
        <div className="mb-5">
            <label htmlFor="areaName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select area in the city</label>
            <select value={inputs.areaName} onChange={(e) => handleChange(e)} name="areaName" id="areaName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {areas.map((el, i) => {
                    return <option key={i}>{el.area
                    }</option>
                })}
            </select>
        </div>
        <div className="mb-5">
            <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Description</label>
            <textarea value={inputs.desc} onChange={(e) => handleChange(e)} required name="desc" id="desc" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
        </div>
        <div className="mb-5">
            <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time details</label>
            <textarea value={inputs.time} onChange={(e) => handleChange(e)} required name="time" id="time" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
        </div>
        <div className="mb-5">
            <label htmlFor="number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
            <input value={inputs.number} onChange={(e) => handleChange(e)} type="number" name="number" id="number" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
        </div>
        <div className="mb-5">
            <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location Specifications</label>
            <input value={inputs.location} onChange={(e) => handleChange(e)} type="text" name="location" id="location" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
        </div>
        <button type="submit" onClick={(e) => handleSubmit(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
        </>
    );
};

export default AddEventForm;