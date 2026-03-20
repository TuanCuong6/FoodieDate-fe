export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Couple {
  id: string;
  user1: User;
  user2: User;
  createdAt: string;
}

export interface Area {
  id: string;
  name: string;
  order: number;
}

export type RestaurantStatus = 'want_to_eat' | 'eaten' | 'dislike' | 'considering';

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone?: string;
  area: Area;
  status: RestaurantStatus;
  images: string[];
  notes?: string;
  source?: string;
  sourceUrl?: string;
  tags: string[];
  rating?: number;
  priceRange?: string;
  createdAt: string;
  visitedAt?: string;
}

export interface Plan {
  id: string;
  restaurant: Restaurant;
  date: string;
  time: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdBy: User;
}

export interface Review {
  id: string;
  restaurant: Restaurant;
  visitDate: string;
  rating: number;
  dishes: string[];
  totalCost?: number;
  notes: string;
  images: string[];
}
