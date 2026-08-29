import { request } from './httpClient';

export async function fetchDashboardStats() {
  return request('/api/v1/admin/dashboard');
}

export async function updatePlaceStatus(id, status) {
  return request(`/api/v1/admin/places/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status })
  });
}
