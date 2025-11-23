export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: string;
  price: number;
  image: string;
  seats: number;
  transmission: string;
  fuel: string;
  year: number;
  available: boolean;
}

export interface CartItem {
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  days: number;
}

export interface Booking {
  id: string;
  userId: string;
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}
