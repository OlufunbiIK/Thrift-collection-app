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
  const [showContribution, setShowContribution] = useState(false);
  const [formData, setFormData] = useState({});

  const handleAddCustomer = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
    setShowForm(false);
    alert(`Customer ${newCustomer.fullName} added successfully!`);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowContribution(true);
    // Initialize form data with customer's existing data
    setFormData({
      amount: "",
      contributionDate: "",
      savingsPlan: customer.savingsPlan || "",
      balance: customer.balance || 0,
    });
  };

  const handleBackToCustomers = () => {
    setSelectedCustomer(null);
    setShowContribution(false);
    setFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitContribution = (e) => {
    e.preventDefault();

    if (!formData.amount || !selectedCustomer) {
      alert("Please enter an amount");
      return;
    }

    const contributionAmount = parseFloat(formData.amount);
    const currentBalance = parseFloat(selectedCustomer.balance || 0);
    const newBalance = currentBalance + contributionAmount;

    // Update the customer in the customers array
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === selectedCustomer.id
          ? {
              ...customer,
              balance: newBalance,
              savingsPlan: formData.savingsPlan || customer.savingsPlan,
              lastContribution: {
                amount: contributionAmount,
                date:
                  formData.contributionDate ||
                  new Date().toISOString().split("T")[0],
                timestamp: new Date().toISOString(),
              },
            }
          : customer
      )
    );

    // Update selected customer to reflect changes immediately
    setSelectedCustomer((prev) => ({
      ...prev,
      balance: newBalance,
      savingsPlan: formData.savingsPlan || prev.savingsPlan,
      lastContribution: {
        amount: contributionAmount,
        date:
          formData.contributionDate || new Date().toISOString().split("T")[0],
        timestamp: new Date().toISOString(),
      },
    }));

    alert(
      `Contribution of $${contributionAmount} added successfully! New balance: $${newBalance.toFixed(
        2
      )}`
    );

    // Reset form
    setFormData({
      amount: "",
      contributionDate: "",
      savingsPlan: selectedCustomer.savingsPlan,
      balance: newBalance,
    });
  };

  // Show contribution page when a customer is selected
  if (showContribution && selectedCustomer) {
    return (
      <FromSplit
        customer={selectedCustomer}
        formData={formData}
        handleChange={handleFormChange}
        onBack={handleBackToCustomers}
        onSubmit={handleSubmitContribution}
      />
    );
  }

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
              <div className="flex justify-center items-center mt-6">
                <Button
                  onClick={() => setShowForm(true)}
                  className="flex justify-center items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            ) : (
              <div className="mt-6">
                <FormAddCustomers
                  onAddCustomer={handleAddCustomer}
                  onShowForm={setShowForm}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
