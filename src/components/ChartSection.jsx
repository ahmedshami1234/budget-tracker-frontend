import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer // ← This was missing!
  } from "recharts";
  
  const COLORS = ["#00C49F", "#FF4444"]; // Income: Greenish, Expense: Red


export default function ChartSection({ transactions = [] }) {
    if (!Array.isArray(transactions)) return null; // 💥 Prevents runtime crash
  
    const incomeTotal = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  
    const expenseTotal = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  
    const pieData = [
      { name: "Income", value: incomeTotal },
      { name: "Expenses", value: expenseTotal },
    ];
  
    const categoryMap = {};
    transactions.forEach((t) => {
      const category = t.category || "Other";
      if (!categoryMap[category]) {
        categoryMap[category] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        categoryMap[category].income += Number(t.amount);
      } else {
        categoryMap[category].expense += Number(t.amount);
      }
    });
  
    const barData = Object.keys(categoryMap).map((category) => ({
      category,
      income: categoryMap[category].income,
      expense: categoryMap[category].expense,
    }));
  
    return (
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-[#0e141b] mb-6">Visual Insights</h2>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-md font-semibold text-[#0e141b] mb-3">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
  
          <div>
            <h3 className="text-md font-semibold text-[#0e141b] mb-3">Transactions by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#00C49F" />
                <Bar dataKey="expense" fill="#FF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
  