import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs } from "firebase/firestore";  

const SportsEventList = ({SportsEventList}) => {

  return (
    <>
        <h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Password requirements:</h2>
        <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
            {SportsList.map((el) => {
                return (
                    <li>el</li>
                )
            })}
        </ul>
    </>
  );
};

export default SportsEventList;