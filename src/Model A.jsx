import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";

// Mock data for categories
const categories = ["Chips", "Cookies", "Candy", "Drinks"];

function SnackForm({ onSubmit, defaultValues = {} }) {
  const { register, handleSubmit, reset } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("name", { required: true })}
        placeholder="Snack Name"
      />
      <Select {...register("category", { required: true })}>
        {categories.map((cat) => (
          <SelectItem key={cat} value={cat}>
            {cat}
          </SelectItem>
        ))}
      </Select>
      <Input {...register("weight")} placeholder="Weight" type="number" />
      <Input
        {...register("price")}
        placeholder="Price"
        type="number"
        step="0.01"
      />
      <Input {...register("calories")} placeholder="Calories" type="number" />
      <Input {...register("ingredients")} placeholder="Ingredients" />
      <Button type="submit">Submit</Button>
      <Button type="button" onClick={() => reset()}>
        Clear
      </Button>
    </form>
  );
}

function App() {
  const [snacks, setSnacks] = useState([]);
  const [filter, setFilter] = useState({ name: "", category: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  // Adding a new snack
  const addSnack = (newSnack) => {
    setSnacks((prev) => [...prev, { ...newSnack, id: Date.now() }]);
  };

  // Sorting function
  const sortedSnacks = useMemo(() => {
    let sortableSnacks = [...snacks];
    if (sortConfig !== null) {
      sortableSnacks.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableSnacks.filter(
      (snack) =>
        snack.name.toLowerCase().includes(filter.name.toLowerCase()) &&
        (filter.category === "" || snack.category === filter.category)
    );
  }, [snacks, filter, sortConfig]);

  // Request a sort with a certain key
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Snack</CardTitle>
        </CardHeader>
        <CardContent>
          <SnackForm onSubmit={addSnack} />
        </CardContent>
      </Card>

      <div className="mt-4 flex space-x-4">
        <Input
          placeholder="Filter by name"
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        />
        <Select
          onValueChange={(value) => setFilter({ ...filter, category: value })}
        >
          <SelectItem value="">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            {["Name", "Category", "Price", "Calories"].map((head) => (
              <TableHead
                key={head}
                onClick={() => requestSort(head.toLowerCase())}
              >
                {head}{" "}
                {sortConfig.key === head.toLowerCase()
                  ? sortConfig.direction === "ascending"
                    ? "↑"
                    : "↓"
                  : ""}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSnacks.map((snack) => (
            <TableRow key={snack.id}>
              <TableCell>{snack.name}</TableCell>
              <TableCell>{snack.category}</TableCell>
              <TableCell>{snack.price}</TableCell>
              <TableCell>{snack.calories}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default App;
