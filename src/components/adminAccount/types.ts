export interface Consumer {
  id: string;
  applicantName: string;
  cellphoneNo: string;
  currentAddress: string;
  barangay: string;
  installationAddress: string;
  serviceConnectionType: string;
  serviceConnectionSize: string;
  email: string;
  buildingOwnerName: string;
  buildingOwnerAddress: string;
  buildingOwnerCellphone: string;
  installationFee: number;
  meterDeposit: number;
  guarantyDeposit: number;
  totalAmountDue: number;
  paidUnderOR: number;
  serviceConnectionNo: number;
  customerAccountNo: number;
  waterMeterSerialNo: string;
  waterMeterBrand: string;
  waterMeterSize: string;
  initialReading: string;
  createdAt: string;
  role: string;
  status: string;
}

export interface FormData {
  applicantName: string;
  cellphoneNo: string;
  currentAddress: string;
  barangay: string;
  installationAddress: string;
  serviceConnectionType: string;
  serviceConnectionSize: string;
  buildingOwnerName: string;
  buildingOwnerAddress: string;
  buildingOwnerCellphone: string;
  installationFee: number;
  meterDeposit: number;
  guarantyDeposit: number;
  totalAmountDue: number;
  paidUnderOR: number;
  serviceConnectionNo: number;
  customerAccountNo: number;
  waterMeterSerialNo: string;
  waterMeterBrand: string;
  waterMeterSize: string;
  initialReading: number;
  email: string;
  createdAt: string;
  role: string;
  status: string;
  rate: number;
}
