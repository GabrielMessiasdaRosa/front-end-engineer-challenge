import { TransactionalProducts } from "@/app/generated/prisma/client";
import { addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateTransactionalProductsParams = {
  productId: string;
  data: Partial<Omit<TransactionalProducts, "id" | "createdAt" | "updatedAt">>;
};

export function useUpdateTransactionalProducts() {
  const queryClient = useQueryClient();
  const {
    mutate,
    mutateAsync,
    data,
    isPending: isLoading,
    error,
    reset,
  } = useMutation<
    TransactionalProducts,
    Error,
    UpdateTransactionalProductsParams
  >({
    mutationKey: ["transactional-product", "update"],
    mutationFn: async ({
      productId,
      data: body,
    }: UpdateTransactionalProductsParams) => {
      const res = await fetch(`/api/v1/transactional-products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || `Failed to update: ${res.status}`);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactional-product", "list"],
      });
      addToast({
        title: "Produto transacional atualizado",
        color: "success",
      });
    },
    onError: (error: Error) => {
      const errorMessage =
        JSON.parse(error.message).message || "Erro desconhecido";
      addToast({
        title: "Erro ao atualizar produto",
        description: errorMessage,
        color: "danger",
      });
    },
  });
  return {
    updateTransactionalProduct: mutate,
    updateTransactionalProductAsync: mutateAsync,
    data,
    isLoading,
    error,
    reset,
  };
}
