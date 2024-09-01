import { useState } from 'react';
import Swal from 'sweetalert2';
import { doc, deleteDoc } from "firebase/firestore";
import {db} from '../config/firestore'



const EventDetails = ({fullData, userId, setEvents, setShowAdd, setDefInputs}) => {
    let data = fullData.data;

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteDoc(doc(db, "sportEvents", fullData.id));
                setEvents(events => events.filter((el) => el.id !== fullData.id))
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
          });
    }

    const handleUpdate = () => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I need to update it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setDefInputs(data);
                deleteDoc(doc(db, "sportEvents", fullData.id));
                setEvents(events => events.filter((el) => el.id !== fullData.id))
                setShowAdd(true);
            }
          });
    }

    return (
        <>
        <div className="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
            <h5 className="mb-6 mx-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white self-start">{data.sportName}</h5>
            <div className="mx-4 flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className='text-lg text-gray-700'>{data.areaName}</div>
                    <div className='text-2xl'>{data.cityName}</div>
                </div>
                <div className="flex flex-col">
                    <div>Handled by: {data.createdByName}</div>
                    <div>Contact: {data.number}</div>
                </div>
            </div>
            <p className="mt-6 mb-2 mx-4 ml-8 text-lg tracking-tight text-gray-600 text-left dark:text-white">{data.desc}</p>
            <p className="mb-3 font-normal text-left mx-4 text-gray-700 dark:text-gray-400">{data.location}</p>
            <p className="mb-3 font-normal text-left mx-4 text-gray-700 dark:text-gray-400">{data.time}</p>
            {userId.email === data.createdByName && 
                <div className="flex justify-between mt-6">
                    <div onClick={handleDelete} className="inline-flex items-center px-3 py-2 mx-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Delete
                    </div>
                    <div onClick={handleUpdate} className="inline-flex items-center px-3 py-2 mx-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Update
                    </div>
                </div>
            }
        </div>
        </>
    );
};

export default EventDetails;