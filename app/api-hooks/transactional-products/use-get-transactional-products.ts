"use client";
import { TransactionalProducts } from "@/app/generated/prisma/client";
import { useQuery } from "@tanstack/react-query";

type GetTransactionalProductsParams = {
  page?: number;
  limit?: number;
  productName?: string;
  productDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  order?: "asc" | "desc";
};
type ApiResponse = {
  data: TransactionalProducts[];
  page: number;
  limit: number;
  total: number;
};

export function useGetTransactionalProducts(
  params: GetTransactionalProductsParams = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const order = params.order ?? "desc";
  const {
    refetch: refetchTransactionalProducts,
    data: apiData,
    isPending: isLoading,
    error,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["transaction-product", "list", { page, limit, order }],
    queryFn: async () => {
      const search = new URLSearchParams();
      search.set("page", String(page));
      search.set("limit", String(limit));
      if (order) search.set("order", order);
      const res = await fetch(
        `/api/v1/transactional-products?${search.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(
          message || `Failed to fetch transactionProduct: ${res.status}`,
        );
      }
      return res.json() as Promise<ApiResponse>;
    },
    staleTime: 30_000,
    retry: 1,
  });
  return {
    refetchTransactionalProducts,
    transactionalProducts: apiData?.data ?? [],
    isLoading,
    error,
    page: apiData?.page,
    limit: apiData?.limit,
    total: apiData?.total,
  };
}
