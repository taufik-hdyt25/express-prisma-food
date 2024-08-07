export interface IUser {
  id: number;
  createdAt: Date;
  deviceName: string;
  model: string;
}

export interface ICreateUser {
  deviceName: string;
  model: string;
}
