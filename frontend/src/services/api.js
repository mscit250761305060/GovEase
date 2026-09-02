const API_BASE_URL = "http://127.0.0.1:8000";

export async function getServices() {
  const response = await fetch(
    `${API_BASE_URL}/api/services/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  return response.json();
}

export async function getService(slug) {
  const response = await fetch(
    `${API_BASE_URL}/api/services/${slug}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch service");
  }

  return response.json();
}
