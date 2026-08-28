import { request } from './httpClient';
import { USE_MOCK_DATA } from '../config/env';
import { places } from '../data/mockPlaces';

export async function getPlace(placeId) {
  if (USE_MOCK_DATA) return places.find((place) => place.placeId === placeId);
  return request(`/api/v1/places/${placeId}`);
}
