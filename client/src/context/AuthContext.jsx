import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../lib/api";

const Context = createContext(null);
export const useAuth = () => useContext(Context);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Boot: si token existe on démarre "connecté" mais sans /me (ton API n'en expose pas tel quel)
  useEffect(() => { setLoading(false); }, []);

  async function login(email, password) {
    const { token, user } = await AuthAPI.login(email, password);
    localStorage.setItem("token", token);
    setUser(user); // {id,name,role} :contentReference[oaicite:11]{index=11}
  }
  async function register(name, email, password) {
    const { token } = await AuthAPI.register({ name, email, password });
    localStorage.setItem("token", token);
    setUser(null); // on peut rediriger vers /login selon UX
  }
  function logout() { localStorage.removeItem("token"); setUser(null); }

  return (
    <Context.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Context.Provider>
  );
}
