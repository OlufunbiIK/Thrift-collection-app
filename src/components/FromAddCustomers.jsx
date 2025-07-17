import { useState } from "react";
import { User, Mail, Phone, CreditCard, Image, Plus } from "lucide-react";
import Button from "./Button";

export default function FormAddCustomers({ onAddCustomer, onShowForm }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    imageUrl: "",
    amount: "",
    savingsPlan: "",
    contributionDate: "",
  });

  const handleSubmit = () => {
    if (
      formData.fullName &&
      formData.email &&
      formData.phone &&
      formData.savingsPlan
    ) {
      onAddCustomer({
        ...formData,
        id: Date.now(),
        balance: 0,
        imageUrl:
          formData.imageUrl ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      });
      onShowForm(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        savingsPlan: "",
        imageUrl: "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Customer
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4" />
                Customer Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4" />
                Customer Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="w-4 h-4" />
                Customer Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CreditCard className="w-4 h-4" />
                Customer Savings Plan
              </label>
              <select
                name="savingsPlan"
                value={formData.savingsPlan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select a plan</option>
                <option value="Basic">Daily</option>
                <option value="Standard">Weekly</option>
                <option value="Premium">Monthly</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Image className="w-4 h-4" />
                Upload Customer Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData((prev) => ({
                        ...prev,
                        imageUrl: reader.result,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />

              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="mt-4 w-24 h-24 object-cover rounded-full border"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSubmit} variant="primary" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
