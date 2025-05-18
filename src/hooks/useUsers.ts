import { PaginationRequest, PaginationResponse } from "@/types/pagination";
import { UserResponse } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const fetchUsers = async (
  accessToken: string,
  params: PaginationRequest
): Promise<PaginationResponse<UserResponse>> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/1.0.0/users`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    }
  );
  return data.data as PaginationResponse<UserResponse>;
};

const useUsers = (accessToken: string) => {
  const [params, setParams] = useState<PaginationRequest>({
    start: 0,
    length: 10,
    search: "",
    field: "id",
    order: "desc",
  });
  const {
    isLoading,
    error,
    data: users,
    refetch,
  } = useQuery({
    queryKey: ["fetchUsers", accessToken, params],
    queryFn: async () => fetchUsers(accessToken, params),
    staleTime: 60 * 1000,
    gcTime: 60 * 1000,
    enabled: !!accessToken,
  });
  return {
    isLoading,
    error,
    users,
    refetch,
    params,
    setParams,
  };
};

export default useUsers;
