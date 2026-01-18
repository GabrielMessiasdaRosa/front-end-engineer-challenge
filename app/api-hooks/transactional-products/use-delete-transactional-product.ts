"use client";
import { addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteTransactionalProductParams = {
  productId: string;
};

export function useDeleteTransactionalProduct() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteTransactionalProduct,
    mutateAsync: deleteTransactionalProductAsync,
    data,
    isPending: isLoading,
    error,
    reset,
  } = useMutation({
    mutationKey: ["transactional-product", "delete"],
    mutationFn: async ({ productId }: DeleteTransactionalProductParams) => {
      const res = await fetch(`/api/v1/transactional-products/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(
          message || `Failed to delete transactional-product: ${res.status}`,
        );
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactional-product", "list"],
      });
      addToast({
        title: "Produto transacional deletado",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Erro ao deletar produto transacional",
        description: error.message,
        color: "danger",
      });
    },
  });

  return {
    deleteTransactionalProduct,
    deleteTransactionalProductAsync,
    data,
    isLoading,
    error,
    reset,
  };
}
