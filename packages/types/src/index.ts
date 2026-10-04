export type Locale = 'en' | 'fa' | 'zh';
export type Direction = 'ltr' | 'rtl';
export type Theme = 'system' | 'light' | 'dark' | 'red' | 'blue';
export type PropertyType = 'APARTMENT' | 'VILLA' | 'OFFICE' | 'SHOP' | 'WAREHOUSE' | 'LAND' | 'PROJECT';
export type ListingType = 'BUY' | 'RENT' | 'COMMERCIAL' | 'LAND' | 'NEW_PROJECT';
export type PropertyStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'RESERVED' | 'SOLD' | 'RENTED' | 'OFF_MARKET' | 'ARCHIVED';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VIEWING_SCHEDULED' | 'NEGOTIATING' | 'WON' | 'LOST' | 'ARCHIVED';
export type AppointmentStatus = 'REQUESTED' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
export type WorkingDay = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface ApiError { code: string; message: string; requestId?: string; field?: string; }
export interface ApiResponse<T> { data: T; meta?: { page?: number; pageSize?: number; total?: number; cursor?: string | null; }; }
export interface WorkingHours { day: WorkingDay; open: boolean; start: string; end: string; slotMinutes: number; }
export interface SearchFilters {
  listingType?: ListingType;
  propertyType?: PropertyType;
  cityId?: string;
  neighborhoodId?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
  q?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'area_desc' | 'featured' | 'popular';
  cursor?: string;
  limit?: number;
}
export interface PropertyCard {
  id: string;
  slug: string;
  title: string;
  city: string;
  neighborhood?: string;
  price: number;
  currency: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  featured: boolean;
  imageUrl?: string;
  lat?: number;
  lng?: number;
}
export interface PropertyDetail extends PropertyCard {
  description: string;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  parking?: number;
  furnishing?: string;
  amenities: string[];
  tags: string[];
  priceHistory: { price: number; date: string }[];
  media: { id: string; kind: 'IMAGE' | 'VIDEO' | 'PANORAMA' | 'MODEL_3D'; url: string; alt?: string; caption?: string }[];
}
export interface Lead { id: string; name: string; email: string; phone?: string; status: LeadStatus; priority: 'LOW' | 'MEDIUM' | 'HIGH'; budget?: number; propertyId?: string; agentId?: string; nextFollowUp?: string; score: number; }
export interface Appointment { id: string; propertyId: string; agentId?: string; clientName: string; start: string; end: string; status: AppointmentStatus; notes?: string; }
export interface MarketMetric { label: string; value: number; delta?: number; suffix?: string; }
export interface NotificationItem { id: string; title: string; body: string; readAt?: string; createdAt: string; type: string; }
