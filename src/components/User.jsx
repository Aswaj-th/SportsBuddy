import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs } from "firebase/firestore";  
import List from './List';

const User = () => {

    

  return (
    <>
    <h1 className="txt-3xl">
        user Page
    </h1>
    </>
  );
};

export default User;