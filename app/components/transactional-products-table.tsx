"use client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Button,
  ButtonGroup,
  getKeyValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useGetTransactionalProducts } from "../api-hooks/transactional-products/use-get-transactional-products";

export interface TransactionalProductsTableProps {}

export default function TransactionalProductsTable({}: TransactionalProductsTableProps) {
  const { transactionalProducts, isLoading } = useGetTransactionalProducts();

  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader>
        <TableColumn key="productName">Nome do produto</TableColumn>
        <TableColumn key="productDescription">Descrição do produto</TableColumn>
        <TableColumn key="createdAt">Criado em</TableColumn>
        <TableColumn key="updatedAt">Atualizado em</TableColumn>
        <TableColumn key="actions">Ações</TableColumn>
      </TableHeader>
      <TableBody isLoading={isLoading} loadingContent={<Spinner />}>
        {transactionalProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{getKeyValue(product, "productName")}</TableCell>
            <TableCell>{getKeyValue(product, "productDescription")}</TableCell>
            <TableCell>{getKeyValue(product, "createdAt")}</TableCell>
            <TableCell>{getKeyValue(product, "updatedAt")}</TableCell>
            <TableCell>
              <ButtonGroup className="space-x-4">
                <Button isIconOnly color="primary" size="sm">
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button isIconOnly color="danger" size="sm">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
