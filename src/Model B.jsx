// App.jsx
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const initialSnacks = [
  {
    id: 1,
    name: "Granola Bar",
    category: "Bars",
    weight: "25g",
    price: 1.99,
    calories: 120,
    ingredients: "Oats, Honey, Nuts",
    inStock: true,
  },
  {
    id: 2,
    name: "Fruit and Nut Mix",
    category: "Mixes",
    weight: "50g",
    price: 3.49,
    calories: 250,
    ingredients: "Dried Fruits, Nuts",
    inStock: true,
  },
  {
    id: 3,
    name: "Veggie Chips",
    category: "Chips",
    weight: "30g",
    price: 2.5,
    calories: 140,
    ingredients: "Vegetables, Salt",
    inStock: false,
  },
  {
    id: 4,
    name: "Protein Balls",
    category: "Supplements",
    weight: "40g",
    price: 2.99,
    calories: 180,
    ingredients: "Protein Powder, Chocolate",
    inStock: true,
  },
];

function App() {
  const [snacks, setSnacks] = useState(initialSnacks);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showInStock, setShowInStock] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = [
    "ID",
    "Product Name",
    "Category",
    "Weight",
    "Price",
    "Calories",
    "Ingredients",
    "In Stock",
  ];

  const filteredSnacks = useMemo(() => {
    return snacks.filter(
      (snack) =>
        (snack.name.toLowerCase().includes(search.toLowerCase()) ||
          snack.ingredients.toLowerCase().includes(search.toLowerCase())) &&
        (!filterCategory || snack.category === filterCategory) &&
        (!showInStock || snack.inStock)
    );
  }, [snacks, search, filterCategory, showInStock]);

  const handleSort = (column) => {
    setSnacks(
      [...snacks].sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      })
    );
  };

  const addSnack = (newSnack) => {
    newSnack.id =
      snacks.length > 0 ? Math.max(...snacks.map((s) => s.id)) + 1 : 1;
    setSnacks([...snacks, newSnack]);
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Input
        placeholder="Search snacks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <select
        onChange={(e) => setFilterCategory(e.target.value)}
        value={filterCategory}
        className="p-2 mb-4 border rounded"
      >
        <option value="">All Categories</option>
        {[...new Set(snacks.map((s) => s.category))].map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <Checkbox checked={showInStock} onCheckedChange={setShowInStock}>
        Only In Stock
      </Checkbox>

      <Table>
        <TableCaption>A list of your snacks inventory.</TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col}
                onClick={() => handleSort(col.toLowerCase().replace(" ", ""))}
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSnacks.map((snack) => (
            <TableRow key={snack.id} onClick={() => setSelectedSnack(snack)}>
              {columns.map((col) => (
                <TableCell key={`${snack.id}-${col}`}>
                  {snack[col.toLowerCase().replace(" ", "")]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSnack && (
        <div className="mt-4">
          <h2 className="text-xl">Details for {selectedSnack.name}</h2>
          <p>Price: ${selectedSnack.price}</p>
          {/* Add more details as needed */}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4">Add New Snack</Button>
        </DialogTrigger>
        <SnackForm onSubmit={addSnack} />
      </Dialog>
    </div>
  );
}

function SnackForm({ onSubmit }) {
  const [snack, setSnack] = useState({ inStock: true });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSnack((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <DialogContent>
      {["name", "category", "weight", "price", "calories", "ingredients"].map(
        (field) => (
          <div key={field} className="mb-4">
            <Label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Label>
            <Input
              id={field}
              name={field}
              value={snack[field]}
              onChange={handleChange}
            />
          </div>
        )
      )}
      <Checkbox
        id="inStock"
        name="inStock"
        checked={snack.inStock}
        onCheckedChange={handleChange}
      >
        In Stock
      </Checkbox>
      <Button type="submit" onClick={() => onSubmit(snack)}>
        Add Snack
      </Button>
    </DialogContent>
  );
}

export default App;
