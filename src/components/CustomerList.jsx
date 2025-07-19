import { User } from "lucide-react";
import Customer from "./Customers";

export default function CustomerList({ customers, onSelectCustomer }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r  from-blue-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer List ({customers.length})
          </h2>
        </div>

        <div className="p-6">
          {customers.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No customers found. Add your first customer above!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => (
                <Customer
                  key={customer.id}
                  customer={customer}
                  onSelect={onSelectCustomer}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
