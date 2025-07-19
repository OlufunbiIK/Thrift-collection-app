import {
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./Button";

export default function FromSplit({
  handleChange,
  formData,
  onBack,
  customer,
  onSubmit,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [contributionDates, setContributionDates] = useState([]);

  // Generate contribution dates based on plan
  useEffect(() => {
    const generateDates = () => {
      const dates = [];
      const today = new Date();
      const startDate = formData?.contributionDate
        ? new Date(formData.contributionDate)
        : today;

      if (!formData?.savingsPlan && !customer?.savingsPlan) return dates;

      const planToUse = formData?.savingsPlan || customer?.savingsPlan;

      // Generate next 90 days of contribution dates
      for (let i = 0; i < 90; i++) {
        const date = new Date(startDate);

        switch (planToUse) {
          case "Basic": // Daily
            date.setDate(startDate.getDate() + i);
            dates.push(new Date(date));
            break;
          case "Standard": // Weekly
            date.setDate(startDate.getDate() + i * 7);
            if (i < 13) dates.push(new Date(date)); // Show 3 months
            break;
          case "Premium": // Monthly
            date.setMonth(startDate.getMonth() + i);
            if (i < 6) dates.push(new Date(date)); // Show 6 months
            break;
        }
      }

      return dates;
    };

    setContributionDates(generateDates());
  }, [
    formData?.savingsPlan,
    formData?.contributionDate,
    customer?.savingsPlan,
  ]);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isContributionDate = (date) => {
    return contributionDates.some(
      (contribDate) =>
        contribDate.getDate() === date &&
        contribDate.getMonth() === currentMonth.getMonth() &&
        contribDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = (date) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      date
    );
    const dateString = clickedDate.toISOString().split("T")[0];

    if (handleChange) {
      handleChange({
        target: {
          name: "contributionDate",
          value: dateString,
        },
      });
    }

    setSelectedDate(clickedDate);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case "Basic":
        return <Clock className="w-4 h-4" />;
      case "Standard":
        return <TrendingUp className="w-4 h-4" />;
      case "Premium":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "Basic":
        return "from-green-500 to-emerald-600";
      case "Standard":
        return "from-blue-500 to-indigo-600";
      case "Premium":
        return "from-purple-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const currentPlan = formData?.savingsPlan || customer?.savingsPlan;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white space-y-3">
            <Button onClick={onBack}>Back</Button>
            <div className="flex">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <DollarSign className="w-8 h-8" />
                Contribution Manager
              </h1>
            </div>
            <p className="text-blue-100">
              Plan your financial journey with smart scheduling
            </p>
          </div>

          <div className="p-8 grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  🤑 Add to {customer.fullName}'s Contribution
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">
                      Amount ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="amount"
                        value={formData?.amount || ""}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        placeholder="Enter contribution amount"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">
                      Savings Plan
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      name="savingsPlan"
                      value={
                        formData?.savingsPlan || customer?.savingsPlan || ""
                      }
                      onChange={handleChange}
                    >
                      <option value="">Select a plan</option>
                      <option value="Basic">Basic (Daily)</option>
                      <option value="Standard">Standard (Weekly)</option>
                      <option value="Premium">Premium (Monthly)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="contributionDate"
                      value={formData?.contributionDate || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  {currentPlan && (
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-r ${getPlanColor(
                        currentPlan
                      )} text-white`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getPlanIcon(currentPlan)}
                        <span className="font-semibold">
                          {currentPlan === "Basic"
                            ? "Daily"
                            : currentPlan === "Standard"
                            ? "Weekly"
                            : "Monthly"}{" "}
                          Plan
                        </span>
                      </div>
                      <p className="text-sm opacity-90">
                        {currentPlan === "Basic"
                          ? "Contribute every day to build strong financial habits"
                          : currentPlan === "Standard"
                          ? "Weekly contributions for steady growth"
                          : "Monthly contributions for long-term wealth building"}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">
                      Current Balance ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={`$${(customer?.balance || 0).toFixed(2)}`}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current balance will be updated after contribution
                    </p>
                  </div>

                  {formData?.amount && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <p className="text-sm text-green-800">
                        <strong>New Balance Preview:</strong> $
                        {(
                          (customer?.balance || 0) +
                          parseFloat(formData.amount || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <Button className="w-full mt-6" onClick={onSubmit}>
                    Add Contribution
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border border-blue-100 shadow-inner">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Contribution Calendar
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-semibold text-center text-gray-700">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </h4>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-gray-600 p-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={i} className="h-10"></div>
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const date = i + 1;
                  const isContrib = isContributionDate(date);
                  const isTodayDate = isToday(date);

                  return (
                    <button
                      key={date}
                      onClick={() => handleDateClick(date)}
                      className={`
                        h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105
                        ${
                          isContrib
                            ? `bg-gradient-to-r ${getPlanColor(
                                currentPlan
                              )} text-white shadow-lg`
                            : "hover:bg-blue-100 text-gray-700"
                        }
                        ${isTodayDate ? "ring-2 ring-blue-500" : ""}
                      `}
                    >
                      {date}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded bg-blue-500"></div>
                  <span className="text-gray-600">Today</span>
                </div>
                {currentPlan && (
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-4 h-4 rounded bg-gradient-to-r ${getPlanColor(
                        currentPlan
                      )}`}
                    ></div>
                    <span className="text-gray-600">Contribution dates</span>
                  </div>
                )}
              </div>

              {contributionDates.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{contributionDates.length}</strong> contribution
                    dates scheduled
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
