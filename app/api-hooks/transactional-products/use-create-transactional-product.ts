import { addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateTransactionalProductsPayload = {
  productName: string;
  productDescription?: string;
};

export function useCreateTransactionalProduct() {
  const queryClient = useQueryClient();
  const {
    mutate: createTransactionalProduct,
    mutateAsync: createTransactionalProductAsync,
    data,
    isPending: isLoading,
    error,
    reset,
  } = useMutation({
    mutationKey: ["transactional-products", "create"],
    mutationFn: async (body: CreateTransactionalProductsPayload) => {
      const res = await fetch("/api/v1/transactional-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || `Falha ao criar Produto`);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactional-products", "list"],
      });
      addToast({
        title: "Produto transacional criado",
        color: "success",
      });
    },
    onError: (error) => {
      const errorMessage =
        JSON.parse(error.message).message || "Erro desconhecido";
      addToast({
        title: "Erro ao criar produto",
        description: errorMessage,
        color: "danger",
      });
    },
  });

  return {
    createTransactionalProduct,
    createTransactionalProductAsync,
    data,
    isLoading,
    error,
    reset,
  };
}
