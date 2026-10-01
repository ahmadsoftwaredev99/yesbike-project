import { useSelector } from "react-redux";

// Small convenience hook so components don't repeat the same selector logic
const useAuth = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    loading,
    error,
  };
};

export default useAuth;
