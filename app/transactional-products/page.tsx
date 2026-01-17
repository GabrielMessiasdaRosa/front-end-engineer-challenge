import NewTransactionalProductFormModal from "../components/new-transactional-product-form-modal";
import TransactionalProductsTable from "../components/transactional-products-table";

export default function TransactionalProductsPage() {
  return (
    <section className="">
      <div className="flex flex-col space-y-4">
        <div className="flex-1 flex flex-row justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Produtos transacionais
          </h1>
          <NewTransactionalProductFormModal />
        </div>
        <TransactionalProductsTable />
      </div>
    </section>
  );
}
