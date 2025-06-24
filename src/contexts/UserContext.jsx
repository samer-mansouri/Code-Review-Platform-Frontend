import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    first_name: localStorage.getItem("first_name"),
    last_name: localStorage.getItem("last_name"),
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setUser({
        first_name: localStorage.getItem("first_name"),
        last_name: localStorage.getItem("last_name"),
        profile_picture: localStorage.getItem("profile_picture") || "",
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
