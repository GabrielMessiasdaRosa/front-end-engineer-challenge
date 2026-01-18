"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  DatePicker,
  getKeyValue,
  Input,
  Pagination,
  Select,
  SelectItem,
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
import React, { useEffect, useRef, useState } from "react";
import { useGetTransactionalProducts } from "../api-hooks/transactional-products/use-get-transactional-products";
import normalizeDate from "../lib/normalize-date";
import DeleteTransactionalProductConfirmationModal from "./delete-transactional-product-confirmation-modal";
import UpdateTransactionalProductFormModal from "./update-transactional-product-form-modal";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export interface TransactionalProductsTableProps {}

export default function TransactionalProductsTable({}: TransactionalProductsTableProps) {
  const searchParams = useSearchParams();
  const productName = searchParams.get("productName") || undefined;
  const createdAt = searchParams.get("createdAt") || undefined;
  const updatedAt = searchParams.get("updatedAt") || undefined;
  const order = (searchParams.get("order") as "asc" | "desc") || "desc";

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [sortDescriptor, setSortDescriptor] = useState<
    SortDescriptor | undefined
  >(undefined);
  const [selectedDate, setSelectedDate] = useState<any>(null);

  const {
    transactionalProducts,
    isLoading,
    updateSearchParams,
    limit,
    page,
    total,
  } = useGetTransactionalProducts({
    productName,
    createdAt,
    updatedAt,
    order,
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
      createdAt: searchParams.get("createdAt") || undefined,
      order: descriptor.direction === "ascending" ? "asc" : "desc",
      page: 1,
    });
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);

    if (date) {
      const dateString = date.toString();
      updateSearchParams({
        productName: searchParams.get("productName") || undefined,
        createdAt: dateString,
        page: 1,
      });
    } else {
      updateSearchParams({
        productName: searchParams.get("productName") || undefined,
        createdAt: undefined,
        page: 1,
      });
    }
  };

  const handleClearFilters = () => {
    setSelectedDate(null);
    setSortDescriptor(undefined);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    updateSearchParams({
      productName: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      order: "desc",
      page: 1,
      limit: 10,
    });
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const hasActiveFilters =
    searchParams.get("productName") ||
    searchParams.get("createdAt") ||
    sortDescriptor;

  const pages = React.useMemo(() => {
    return total ? Math.ceil(total / limit) : 0;
  }, [total, limit]);

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex justify-start items-center space-x-4">
        <div className="flex-1">
          <Input
            size="lg"
            placeholder="Buscar por nome do produto"
            onValueChange={handleSearch}
            className="flex-1"
            isClearable
            defaultValue={searchParams.get("productName") || ""}
          />
        </div>
        <div className="flex-1">
          <DatePicker
            label="Filtrar por data da criação"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div>
          {hasActiveFilters && (
            <Button
              isIconOnly
              color="danger"
              variant="light"
              size="lg"
              onPress={handleClearFilters}
              title="Limpar filtros"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
        <div className="flex-1">
          <Select size="md" label="Linhas por página" defaultOpen>
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <SelectItem
                key={String(option)}
                onPress={() =>
                  updateSearchParams({
                    limit: option,
                    createdAt: selectedDate ? createdAt : undefined,
                  })
                }
              >
                {String(option)}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <Table
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) =>
                updateSearchParams({
                  page,
                  limit,
                  createdAt: selectedDate ? createdAt : undefined,
                  order,
                  productName,
                  updatedAt,
                })
              }
            />
          </div>
        }
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
        <TableBody
          key={transactionalProducts.length}
          isLoading={isLoading}
          loadingContent={<Spinner />}
        >
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
                <div className="flex flex-row space-x-4">
                  <UpdateTransactionalProductFormModal product={product} />
                  <DeleteTransactionalProductConfirmationModal
                    product={product}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
