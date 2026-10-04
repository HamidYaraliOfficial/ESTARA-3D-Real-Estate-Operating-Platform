import { z } from 'zod';
export const localeSchema = z.enum(['en','fa','zh']);
export const searchSchema = z.object({
  q: z.string().trim().max(200).optional(),
  listingType: z.enum(['BUY','RENT','COMMERCIAL','LAND','NEW_PROJECT']).optional(),
  propertyType: z.enum(['APARTMENT','VILLA','OFFICE','SHOP','WAREHOUSE','LAND','PROJECT']).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  maxArea: z.coerce.number().nonnegative().optional(),
  bedrooms: z.coerce.number().int().min(0).max(50).optional(),
  bathrooms: z.coerce.number().int().min(0).max(50).optional(),
  cityId: z.string().uuid().optional(),
  neighborhoodId: z.string().uuid().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radiusMeters: z.coerce.number().int().min(10).max(200000).optional(),
  amenities: z.union([z.string(),z.array(z.string())]).optional(),
  sort: z.enum(['newest','price_asc','price_desc','area_desc','featured','popular']).default('newest'),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  cursor: z.string().max(200).optional(),
});
export const appointmentSchema = z.object({
  propertyId: z.string().uuid(),
  start: z.coerce.date(),
  durationMinutes: z.coerce.number().int().min(15).max(240).default(60),
  clientName: z.string().trim().min(2).max(120),
  clientEmail: z.string().email(),
  clientPhone: z.string().trim().min(7).max(32).optional(),
  notes: z.string().trim().max(1000).optional(),
});
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  phone: z.string().trim().min(7).max(32).optional(),
  source: z.string().trim().max(100).optional(),
  propertyId: z.string().uuid().optional(),
  budget: z.coerce.number().nonnegative().optional(),
  locationPreference: z.string().trim().max(240).optional(),
  notes: z.string().trim().max(2000).optional(),
});
export const workingHoursSchema = z.object({
  day: z.enum(['MON','TUE','WED','THU','FRI','SAT','SUN']),
  open: z.boolean(),
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
  slotMinutes: z.number().int().min(15).max(240),
});
