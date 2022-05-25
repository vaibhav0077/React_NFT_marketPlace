import React from 'react';
import './Navbar.css'
import { NavLink } from "react-router-dom";
const Navbar = () => {
    return (
        <nav className='navbar-contains'>
            <ul><h1>MetaVerse MarketPlace</h1></ul>
            <ul className='nav'>
                <li>
                    <NavLink to="/sellDigitAsset" activeclassname="active">Sell Digital Asset</NavLink>
                </li>
                <li>
                    <NavLink to="/MyDigitalAsset" activeclassname="active">My digital Asset</NavLink>
                </li>
                <li>
                    <NavLink to="/Creatordashboard" activeclassname="active">Creator DashBoard</NavLink>
                </li>
                <li>
                    <NavLink to="/" activeclassname="active">Home</NavLink>
                </li>
            </ul>
        </nav>
    );
}
export default Navbar;