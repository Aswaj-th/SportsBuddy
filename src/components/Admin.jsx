import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { query, where, getDocs } from "firebase/firestore";  
import List from './List';

const Admin = () => {



  return (
    <>
    <h1 className="txt-3xl">
        Admin Page
    </h1>
    {/* <List heading="Sports" /> */}
    {/* <List heading="Cities" /> */}
    </>
  );
};

export default Admin;