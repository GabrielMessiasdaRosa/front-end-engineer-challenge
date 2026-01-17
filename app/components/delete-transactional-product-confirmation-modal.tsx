"use client";

import { TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useDeleteTransactionalProduct } from "../api-hooks/transactional-products/use-delete-transactional-product";
import { TransactionalProducts } from "../generated/prisma/client";

export interface DeleteTransactionalProductConfirmationModalProps {
  product: TransactionalProducts;
}

export default function DeleteTransactionalProductConfirmationModal({
  product,
}: DeleteTransactionalProductConfirmationModalProps) {
  const { deleteTransactionalProduct } = useDeleteTransactionalProduct();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button onPress={onOpen} isIconOnly color="danger" size="sm">
        <TrashIcon className="h-4 w-4" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Deletando {product.productName}
              </ModalHeader>
              <ModalBody>
                <p>Tem certeza que deseja deletar o produto transacional?</p>

                <div className="flex items-center justify-center space-x-2">
                  <XCircleIcon className="inline h-5 w-5 text-danger-600" />
                  <p className="font-bold text-center">
                    Esta ação não pode ser desfeita.{" "}
                  </p>
                  <XCircleIcon className="inline h-5 w-5 text-danger-600" />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  onPress={() => {
                    deleteTransactionalProduct({
                      productId: product.id,
                    });
                    onClose();
                  }}
                  color="danger"
                >
                  Deletar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
