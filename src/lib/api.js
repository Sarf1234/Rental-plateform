export async function apiRequest(url, method = "GET", data = null) {
  const options = { method, headers: {} }; // <-- add this

  // 🔥 Only non-GET requests need credentials
  if (method !== "GET") {
    options.credentials = "include";
  }

  if (method === "GET") {
    options.next = { revalidate: 3600 }; // 1 hour ISR
  }
  
  if (data && !(data instanceof FormData)) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  } else if (data instanceof FormData) {
    options.body = data;
  }

  const res = await fetch(url, options);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = json.message || json.error || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return json;
}
