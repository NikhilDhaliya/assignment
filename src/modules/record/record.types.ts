export interface RecordResponse {
  id: string;
  amount: number;
  type: string;
  category: string;
  date: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
}
