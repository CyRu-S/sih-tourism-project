import { request } from './httpClient';
import { USE_MOCK_DATA } from '../config/env';
import { places } from '../data/mockPlaces';

export async function getRecommendations(input) {
  if (USE_MOCK_DATA) {
    const selectedInterests = input.interests || [];
    const ranked = places
      .filter((place) => !input.maxDistanceKm || place.distanceKm <= input.maxDistanceKm)
      .filter((place) => !input.category || input.category === 'all' || place.category === input.category)
      .filter((place) => !selectedInterests.length || selectedInterests.some((interest) => place.category === interest || place.tags.includes(interest) || (interest === 'photography' && place.photo) || (interest === 'peaceful' && place.estimatedCrowd.level === 'LOW')))
      .sort((a, b) => {
        const aCrowdPenalty = input.crowdPreference === 'LOW' && a.estimatedCrowd.level !== 'LOW' ? 12 : 0;
        const bCrowdPenalty = input.crowdPreference === 'LOW' && b.estimatedCrowd.level !== 'LOW' ? 12 : 0;
        return (b.score - bCrowdPenalty) - (a.score - aCrowdPenalty);
      });
    return { items: ranked.slice(0, input.limit || 5) };
  }
  return request('/api/v1/recommendations', { method: 'POST', body: JSON.stringify(input) });
}
