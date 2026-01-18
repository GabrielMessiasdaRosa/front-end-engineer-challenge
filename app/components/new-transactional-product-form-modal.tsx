"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
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
import { useCreateTransactionalProduct } from "../api-hooks/transactional-products/use-create-transactional-product";

type NewTransactionalProduct = {
  productName: string;
  productDescription: string;
};

export interface NewTransactionalProductFormModalProps {}

export default function NewTransactionalProductFormModal({}: NewTransactionalProductFormModalProps) {
  const { createTransactionalProduct } = useCreateTransactionalProduct();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewTransactionalProduct>();
  const onSubmit: SubmitHandler<NewTransactionalProduct> = (data) => {
    createTransactionalProduct({
      productName: data.productName,
      productDescription: data.productDescription,
    });

    reset();
    onClose();
  };
  return (
    <div>
      <Button onPress={onOpen} color="primary" radius="full">
        Novo <PlusIcon className="ml-2 h-5 w-5" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1 text-2xl font-light">
                Criando novo produto transacional
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
                  radius="full"
                  color="danger"
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
