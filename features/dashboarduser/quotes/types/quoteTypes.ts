export type QuoteBody = {
  originCity: string;
  destinationCity: string;
  weight: number;
  height: number;
  width: number;
  length: number;
};

export type Quote = {
  id: number;
  originCity: string;
  destinationCity: string;
  totalPrice: number;
  createdAt: string;
};

export interface QuoteResponse {
  message: string;
  quotes: Quote[];
}

export type QuoteResponseCreate = {
  message: string;
  quote: {
    originCity: string;
    destinationCity: string;
    packageDetails: {
      actualWeight: number;
      volumeWeight: number;
      selectedWeight: number;
      dimensions: {
        height: number;
        width: number;
        length: number;
      };
    };
    price: number;
    currency: string;
  };
};
