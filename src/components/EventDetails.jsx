import { useState } from 'react';

const EventDetails = () => {

    
    return (
        <>
        <div className="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
            <h5 className="mb-6 mx-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white self-start">SportName</h5>
            <div className="mx-4 flex flex-row justify-between">
                <div className="flex flex-col">
                    <div className='text-lg text-gray-700'>area</div>
                    <div className='text-2xl'>city</div>
                </div>
                <div className="flex flex-col">
                    <div>Handled by: User</div>
                    <div>Contact: number</div>
                </div>
            </div>
            <p className="mt-6 mb-2 mx-4 ml-8 text-lg tracking-tight text-gray-600 text-left dark:text-white">Noteworthy technology acquisitions 2021</p>
            <p className="mb-3 font-normal text-left mx-4 text-gray-700 dark:text-gray-400">Location details: &emsp; in the garden. Text me for more details.</p>
            <div className="flex justify-between mt-6">
                <div class="inline-flex items-center px-3 py-2 mx-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Delete
                </div>
                <div class="inline-flex items-center px-3 py-2 mx-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Update
                </div>
            </div>
        </div>
        </>
    );
};

export default EventDetails;