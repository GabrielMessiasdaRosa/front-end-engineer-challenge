"use client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Button,
  ButtonGroup,
  getKeyValue,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { SortDescriptor } from "@react-types/shared";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGetTransactionalProducts } from "../api-hooks/transactional-products/use-get-transactional-products";

export interface TransactionalProductsTableProps {}

export default function TransactionalProductsTable({}: TransactionalProductsTableProps) {
  const searchParams = useSearchParams();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [sortDescriptor, setSortDescriptor] = useState<
    SortDescriptor | undefined
  >(undefined);

  const { transactionalProducts, isLoading, updateSearchParams } =
    useGetTransactionalProducts({
      productName: searchParams.get("productName") || undefined,
      createdAt: searchParams.get("createdAt") || undefined,
      updatedAt: searchParams.get("updatedAt") || undefined,
      order: (searchParams.get("order") as "asc" | "desc") || "desc",
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    });

  const handleSearch = (value: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      updateSearchParams({ productName: value, page: 1 });
    }, 500);
  };

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    updateSearchParams({
      productName: searchParams.get("productName") || undefined,
      order: descriptor.direction === "ascending" ? "asc" : "desc",
      page: 1,
    });
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const normalizeDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
    });
  };
  return (
    <div className="w-full flex flex-col space-y-4">
      <div>
        <Input
          placeholder="Buscar por nome do produto"
          onValueChange={handleSearch}
        />
      </div>
      <Table
        fullWidth
        aria-label="Table with sorting"
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
      >
        <TableHeader>
          <TableColumn allowsSorting key="productName">
            Nome do produto
          </TableColumn>
          <TableColumn key="productDescription">
            Descrição do produto
          </TableColumn>
          <TableColumn allowsSorting key="createdAt">
            Criado em
          </TableColumn>
          <TableColumn allowsSorting key="updatedAt">
            Atualizado em
          </TableColumn>
          <TableColumn key="actions">Ações</TableColumn>
        </TableHeader>
        <TableBody isLoading={isLoading} loadingContent={<Spinner />}>
          {transactionalProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{getKeyValue(product, "productName")}</TableCell>
              <TableCell>
                {getKeyValue(product, "productDescription")}
              </TableCell>
              <TableCell className="flex-1">
                {normalizeDate(getKeyValue(product, "createdAt"))}
              </TableCell>
              <TableCell>
                {normalizeDate(getKeyValue(product, "updatedAt"))}
              </TableCell>
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
    </div>
  );
}
