export interface Users {
  id: string;
  name: string;
  address: string;
  cellphoneNo: string;
  position: string;
  email: string;
  password: string;
  role: string;
  updatedAt: string;
  profilePicUrl: string;
  scanner: boolean;
}

export interface UsersEdit {
  id: string;
  name: string;
  address: string;
  cellphoneNo: string;
  position: string;
  email: string;
  password: string;
  role: string;
  updatedAt: string;
  profilePicUrl: string;
}

export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Users | null;
  onUpdate: () => void;
}
