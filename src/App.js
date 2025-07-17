import { useState } from "react";
import CustomerList from "./components/CustomerList";
import FormAddCustomers from "./components/FromAddCustomers";
import customersData from "./CustomersData";
import Button from "./components/Button";
import { Plus } from "lucide-react";
import FromSplit from "./components/Contributions";

export default function App() {
  const [customers, setCustomers] = useState(customersData);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddCustomer = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
    setShowForm(false);
    alert(`Customer ${newCustomer.fullName} added successfully!`);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    alert(`Selected: ${customer.fullName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Customer Management
          </h1>
          <p className="text-gray-600">
            Manage your customers and their savings plans
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <CustomerList
              customers={customers}
              onSelectCustomer={handleSelectCustomer}
            />

            {!showForm ? (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            ) : (
              <FormAddCustomers
                onAddCustomer={handleAddCustomer}
                onShowForm={setShowForm}
              />
            )}
          </div>
          <div>
            <FromSplit />
          </div>
        </div>
      </div>

      {/* <ThriftSavingsManager /> */}
    </div>
  );
}
