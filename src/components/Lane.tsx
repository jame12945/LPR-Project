import React, { useEffect, useState } from 'react'
import {
  Input,
  Button,
  Table,
  Modal,
  NotificationArgsProps,
  notification,
  Form,
} from 'antd'
import { TfiAlignJustify } from 'react-icons/tfi'
import { FaPlusCircle } from 'react-icons/fa'
import axios from 'axios'

const url = `${import.meta.env.VITE_API_GATEWAY_URL}`

type NotificationPlacement = NotificationArgsProps['placement']
type LANE_DATA_TYPE = {
  dvgId: number
  ioBoxId: number
  ioId: number
  lane: number
  laneName: string
}
function Lane() {
  const [doorId, setDoorId] = useState<number>(0)
  const [lane, setLane] = useState<number>(0)
  const [dvgId, setDvgId] = useState<number>(0)
  const [ioId, setIoId] = useState<number>(0)
  const [ioboxId, setIoboxId] = useState<number>(0)
  const [deleteId, setDeleteId] = useState<number>(0)
  const [laneData, setLaneData] = useState<LANE_DATA_TYPE>()
  const [laneName, setLaneName] = useState('')
  const [setting, setSetting] = useState<boolean>(false)
  const [addLane, setAddLane] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)
  const [api, contextHolder] = notification.useNotification()
  const [refresh, setRefresh] = useState<boolean>(false)
  const [form] = Form.useForm()

  const fetchLane = async () => {
    try {
      const response = await axios.get(`${url}door-setting`, {})
      const lanes = response.data.data
      setLaneData(lanes)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchLane()
  }, [refresh])

  useEffect(() => {
    if (
      dvgId !== 0 &&
      ioboxId !== 0 &&
      ioId !== 0 &&
      lane !== 0 &&
      laneName !== ''
    ) {
      setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
  }, [dvgId, ioboxId, ioId, lane, laneName])

  const onFinish = (value: any) => {
    console.log(value)
  }

  const handleRefresh = () => {
    setRefresh(!refresh)
  }
  const onReset = () => {
    if (form) {
      form.resetFields()
      setDvgId(0)
      setIoboxId(0)
      setIoId(0)
      setLane(0)
      setLaneName('')
      setIsButtonDisabled(true)
      console.log('reset')
    }
  }

  const addNotification = (placement: NotificationPlacement) => {
    api.info({
      message: 'Add lane success',
      description: <div>กรุณาตรวจสอบเลนรถที่หน้าหลัก</div>,
      placement,
    })
  }

  const deleteNotification = (placement: NotificationPlacement) => {
    api.info({
      message: 'Delete lane success',
      description: <div>กรุณาตรวจสอบเลนรถที่หน้าหลัก</div>,
      placement,
    })
  }
  const updateNotification = (placement: NotificationPlacement) => {
    api.info({
      message: 'Update lane success',
      description: <div>กรุณาตรวจสอบเลนรถที่หน้าหลัก</div>,
      placement,
    })
  }

  const handleSetting = (
    id: number,
    dvgId: number,
    ioboxId: number,
    ioId: number,
    lane: number,
    laneName: string
  ) => {
    setSelectedRowId(id)
    setDvgId(dvgId)
    setIoboxId(ioboxId)
    setIoId(ioId)
    setLane(lane)
    setLaneName(laneName)
    setSetting(true)
    form.setFieldsValue({
      dvgId: dvgId,
      ioboxId: ioboxId,
      ioId: ioId,
      lane: lane,
      laneName: laneName,
    })
  }
  const handleCancelSetting = () => {
    setSetting(false)
  }

  const handleLaneAddition = () => {
    setAddLane(true)
    setDvgId(0)
    setIoboxId(0)
    setIoId(0)
    setLane(0)
    setLaneName('')
    setIsButtonDisabled(true)
  }

  const handleResetAddLane = () => {
    form.resetFields()
    setDvgId(0)
    setIoboxId(0)
    setIoId(0)
    setLane(0)
    setLaneName('')
    setIsButtonDisabled(true)
  }

  useEffect(() => {
    if (addLane) {
      handleResetAddLane()
    }
  }, [addLane])

  useEffect(() => {
    form.setFieldsValue({
      dvgId: dvgId === 0 ? '' : dvgId,
      ioboxId: ioboxId === 0 ? '' : ioboxId,
      ioId: ioId === 0 ? '' : ioId,
      lane: lane === 0 ? '' : lane,
      laneName: laneName === '' ? '' : laneName,
    })
  }, [dvgId, ioboxId, ioId, lane, laneName])

  const handleCancelAddLane = () => {
    setAddLane(false)
  }

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === 'laneName') {
      setLaneName(value)
    } else {
      const numericValue = parseInt(value, 10)
      if (!isNaN(numericValue) || value === '') {
        if (name === 'doorId') {
          setDoorId(isNaN(numericValue) ? 0 : numericValue)
        } else if (name === 'lane') {
          setLane(isNaN(numericValue) ? 0 : numericValue)
        } else if (name === 'dvgId') {
          setDvgId(isNaN(numericValue) ? 0 : numericValue)
        } else if (name === 'ioboxId') {
          setIoboxId(isNaN(numericValue) ? 0 : numericValue)
        } else if (name === 'ioId') {
          setIoId(isNaN(numericValue) ? 0 : numericValue)
        }
      }
    }
  }

  const onDelete = (e) => {
    setDeleteId(e.target.value)
  }

  const handleConfirm = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_GATEWAY_URL}door-setting/${selectedRowId}`,
        {
          dvgId: dvgId,
          ioboxId: ioboxId,
          ioId: ioId,
          lane: lane,
          laneName: laneName,
        }
      )
      console.log('Response:', response)
      updateNotification('top')
      setSetting(false)
      setDvgId(0)
      setIoId(0)
      setIoboxId(0)
      setLaneName('')
      setLane(0)
      handleRefresh()
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleConfirmLane = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_URL}door-setting`,
        {
          dvgId: dvgId,
          ioboxId: ioboxId,
          ioId: ioId,
          lane: lane,
          laneName: laneName,
        }
      )
      console.log('Response:', response)
      handleRefresh()
      addNotification('top')
      setAddLane(false)
      setIsButtonDisabled(true)
      setDvgId(0)
      setIoId(0)
      setIoboxId(0)
      setLaneName('')
      setLane(0)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleDelete = async () => {
    setSetting(false)
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_GATEWAY_URL}door-setting/${selectedRowId}`
      )
      console.log('Delete response:', response)
      setDeleteId(0)
      deleteNotification('top')
      handleRefresh()
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }

  const laneCol = [
    {
      title: <div className="text-center">Id</div>,
      dataIndex: 'id',
      render: (id: string) => <div className="text-center text-blue">{id}</div>,
    },
    {
      title: <div className="text-center">Dvg</div>,
      dataIndex: 'dvgId',
      render: (dvgId: string) => <div className="text-center">{dvgId}</div>,
    },
    {
      title: <div className="text-center">Inbox</div>,
      dataIndex: 'ioboxId',
      render: (ioboxId: string) => <div className="text-center">{ioboxId}</div>,
    },

    {
      title: <div className="text-center">Io</div>,
      dataIndex: 'ioId',
      render: (ioId: string) => <div className="text-center">{ioId}</div>,
    },
    {
      title: <div className="text-center">Lane</div>,
      dataIndex: 'lane',
      render: (lane: string) => <div className="text-center">{lane}</div>,
    },
    {
      title: <div className="text-center">Name</div>,
      dataIndex: 'laneName',
      render: (laneName: string) => (
        <div className="flex justify-center ">
          <div>{laneName}</div>
          <TfiAlignJustify
            className=" mt-1 ml-8 hover:text-blue cursor-pointer"
            onClick={handleSetting}
          />
        </div>
      ),
    },
  ]
  return (
    <>
      {contextHolder}
      <div className=" pl-40 pr-40 pt-4">
        <h1 className=" text-2xl flex justify-center text-white underline-offset-1 pb-2">
          Applicable Lanes
        </h1>
        <div
          className="flex items-end justify-end pb-4 text-white hover:text-sky cursor-pointer"
          onClick={handleLaneAddition}
        >
          <div className=" flex">
            <div>Add Lane</div>
            <FaPlusCircle className="mt-1 ml-2" />
          </div>
        </div>
        <Table
          columns={laneCol}
          dataSource={laneData}
          onRow={(record) => ({
            onClick: () =>
              handleSetting(
                record.id,
                record.dvgId,
                record.ioboxId,
                record.ioId,
                record.lane,
                record.laneName
              ),
          })}
        />
        <Modal
          title={<div className="text-center text-xl">Add Lane</div>}
          open={addLane}
          onCancel={handleCancelAddLane}
          footer={null}
        >
          <div className="flex items-center justify-center bg-skyLight rounded-md">
            {' '}
            <div className="grid grid-flow-row justify-stretch w-3/4 ">
              <div className="pl-0 pt-4">
                {' '}
                <div>
                  <Form
                    form={form}
                    name="config-lane"
                    onFinish={onFinish}
                    className=" w-400"
                  >
                    <Form.Item
                      name="dvgId"
                      label="DvgId"
                      rules={[{ required: true }]}
                    >
                      <Input
                        name="dvgId"
                        value={dvgId === 0 ? '' : dvgId}
                        allowClear
                        placeholder="dvgId like : 1,2,3"
                        onChange={onChange}
                      />
                    </Form.Item>

                    <Form.Item
                      name="ioboxId"
                      label="IoboxId"
                      rules={[{ required: true }]}
                    >
                      <Input
                        name="ioboxId"
                        placeholder="ioboxId like : 1,2,3"
                        allowClear
                        value={ioboxId === 0 ? '' : ioboxId}
                        onChange={onChange}
                      />
                    </Form.Item>

                    <Form.Item
                      name="ioId"
                      label="IoId"
                      rules={[{ required: true }]}
                    >
                      <Input
                        name="ioId"
                        placeholder="ioId like : 1,2,3"
                        allowClear
                        value={ioId === 0 ? '' : ioId}
                        onChange={onChange}
                      />
                    </Form.Item>
                    <Form.Item
                      name="lane"
                      label="Lane"
                      rules={[{ required: true }]}
                    >
                      <Input
                        name="lane"
                        placeholder="lane like : 1,2,3"
                        allowClear
                        value={lane === 0 ? '' : lane}
                        onChange={onChange}
                      />
                    </Form.Item>
                    <Form.Item
                      name="laneName"
                      label="LaneName"
                      rules={[{ required: true }]}
                    >
                      <Input
                        name="laneName"
                        placeholder="laneName like : Test"
                        allowClear
                        value={laneName === '' ? '' : laneName}
                        onChange={onChange}
                      />
                    </Form.Item>
                    <div className="flex gap-1 items-end justify-end">
                      <Form.Item>
                        <Button onClick={onReset}>Reset</Button>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          onClick={handleConfirmLane}
                          disabled={isButtonDisabled}
                        >
                          Confirm
                        </Button>
                      </Form.Item>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          title={<div className="text-center text-xl">Configure Lane</div>}
          open={setting}
          onCancel={handleCancelSetting}
          footer={null}
        >
          <div className="flex items-center justify-center bg-skyLight rounded-md">
            {' '}
            <div className="grid grid-flow-row justify-stretch w-3/4 ">
              <div className="pl-0 pt-4">
                {' '}
                <div>
                  <h2 className="text-red font-semibold pt-2 pb-2 pl-2">
                    Delete Lane
                  </h2>
                  <Input
                    placeholder="Input Id like : 1,2,3"
                    allowClear
                    value={selectedRowId === null ? '' : selectedRowId}
                    onChange={onDelete}
                    disabled={selectedRowId == selectedRowId}
                  />

                  <div className="pt-4 pl-2 pb-2 flex items-end justify-end">
                    <Button type="primary" onClick={handleDelete}>
                      Delete
                    </Button>
                  </div>
                </div>
                <h2 className="text-newGreen font-semibold pt-2 pb-2 pl-2">
                  Update Lane
                </h2>
                <div>
                  <Form
                    form={form}
                    name="config-lane"
                    onFinish={onFinish}
                    className=" w-400"
                    initialValues={{
                      dvgId: dvgId === 0 ? '' : dvgId,
                      ioboxId: ioboxId === 0 ? '' : ioboxId,
                      ioId: ioId === 0 ? '' : ioId,
                      lane: lane === 0 ? '' : lane,
                      laneName: laneName === '' ? '' : laneName,
                    }}
                  >
                    <Form.Item
                      name="dvgId"
                      label="DvgId"
                      rules={[{ required: true }]}
                    >
                      <Input
                        name="dvgId"
                        value={dvgId === 0 ? '' : dvgId}
                        allowClear
                        placeholder="dvgId like : 1,2,3"
                        onChange={onChange}
                      />
                    </Form.Item>

                    <Form.Item
                      name="ioboxId"
                      label="IoboxId"
                      rules={[{ required: true }]}
                    >
                      <Input
                        name="ioboxId"
                        placeholder="ioboxId like : 1,2,3"
                        allowClear
                        value={ioboxId === null ? '' : ioboxId}
                        onChange={onChange}
                      />
                    </Form.Item>

                    <Form.Item
                      name="ioId"
                      label="IoId"
                      rules={[{ required: true }]}
                    >
                      <Input
                        name="ioId"
                        placeholder="ioId like : 1,2,3"
                        allowClear
                        value={ioId === null ? '' : ioId}
                        onChange={onChange}
                      />
                    </Form.Item>
                    <Form.Item
                      name="lane"
                      label="Lane"
                      rules={[{ required: true }]}
                    >
                      <Input
                        name="lane"
                        placeholder="lane like : 1,2,3"
                        allowClear
                        value={lane === null ? '' : lane}
                        onChange={onChange}
                      />
                    </Form.Item>
                    <Form.Item
                      name="laneName"
                      label="LaneName"
                      rules={[{ required: true }]}
                    >
                      <Input
                        name="laneName"
                        placeholder="laneName like : Test"
                        allowClear
                        value={laneName === null ? '' : laneName}
                        onChange={onChange}
                      />
                    </Form.Item>
                    <div className="flex gap-1 justify-end items-end">
                      <Form.Item>
                        <Button onClick={onReset}>Reset</Button>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          onClick={handleConfirm}
                          disabled={isButtonDisabled}
                        >
                          Confirm
                        </Button>
                      </Form.Item>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}

export default Lane
