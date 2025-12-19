import { useQuery } from "@tanstack/react-query";
import { getUserApi } from "../api/userApi";

export const useCurrentUser = () => {
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("accessToken");
  return useQuery({
    queryKey: ["me", userLocal?.id],
    queryFn: () => getUserApi(userLocal.id, token),
    enabled: !!userLocal?.id,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: false,
  });
};
