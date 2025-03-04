import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  PieChart,
  TrendingUp,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { useState } from "react";

// Mock expense data (to be replaced with actual API integration)
const expenses = [
  {
    id: 1,
    category: "Books",
    amount: 150,
    date: "2025-03-01",
    type: "expense",
  },
  {
    id: 2,
    category: "Scholarship",
    amount: 1000,
    date: "2025-03-01",
    type: "income",
  },
  {
    id: 3,
    category: "Food",
    amount: 200,
    date: "2025-03-02",
    type: "expense",
  },
];

export default function ExpensePage() {
  const [activeView, setActiveView] = useState<"transactions" | "analytics">("transactions");

  const totalExpenses = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Finance Tracker</h1>
          <p className="text-muted-foreground">
            Track your expenses and manage your student budget
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <h3 className="text-2xl font-bold">${(totalIncome - totalExpenses).toLocaleString()}</h3>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Income</p>
              <h3 className="text-2xl font-bold text-green-600">+${totalIncome.toLocaleString()}</h3>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expenses</p>
              <h3 className="text-2xl font-bold text-red-600">-${totalExpenses.toLocaleString()}</h3>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      <div className="flex gap-4 border-b">
        <Button
          variant={activeView === "transactions" ? "default" : "ghost"}
          onClick={() => setActiveView("transactions")}
        >
          Transactions
        </Button>
        <Button
          variant={activeView === "analytics" ? "default" : "ghost"}
          onClick={() => setActiveView("analytics")}
        >
          Analytics
        </Button>
      </div>

      <div className="space-y-4">
        {activeView === "transactions" ? (
          expenses.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className={`h-6 w-6 ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`} />
                    ) : (
                      <ArrowDownCircle className={`h-6 w-6 ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={`font-medium ${
                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Spending by Category</h3>
                <PieChart className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Chart coming soon</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Monthly Trend</h3>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Chart coming soon</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
