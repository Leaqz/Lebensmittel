/**
 * API client for the GroceryGenius backend.
 * All calls proxy through Vite (/api → http://localhost:8000/api).
 * Falls back gracefully to static data when the backend is unreachable.
 */

const BASE = "/api";

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function put(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function post(path) {
  const res = await fetch(`${BASE}${path}`, { method: "POST" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Meals ────────────────────────────────────────────────────────────────────

export async function fetchMeals() {
  return get("/meals");
}

export async function fetchMeal(id) {
  return get(`/meals/${id}`);
}

export async function fetchShoppingList(mealId, servings) {
  return get(`/meals/${mealId}/shopping-list?servings=${servings}`);
}

// ── Crawl ────────────────────────────────────────────────────────────────────

export async function fetchCrawlStatus() {
  return get("/crawl/status");
}

export async function fetchCrawlConfigs() {
  return get("/crawl/config");
}

export async function updateCrawlConfig(configId, body) {
  return put(`/crawl/config/${configId}`, body);
}

export async function triggerCrawl() {
  return post("/crawl/run");
}

// ── Crawled items ─────────────────────────────────────────────────────────────

export async function fetchCrawledItems({ search = "", supermarket = "", page = 1 } = {}) {
  const params = new URLSearchParams({ q: search, supermarket, page });
  return get(`/items?${params}`);
}
