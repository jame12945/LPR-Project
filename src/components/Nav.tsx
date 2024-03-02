import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '../styles/styledElements'
import { FaTimes, FaCog } from 'react-icons/fa'

function Navbar() {
  const [displayText, setDisplayText] = useState(
    'Gate Pass (License Plate Recognition)'
  )

  return (
    <>
      <div className="bg-black flex justify-between">
        <Link
          to="/listview"
          className="text-2xl font-semibold text-white pb-8 ml-6 mt-6 cursor-pointer"
        >
          {displayText}
        </Link>
        <ul className="flex align-middle list-none h-auto mt-7">
          <li className="flex ">
            <Link
              to="/listview"
              onClick={() => setDisplayText('Gate Pass')}
              className="flex align-middle text-lg font-semibold text-white cursor-pointer ml-10 focus:text-blue focus:underline active:no-underline"
            >
              History View
            </Link>
            <Link
              to="/lpr"
              onClick={() =>
                setDisplayText('Gate Pass (License Plate Recognition)')
              }
              className="flex align-middle text-lg font-semibold text-white cursor-pointer ml-10 focus:text-blue focus:underline active:no-underline "
            >
              LPR
            </Link>
            <Link
              to="/setting"
              onClick={() => setDisplayText('LPR Configure Lane Set-Up')}
              className="flex align-middle text-lg font-semibold text-white cursor-pointer ml-10 pt-2"
            >
              <FaCog />
            </Link>

            <Link
              to="/"
              onClick={() =>
                setDisplayText('Gate Pass (License Plate Recognition)')
              }
              className="text-white ml-10 text-3xl  active:text-blue"
            />
          </li>
        </ul>
      </div>
    </>
  )
}

export default Navbar
