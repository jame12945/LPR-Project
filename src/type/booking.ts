export interface BookingSocketData {
  bookingId: string
  licensePlate: string
  license_plate_number: string
  bookingDate: string
  bookingStart: string
  bookingEnd: string
  warehouseCode: string
  truckType: string
  companyCode: string
  supCode: string
  supName: string
  operationType: string
  driverName: string
  telNo: string
  arrivalTime: string
  status: string
  node_name: string
  lane: string
  plate_image: string
  full_image: string
  resultMessage: string
}
export interface ListData {
  full_image: string
  plate_image: string
  licensePlate: string
  booking: string
  bookingId: string
  status: string
  bookingDate: string
  bookingStart: string
  bookingEnd: string
  warehouseCode: string
  truckType: string
  companyCode: string
  supCode: string
  supName: string
  operationType: string
  driverName: string
  lane: string
  telNo: string
  node_name: string
  resultMessage: string
  id: number
}
