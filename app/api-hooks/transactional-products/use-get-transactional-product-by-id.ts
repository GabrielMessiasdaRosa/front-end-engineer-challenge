import { TransactionalProducts } from "@/app/generated/prisma/client";
import { useQuery } from "@tanstack/react-query";

type ApiResponse = { data: TransactionalProducts };

export function useGetTransactionalProductById(id: string | number) {
  const {
    data: apiData,
    isPending: isLoading,
    error,
    refetch,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["private-transactional-products", "getById", id],
    queryFn: async () => {
      if (id == null || id === "") {
        throw new Error("TransactionalProducts id is required");
      }
      const res = await fetch(`/api/v1/transactional-products/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(
          message ||
            `Failed to fetch transactional-products ${id}: ${res.status}`,
        );
      }
      return res.json() as Promise<ApiResponse>;
    },
    enabled: id != null && id !== "",
    staleTime: 30_000,
    retry: 1,
  });

  return {
    refetchTransactionalProduct: refetch,
    transactionalProduct: apiData?.data,
    isLoading,
    error,
  };
}
