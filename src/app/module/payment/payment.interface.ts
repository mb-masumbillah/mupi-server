export type TPayment = {
  roll: string;
  amount: string;
  txnId: string;
  number: string;
  semester: string;
  repeats?: {
    semester?: string;
    subject: string[];
  }[];
  image?: string;
  status?: string;
};
