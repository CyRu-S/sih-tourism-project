import { request } from './httpClient';
import { USE_MOCK_DATA } from '../config/env';

export async function getRoute(placeId, origin) {
  if (USE_MOCK_DATA) {
    const destination = { 101: [88.3654, 22.6201], 102: [88.2107, 22.4465], 103: [88.3633, 22.5154], 104: [88.3514, 22.5851], 105: [88.3433, 22.4864] }[placeId];
    return { distanceKm: 6.2, durationMinutes: 18, geometry: { type: 'LineString', coordinates: [[origin.lng, origin.lat], destination] } };
  }
  return request(`/api/v1/places/${placeId}/route?originLat=${origin.lat}&originLng=${origin.lng}&mode=foot`);
}
