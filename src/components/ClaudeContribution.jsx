import React, { useEffect, useState } from "react";
import {
  Plus,
  Wallet,
  TrendingUp,
  Users,
  DollarSign,
  RotateCcw,
} from "lucide-react";

export default function ClaudeContribution() {
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  // const [searchTerm, setSearchTerm] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  // const [selectedGroup, setSelectedGroup] = useState(null);

  // Sample thrift groups
  const sampleGroups = [
    {
      id: 1,
      name: "Monthly Savers Circle",
      contributionAmount: 10000,
      frequency: "Monthly",
      totalMembers: 6,
      currentRound: 2,
      nextCollectionDate: "2024-03-15",
      nextBeneficiary: "Sarah Johnson",
      status: "active",
      totalPool: 60000,
      completedRounds: 1,
    },
    {
      id: 2,
      name: "Weekly Builders",
      contributionAmount: 5000,
      frequency: "Weekly",
      totalMembers: 4,
      currentRound: 5,
      nextCollectionDate: "2024-03-10",
      nextBeneficiary: "Michael Chen",
      status: "active",
      totalPool: 20000,
      completedRounds: 4,
    },
  ];

  // Sample contributions
  const sampleContributions = [
    {
      id: 1,
      memberId: 1,
      memberName: "Sarah Johnson",
      groupId: 1,
      groupName: "Monthly Savers Circle",
      amount: 10000,
      date: "2024-02-15",
      round: 2,
      status: "paid",
    },
    {
      id: 2,
      memberId: 2,
      memberName: "Michael Chen",
      groupId: 1,
      groupName: "Monthly Savers Circle",
      amount: 10000,
      date: "2024-02-15",
      round: 2,
      status: "paid",
    },
    {
      id: 3,
      memberId: 3,
      memberName: "Emma Davis",
      groupId: 2,
      groupName: "Weekly Builders",
      amount: 5000,
      date: "2024-02-28",
      round: 5,
      status: "pending",
    },
  ];

  // Sample loans
  const sampleLoans = [
    {
      id: 1,
      borrowerId: 4,
      borrowerName: "James Wilson",
      amount: 25000,
      loanDate: "2024-02-20",
      dueDate: "2024-05-20",
      interestRate: 5,
      status: "active",
      monthlyPayment: 8750,
      remainingBalance: 25000,
    },
    {
      id: 2,
      borrowerId: 5,
      borrowerName: "Lisa Brown",
      amount: 15000,
      loanDate: "2024-01-15",
      dueDate: "2024-04-15",
      interestRate: 3,
      status: "active",
      monthlyPayment: 5150,
      remainingBalance: 10000,
    },
  ];

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=6&nat=us,gb")
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.results.map((user, index) => ({
          id: index + 1,
          fullName: `${user.name.first} ${user.name.last}`,
          phone: user.phone,
          email: user.email,
          image: user.picture.medium,
          joinDate: new Date(
            Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          totalContributions: Math.floor(Math.random() * 50000) + 10000,
          totalReceived: Math.floor(Math.random() * 60000),
          activeLoans: Math.floor(Math.random() * 2),
          creditScore: Math.floor(Math.random() * 50) + 50,
          isActive: Math.random() > 0.2,
          groupMemberships: Math.floor(Math.random() * 3) + 1,
          lastPaymentDate: new Date().toISOString().split("T")[0],
          savingsPlan: ["Daily", "Weekly", "Monthly"][index % 3],
          balance: Math.floor(Math.random() * 50000),
        }));
        setMembers(transformed);
        setGroups(sampleGroups);
        setContributions(sampleContributions);
        setLoans(sampleLoans);
        setLoading(false);
      });
  }, []);

  const calculateNextBeneficiary = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return null;

    const groupMembers = members.filter((m) => m.groupMemberships > 0);
    const currentIndex = group.currentRound % groupMembers.length;
    return groupMembers[currentIndex]?.fullName || "TBD";
  };

  const handleMakeContribution = (memberId, groupId, amount) => {
    const member = members.find((m) => m.id === memberId);
    const group = groups.find((g) => g.id === groupId);

    if (member && group) {
      const newContribution = {
        id: contributions.length + 1,
        memberId,
        memberName: member.fullName,
        groupId,
        groupName: group.name,
        amount,
        date: new Date().toISOString().split("T")[0],
        round: group.currentRound,
        status: "paid",
      };

      setContributions([...contributions, newContribution]);
      setMembers(
        members.map((m) =>
          m.id === memberId
            ? {
                ...m,
                totalContributions: m.totalContributions + amount,
                balance: m.balance + amount,
              }
            : m
        )
      );
    }
  };

  const handleLoanRequest = (memberId, amount, months) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      const interestRate =
        member.creditScore > 80 ? 3 : member.creditScore > 60 ? 5 : 8;
      const totalWithInterest = amount * (1 + interestRate / 100);
      const monthlyPayment = totalWithInterest / months;

      const newLoan = {
        id: loans.length + 1,
        borrowerId: memberId,
        borrowerName: member.fullName,
        amount,
        loanDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        interestRate,
        status: "active",
        monthlyPayment: Math.round(monthlyPayment),
        remainingBalance: amount,
      };

      setLoans([...loans, newLoan]);
      setMembers(
        members.map((m) =>
          m.id === memberId
            ? {
                ...m,
                activeLoans: m.activeLoans + 1,
                balance: m.balance + amount,
              }
            : m
        )
      );
      setShowLoanModal(false);
      setSelectedMember(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCreditScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const totalPoolValue = groups.reduce(
    (sum, group) => sum + group.totalPool,
    0
  );
  const totalActiveLoans = loans.filter(
    (loan) => loan.status === "active"
  ).length;
  const totalMembers = members.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading thrift savings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Thrift Savings Manager
                </h1>
                <p className="text-gray-600">
                  Manage contributions, loans & rotations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ₦{totalPoolValue.toLocaleString()}
                  </div>
                  <div className="text-gray-500">Total Pool</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {totalMembers}
                  </div>
                  <div className="text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {totalActiveLoans}
                  </div>
                  <div className="text-gray-500">Active Loans</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp },
              { id: "members", label: "Members", icon: Users },
              { id: "groups", label: "Savings Groups", icon: RotateCcw },
              { id: "loans", label: "Loans", icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Savings Pool
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₦{totalPoolValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Members
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {members.filter((m) => m.isActive).length}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Loans
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {totalActiveLoans}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Savings Groups
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {groups.length}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <RotateCcw className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activities
              </h3>
              <div className="space-y-4">
                {contributions.slice(0, 5).map((contribution) => (
                  <div
                    key={contribution.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Plus className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {contribution.memberName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Contributed to {contribution.groupName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        ₦{contribution.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {contribution.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Members</h2>
              <button
                onClick={() => setShowAddMember(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={member.image}
                      alt={member.fullName}
                      className="w-16 h-16 rounded-full border-2 border-blue-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {member.fullName}
                      </h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          member.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Total Contributions:
                      </span>
                      <span className="font-medium text-green-600">
                        ₦{member.totalContributions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Received:</span>
                      <span className="font-medium text-blue-600">
                        ₦{member.totalReceived.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Score:</span>
                      <span
                        className={`font-medium ${getCreditScoreColor(
                          member.creditScore
                        )}`}
                      >
                        {member.creditScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Loans:</span>
                      <span className="font-medium text-gray-900">
                        {member.activeLoans}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() =>
                        handleMakeContribution(member.id, 1, 10000)
                      }
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Add Contribution
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setShowLoanModal(true);
                      }}
                      className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      Request Loan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Savings Groups
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {group.frequency} • {group.totalMembers} members
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        group.status
                      )}`}
                    >
                      {group.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Contribution Amount
                      </p>
                      <p className="font-semibold text-blue-600">
                        ₦{group.contributionAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total Pool</p>
                      <p className="font-semibold text-purple-600">
                        ₦{group.totalPool.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Round:</span>
                      <span className="font-medium">{group.currentRound}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Collection:</span>
                      <span className="font-medium">
                        {group.nextCollectionDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Beneficiary:</span>
                      <span className="font-medium text-green-600">
                        {group.nextBeneficiary}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">
                        {group.completedRounds}/{group.totalMembers} rounds
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (group.completedRounds / group.totalMembers) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === "loans" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Loans</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Borrower
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interest Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monthly Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {loan.borrowerName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₦{loan.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {loan.interestRate}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₦{loan.monthlyPayment.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {loan.dueDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              loan.status
                            )}`}
                          >
                            {loan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loan Modal */}
      {showLoanModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Loan Request for {selectedMember.fullName}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  id="loanAmount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repayment Period (months)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="loanPeriod"
                >
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                </select>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  Credit Score:{" "}
                  <span
                    className={`font-medium ${getCreditScoreColor(
                      selectedMember.creditScore
                    )}`}
                  >
                    {selectedMember.creditScore}/100
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Estimated Interest Rate:{" "}
                  {selectedMember.creditScore > 80
                    ? "3%"
                    : selectedMember.creditScore > 60
                    ? "5%"
                    : "8%"}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    const amount = parseInt(
                      document.getElementById("loanAmount").value
                    );
                    const period = parseInt(
                      document.getElementById("loanPeriod").value
                    );
                    if (amount && period) {
                      handleLoanRequest(selectedMember.id, amount, period);
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Approve Loan
                </button>
                <button
                  onClick={() => {
                    setShowLoanModal(false);
                    setSelectedMember(null);
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
