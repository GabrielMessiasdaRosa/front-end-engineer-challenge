"use client";

"use client";
import { PencilIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateTransactionalProducts } from "../api-hooks/transactional-products/use-update-transactional-product";
import { TransactionalProducts } from "../generated/prisma/client";

type UpdateTransactionalProduct = {
  productName: string;
  productDescription: string;
};

export interface UpdateTransactionalProductFormModalProps {
  product: TransactionalProducts;
}

export default function UpdateTransactionalProductFormModal({
  product,
}: UpdateTransactionalProductFormModalProps) {
  const { updateTransactionalProduct } = useUpdateTransactionalProducts();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateTransactionalProduct>({
    defaultValues: {
      productName: product.productName,
      productDescription: product.productDescription,
    },
  });
  const onSubmit: SubmitHandler<UpdateTransactionalProduct> = (data) => {
    updateTransactionalProduct({
      productId: product.id,
      data: {
        productName: data.productName,
        productDescription: data.productDescription,
      },
    });
    reset();
    onClose();
  };
  return (
    <div>
      <Button
        onPress={onOpen}
        isIconOnly
        color="primary"
        variant="flat"
        size="sm"
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1 text-2xl font-light">
                Atualizando produto transacional
              </ModalHeader>
              <ModalBody className="w-full">
                <Input
                  isRequired
                  label="Nome do produto"
                  {...register("productName", { required: true })}
                  errorMessage={
                    errors.productName ? "Nome do produto é obrigatório" : ""
                  }
                />
                <Textarea
                  label="Descrição do produto"
                  className="mt-4"
                  {...register("productDescription")}
                />
              </ModalBody>
              <ModalFooter className="flex flex-row items-end w-full">
                <Button
                  color="danger"
                  radius="full"
                  variant="light"
                  onPress={() => {
                    onClose();
                    reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  radius="full"
                  type="submit"
                  color="success"
                  className="text-white"
                >
                  Salvar
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
