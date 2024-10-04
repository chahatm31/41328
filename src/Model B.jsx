import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PieChart, Pie, Cell } from "recharts";

// Sample data for snacks
const initialSnacks = [
  {
    id: 1,
    name: "Chips",
    category: "Salty",
    weight: "50g",
    price: 2.5,
    calories: 250,
    ingredients: "Potato, Salt",
    inStock: true,
  },
  // Add more snacks here...
];

export default function App() {
  const [snacks, setSnacks] = useState(initialSnacks);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [selected, setSelected] = useState([]);

  const filteredSnacks = useMemo(() => {
    return snacks
      .filter(
        (snack) =>
          (snack.name.toLowerCase().includes(filter.toLowerCase()) ||
            snack.ingredients.toLowerCase().includes(filter.toLowerCase())) &&
          (categoryFilter === "All" || snack.category === categoryFilter) &&
          (!inStockOnly || snack.inStock)
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
  }, [snacks, filter, categoryFilter, inStockOnly, sortConfig]);

  const handleAddSnack = (newSnack) => {
    setSnacks([...snacks, { id: Date.now(), ...newSnack }]);
  };

  const handleEditSnack = (id, updatedSnack) => {
    setSnacks(
      snacks.map((snack) =>
        snack.id === id ? { ...snack, ...updatedSnack } : snack
      )
    );
  };

  const handleDelete = () => {
    setSnacks(snacks.filter((snack) => !selected.includes(snack.id)));
    setSelected([]);
  };

  const handleToggleStock = () => {
    setSnacks(
      snacks.map((snack) =>
        selected.includes(snack.id)
          ? { ...snack, inStock: !snack.inStock }
          : snack
      )
    );
    setSelected([]);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const categories = [...new Set(snacks.map((s) => s.category))];
  const pieData = categories.map((cat) => ({
    name: cat,
    value: snacks.filter((s) => s.category === cat && s.inStock).length,
  }));

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Snack Inventory Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <Input
              placeholder="Search snacks or ingredients..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mb-2 sm:mb-0 sm:mr-2"
            />
            <Select onValueChange={setCategoryFilter}>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>
            <Checkbox checked={inStockOnly} onCheckedChange={setInStockOnly}>
              In Stock Only
            </Checkbox>
          </div>
          <div className="flex mb-4">
            <Select
              onValueChange={(key) =>
                setSortConfig({ key, direction: sortConfig.direction })
              }
            >
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="calories">Calories</SelectItem>
            </Select>
            <Button
              onClick={() =>
                setSortConfig({
                  ...sortConfig,
                  direction:
                    sortConfig.direction === "ascending"
                      ? "descending"
                      : "ascending",
                })
              }
            >
              Sort {sortConfig.direction === "ascending" ? "↑" : "↓"}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={selected.length === filteredSnacks.length}
                    onCheckedChange={() =>
                      setSelected(
                        selected.length === filteredSnacks.length
                          ? []
                          : filteredSnacks.map((s) => s.id)
                      )
                    }
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSnacks.map((snack) => (
                <TableRow key={snack.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(snack.id)}
                      onCheckedChange={() =>
                        setSelected(
                          selected.includes(snack.id)
                            ? selected.filter((id) => id !== snack.id)
                            : [...selected, snack.id]
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{snack.name}</TableCell>
                  <TableCell>{snack.category}</TableCell>
                  <TableCell>{snack.weight}</TableCell>
                  <TableCell>${snack.price}</TableCell>
                  <TableCell>{snack.calories}</TableCell>
                  <TableCell>{snack.inStock ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleEditSnack(snack.id, {
                          /* update fields */
                        })
                      }
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between">
            <Button onClick={handleDelete}>Delete Selected</Button>
            <Button onClick={handleToggleStock}>Toggle Stock</Button>
          </div>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx={200}
              cy={200}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </CardContent>
      </Card>
      {/* Here you would include a form component for adding new snacks */}
    </div>
  );
}
