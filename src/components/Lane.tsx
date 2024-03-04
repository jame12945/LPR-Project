import React, { useEffect, useState } from 'react'
import { Flex, Input, Typography, Button } from 'antd'
import { runes } from 'runes2'
import axios from 'axios'

function Lane() {
  const [doorId, setDoorId] = useState(0)
  //   const [controllerId, setControllerId] = useState(0)
  const [lane, setLane] = useState(0)
  const [dvgId, setDvgId] = useState(0)
  const [ioId, setIoId] = useState(0)
  const [ioboxId, setIoboxId] = useState(0)
  const [deleteId, setDeleteId] = useState(0)
  const [laneName, setLaneName] = useState('')
  const { TextArea } = Input

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === 'laneName') {
      setLaneName(value)
    } else {
      const numericValue = parseInt(value, 10)
      if (!isNaN(numericValue)) {
        if (name === 'doorId') {
          setDoorId(numericValue)
        } else if (name === 'lane') {
          setLane(numericValue)
        } else if (name === 'dvgId') {
          setDvgId(numericValue)
        } else if (name === 'ioboxId') {
          setIoboxId(numericValue)
        } else if (name === 'ioId') {
          setIoId(numericValue)
        }
      }
    }
  }

  const onDelete = (e) => {
    setDeleteId(e.target.value)
  }

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        'http://10.84.235.10:3000/door-setting',
        {
          dvgId: dvgId,
          //   ctrlId: controllerId,
          ioboxId: ioboxId,
          ioId: ioId,
          lane: lane,
          laneName: laneName,
        }
      )
      console.log('Response:', response)

      setDvgId(0)
      setIoId(0)
      setIoboxId(0)
      setLaneName('')
      //   setControllerId(0)
      setLane(0)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://10.84.235.10:3000/door-setting/${deleteId}`
      )
      console.log('Delete response:', response)
      setDeleteId(0)
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }
  return (
    <div className=" px-4 pt-4">
      <div className="grid grid-flow-row justify-stretch">
        <div className=" bg-newGray rounded-lg">
          <h2 className="text-newGreen font-semibold pt-2 pb-2 pl-2">
            DvgId (Add)
          </h2>
          <Input
            name="dvgId"
            value={dvgId === 0 ? '' : dvgId}
            placeholder="dvgId like : 1,2,3"
            allowClear
            onChange={onChange}
          />

          <h2 className="text-newGreen font-semibold pt-4 pb-2 pl-2">
            IoboxId (Add)
          </h2>

          <Input
            name="ioboxId"
            placeholder="ioboxId like : 1,2,3"
            allowClear
            value={ioboxId === 0 ? '' : ioboxId}
            onChange={onChange}
          />

          <h2 className="text-newGreen font-semibold pt-4 pb-2 pl-2">
            IoId (Add)
          </h2>

          <Input
            name="ioId"
            placeholder="ioId like : 1,2,3"
            allowClear
            value={ioId === 0 ? '' : ioId}
            onChange={onChange}
          />
          <h2 className="text-newGreen font-semibold pt-4 pb-2 pl-2">
            Lane (Add)
          </h2>

          <Input
            name="lane"
            placeholder="Lane like : 1,2,3"
            allowClear
            value={lane === 0 ? '' : lane}
            onChange={onChange}
          />

          <h2 className="text-newGreen font-semibold pt-4 pb-2 pl-2">
            Lane Name (Add)
          </h2>

          <Input
            name="laneName"
            placeholder="laneName like : Test"
            allowClear
            value={laneName === '' ? '' : laneName}
            onChange={onChange}
          />
          <div className="pt-4 pl-2 pb-2">
            <Button type="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
        <div className="pl-0 pt-4">
          {' '}
          <div className=" bg-newGray rounded-lg">
            <h2 className="text-red font-semibold pt-2 pb-2 pl-2">
              Door-ID (Delete)
            </h2>
            <Input
              placeholder="Door Id like : 1,2,3"
              allowClear
              value={deleteId === 0 ? '' : deleteId}
              onChange={onDelete}
            />

            <div className="pt-4 pl-2 pb-2">
              <Button type="primary" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lane
