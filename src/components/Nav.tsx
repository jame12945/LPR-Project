import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '../styles/styledElements'
import { FaTimes } from 'react-icons/fa'

function Navbar() {
  const [displayText, setDisplayText] = useState('Gate Pass')

  return (
    <>
      <div className="bg-black flex justify-between">
        <Link
          to="/listview"
          className="text-2xl font-semibold text-white pb-8 ml-8 mt-6 cursor-pointer"
        >
          {displayText}
        </Link>
        <ul className="flex align-middle list-none h-auto mt-6">
          <li className="flex pr-10">
            <Link
              to="/listview"
              onClick={() => setDisplayText('Gate Pass')}
              className="flex align-middle text-lg font-semibold text-white cursor-pointer px-4 focus:text-blue focus:underline active:no-underline"
            >
              List View
            </Link>
            <Link
              to="/lpr"
              onClick={() =>
                setDisplayText('Gate Pass (License Plate Recognition)')
              }
              className="flex align-middle text-lg font-semibold text-white cursor-pointer px-4 focus:text-blue focus:underline active:no-underline "
            >
              LPR
            </Link>
            <Link
              to="/"
              onClick={() => setDisplayText('Gate Pass ')}
              className="text-white ml-10 text-3xl  active:text-blue"
            >
              <FaTimes />
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Navbar
