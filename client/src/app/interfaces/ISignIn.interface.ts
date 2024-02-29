export interface ISignIn {
  email: string;
  password: string;
  riderInfo: {
    _id: string;
    email: string;
    password: string;
  };
}
