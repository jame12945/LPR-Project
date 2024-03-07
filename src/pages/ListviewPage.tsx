import React from 'react'
import ListComponent from '../components/ListTable'

function ListviewPage() {
  return (
    <div className="min-h-screen bg-ocenblue">
      <div className="m-auto overflow-y-auto">
        <ListComponent />
      </div>
    </div>
  )
}

export default ListviewPage
