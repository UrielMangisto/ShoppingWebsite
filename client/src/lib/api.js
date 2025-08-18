const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const ASSETS = import.meta.env.VITE_ASSETS_BASE || BASE.replace(/\/api$/, "");

const getToken = () => localStorage.getItem("token");
export const imageUrl = (filename) => (filename ? `${ASSETS}/uploads/${filename}` : "");

async function request(path, options = {}) {
  const headers = {};
  const t = getToken();
  if (t) headers["Authorization"] = `Bearer ${t}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return text ? JSON.parse(text) : {};
}
export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  put: (p, body) => request(p, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  del: (p) => request(p, { method: "DELETE" }),
};

export async function postMultipart(path, fields = {}, file, fileField = "image") {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => v != null && form.append(k, String(v)));
  if (file) form.append(fileField, file); // serveur: multer.single('image') :contentReference[oaicite:5]{index=5}
  const headers = {};
  const t = getToken();
  if (t) headers["Authorization"] = `Bearer ${t}`;
  const res = await fetch(`${BASE}${path}`, { method: "POST", body: form, headers });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return text ? JSON.parse(text) : {};
}

// Endpoints
export const AuthAPI = {
  register: (p) => api.post("/auth/register", p), // renvoie token + message :contentReference[oaicite:6]{index=6}
  login: (email, password) => api.post("/auth/login", { email, password }), // {token, user} :contentReference[oaicite:7]{index=7}
};

export const ProductsAPI = {
  list: () => api.get("/products"),
  one: (id) => api.get(`/products/${id}`),
  create: (fields, file) => postMultipart("/products", fields, file, "image"),
  update: (id, fields) => api.put(`/products/${id}`, fields),
  remove: (id) => api.del(`/products/${id}`),
};

export const CategoriesAPI = {
  list: () => api.get("/categories"),
  create: (name) => api.post("/categories", { name }),
  update: (id, name) => api.put(`/categories/${id}`, { name }),
  remove: (id) => api.del(`/categories/${id}`),
};

export const CartAPI = {
  list: () => api.get("/cart"), // lignes jointes à products: {id,row} {name, price, image, quantity} :contentReference[oaicite:8]{index=8}
  add: (product_id, quantity) => api.post("/cart", { product_id, quantity }),
  setQty: (rowId, quantity) => api.put(`/cart/${rowId}`, { quantity }),
  remove: (rowId) => api.del(`/cart/${rowId}`),
};

export const OrdersAPI = {
  create: () => api.post("/orders", {}), // crée depuis panier serveur :contentReference[oaicite:9]{index=9}
  mine: () => api.get("/orders"),
  one: (id) => api.get(`/orders/${id}`),
  all: () => api.get("/orders/all/admin"), // admin route exacte :contentReference[oaicite:10]{index=10}
};
