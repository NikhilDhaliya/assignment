export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
