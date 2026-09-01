const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error("Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function getCourses(stage) {
  const query = stage ? `?stage=${encodeURIComponent(stage)}` : "";
  return request(`/courses/${query}`);
}

export function getGalleryImages(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return request(`/gallery/${query}`);
}

export function submitContactMessage(payload) {
  return request(`/contact/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitAdmissionApplication(payload) {
  return request(`/admissions/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
