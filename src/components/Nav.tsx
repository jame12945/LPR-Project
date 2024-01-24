import React from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '../styles/styledElements'

function Navbar() {
  return (
    <>
      <div className=" bg-black flex justify-between">
        <Link
          to="/listview"
          className="text-2xl font-semibold text-white pb-8 ml-8 mt-6 cursor-pointer"
        >
          Gate Pass (License Plate Recognition)
        </Link>
        <ul className=" flex align-middle list-none h-auto mt-6">
          <li className=" flex pr-10">
            <Link
              to="/listview"
              className="flex align-middle text-lg font-semibold text-white cursor-pointer px-4 focus:text-blue focus:underline active:no-underline"
            >
              List View
            </Link>
            <Link
              to="/lpr"
              className="flex align-middle text-lg font-semibold text-white cursor-pointer px-4 focus:text-blue focus:underline active:no-underline "
            >
              LPR
            </Link>
          </li>
        </ul>
      </div>
      {/* <NavBar>test</NavBar> */}
    </>
  )
}

export default Navbar
