"use client";
import { TransactionalProducts } from "@/app/generated/prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

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
  params?: GetTransactionalProductsParams,
) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = params?.page ?? Number(searchParams.get("page")) ?? 1;
  const limit = params?.limit ?? Number(searchParams.get("limit")) ?? 10;
  const order = (params?.order ?? searchParams.get("order") ?? "desc") as
    | "asc"
    | "desc";
  const productName =
    params?.productName ?? searchParams.get("productName") ?? undefined;
  const productDescription =
    params?.productDescription ??
    searchParams.get("productDescription") ??
    undefined;
  const createdAt =
    params?.createdAt ?? searchParams.get("createdAt") ?? undefined;
  const updatedAt =
    params?.updatedAt ?? searchParams.get("updatedAt") ?? undefined;

  const {
    refetch: refetchTransactionalProducts,
    data: apiData,
    isPending: isLoading,
    error,
  } = useQuery<ApiResponse, Error>({
    queryKey: [
      "transaction-product",
      "list",
      {
        page,
        limit,
        order,
        productName,
        productDescription,
        createdAt,
        updatedAt,
      },
    ],
    queryFn: async () => {
      // Construir query string manualmente para preservar case-sensitivity
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      params.append("order", order);

      if (productName) params.append("productName", productName);
      if (productDescription)
        params.append("productDescription", productDescription);
      if (createdAt) params.append("createdAt", createdAt);
      if (updatedAt) params.append("updatedAt", updatedAt);

      const url = `/api/v1/transactional-products?${params.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

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

  // Função para atualizar search params mantendo case-sensitivity
  const updateSearchParams = useCallback(
    (newParams: GetTransactionalProductsParams) => {
      const params = new URLSearchParams();

      if (newParams.page) params.append("page", String(newParams.page));
      if (newParams.limit) params.append("limit", String(newParams.limit));
      if (newParams.order) params.append("order", newParams.order);
      if (newParams.productName)
        params.append("productName", newParams.productName);
      if (newParams.productDescription)
        params.append("productDescription", newParams.productDescription);
      if (newParams.createdAt) params.append("createdAt", newParams.createdAt);
      if (newParams.updatedAt) params.append("updatedAt", newParams.updatedAt);

      const queryString = params.toString();
      router.push(`?${queryString}`, { scroll: false });
    },
    [router],
  );

  return {
    refetchTransactionalProducts,
    transactionalProducts: apiData?.data ?? [],
    isLoading,
    error,
    page: apiData?.page ?? page,
    limit: apiData?.limit ?? limit,
    total: apiData?.total ?? 0,
    updateSearchParams,
  };
}
