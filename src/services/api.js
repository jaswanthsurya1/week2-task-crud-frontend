const API_BASE_URL = "http://localhost:3000/api/tasks";

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Some DELETE endpoints may return no JSON.
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export function getTasks() {
  return request(API_BASE_URL);
}

export function createTask(task) {
  return request(API_BASE_URL, {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(id, task) {
  return request(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export function deleteTask(id) {
  return request(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
}