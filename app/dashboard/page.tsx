import TransactionalProductsTable from "../components/transactional-products-table";

export default function DashboardPage() {
  return (
    <main className="flex-1 h-screen flex items-center justify-center flex-col">
      <div className="space-y-4">
        <h1 className=" text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Produtos transacionais
        </h1>
        <TransactionalProductsTable />
      </div>
    </main>
  );
}
