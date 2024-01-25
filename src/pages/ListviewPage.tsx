import { ToastContainer } from 'react-toastify'
import TableDynamic from '../components/Table'

function ListviewPage() {
  return (
    <div className=" min-h-screen bg-ocenblue">
      <div className="   m-auto overflow-y-auto">
        <TableDynamic />
        {/* <ToastContainer /> */}
      </div>
    </div>
  )
}
export default ListviewPage
