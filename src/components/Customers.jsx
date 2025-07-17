import { Mail, Phone, Check } from "lucide-react";
import Button from "./Button";

export default function Customer({ customer, onSelect }) {
  const getBalanceColor = (balance) => {
    if (balance < 0) return "text-red-600 bg-red-50";
    if (balance > 0) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  const getBalanceText = (balance) => {
    if (balance < 0)
      return `Outstanding: $${Math.abs(balance).toLocaleString()}`;
    if (balance > 0) return `Balance: $${balance.toLocaleString()}`;
    return "Balance: Settled";
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "Standard":
        return "bg-blue-100 text-blue-800";
      case "Basic":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl max-w-3xl mx-auto p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <div className="flex-shrink-0">
            <img
              src={customer.imageUrl}
              alt={customer.fullName}
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
            />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {customer.fullName}
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center justify-center lg:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {customer.email}
              </p>
              <p className="flex items-center justify-center lg:justify-start gap-2">
                <Phone className="w-4 h-4" />
                {customer.phone}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap justify-center lg:justify-start gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(
                  customer.savingsPlan
                )}`}
              >
                {customer.savingsPlan} Plan
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getBalanceColor(
                  customer.balance
                )}`}
              >
                {getBalanceText(customer.balance)}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Button onClick={() => onSelect(customer)} variant="primary">
              <Check className="w-4 h-4 mr-2" />
              Select
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
