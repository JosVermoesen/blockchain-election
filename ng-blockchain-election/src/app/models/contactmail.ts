export interface IContactmail {
  subject: string;
  name: string;
  rr: string;
  email: string; //
  phone?: string;
  copySender: boolean;
  message?: string;
  template?: string;
  data?: string;
  apiGuid: string;
  apiMailKey: string;
  apiNameKey: string;
}
