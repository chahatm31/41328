import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Search, Filter, Plus } from "lucide-react";

const initialSnacks = [
  {
    id: 1,
    product_name: "Granola Bar",
    product_weight: "21g",
    price: 299,
    calories: 150,
    ingredients: ["Oats", "Honey", "Nuts", "Dried Fruits"],
    category: "Bars",
    in_stock: true,
  },
  {
    id: 2,
    product_name: "Fruit and Nut Mix",
    product_weight: "73g",
    price: 749,
    calories: 353,
    ingredients: [
      "Almonds",
      "Cashews",
      "Dried Cranberries",
      "Dried Blueberries",
    ],
    category: "Nuts",
    in_stock: true,
  },
  {
    id: 3,
    product_name: "Veggie Chips",
    product_weight: "28g",
    price: 279,
    calories: 130,
    ingredients: ["Sweet Potatoes", "Beets", "Kale", "Sea Salt"],
    category: "Chips",
    in_stock: false,
  },
  {
    id: 4,
    product_name: "Protein Balls",
    product_weight: "100g",
    price: 499,
    calories: 318,
    ingredients: ["Dates", "Almond Butter", "Protein Powder", "Chia Seeds"],
    category: "Protein",
    in_stock: true,
  },
];

const SnacksTable = ({ data, sortConfig, onSort, onRowClick }) => {
  const getSortIcon = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <Table className="w-full border-collapse">
      <TableHeader>
        <TableRow>
          {[
            "ID",
            "Product Name",
            "Category",
            "Product Weight",
            "Price",
            "Calories",
            "Ingredients",
            "In Stock",
          ].map((header) => (
            <TableHead
              key={header}
              className="p-2 text-left font-bold cursor-pointer hover:bg-gray-100"
              onClick={() => onSort(header.toLowerCase().replace(" ", "_"))}
            >
              <div className="flex items-center">
                {header}
                <ArrowUpDown className="ml-2 h-4 w-4" />
                {getSortIcon(header.toLowerCase().replace(" ", "_"))}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((snack) => (
          <TableRow
            key={snack.id}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => onRowClick(snack)}
          >
            <TableCell className="p-2">{snack.id}</TableCell>
            <TableCell className="p-2 font-medium">
              {snack.product_name}
            </TableCell>
            <TableCell className="p-2">
              <Badge variant="secondary">{snack.category}</Badge>
            </TableCell>
            <TableCell className="p-2">{snack.product_weight}</TableCell>
            <TableCell className="p-2">
              ${(snack.price / 100).toFixed(2)}
            </TableCell>
            <TableCell className="p-2">{snack.calories}</TableCell>
            <TableCell className="p-2">
              {snack.ingredients.map((ingredient, index) => (
                <Badge key={index} variant="outline" className="mr-1 mb-1">
                  {ingredient}
                </Badge>
              ))}
            </TableCell>
            <TableCell className="p-2">
              <Badge variant={snack.in_stock ? "success" : "destructive"}>
                {snack.in_stock ? "In Stock" : "Out of Stock"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const AddSnackForm = ({ onAddSnack, nextId }) => {
  const [newSnack, setNewSnack] = useState({
    product_name: "",
    product_weight: "",
    price: "",
    calories: "",
    ingredients: "",
    category: "",
    in_stock: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddSnack({
      ...newSnack,
      id: nextId,
      price: parseFloat(newSnack.price) * 100,
      calories: parseInt(newSnack.calories),
      ingredients: newSnack.ingredients.split(",").map((item) => item.trim()),
    });
    setNewSnack({
      product_name: "",
      product_weight: "",
      price: "",
      calories: "",
      ingredients: "",
      category: "",
      in_stock: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="product_name">Product Name</Label>
        <Input
          id="product_name"
          value={newSnack.product_name}
          onChange={(e) =>
            setNewSnack({ ...newSnack, product_name: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={newSnack.category}
          onChange={(e) =>
            setNewSnack({ ...newSnack, category: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="product_weight">Product Weight</Label>
        <Input
          id="product_weight"
          value={newSnack.product_weight}
          onChange={(e) =>
            setNewSnack({ ...newSnack, product_weight: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={newSnack.price}
          onChange={(e) => setNewSnack({ ...newSnack, price: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="calories">Calories</Label>
        <Input
          id="calories"
          type="number"
          value={newSnack.calories}
          onChange={(e) =>
            setNewSnack({ ...newSnack, calories: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
        <Input
          id="ingredients"
          value={newSnack.ingredients}
          onChange={(e) =>
            setNewSnack({ ...newSnack, ingredients: e.target.value })
          }
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          id="in_stock"
          type="checkbox"
          checked={newSnack.in_stock}
          onChange={(e) =>
            setNewSnack({ ...newSnack, in_stock: e.target.checked })
          }
        />
        <Label htmlFor="in_stock">In Stock</Label>
      </div>
      <Button type="submit">Add Snack</Button>
    </form>
  );
};

const App = () => {
  const [snacks, setSnacks] = useState(initialSnacks);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState(null);

  const nextId = useMemo(
    () => Math.max(...snacks.map((snack) => snack.id)) + 1,
    [snacks]
  );

  const filteredSnacks = useMemo(() => {
    return snacks.filter(
      (snack) =>
        (snack.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          snack.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchTerm.toLowerCase())
          )) &&
        (categoryFilter === "All" || snack.category === categoryFilter) &&
        (!showOnlyInStock || snack.in_stock)
    );
  }, [snacks, searchTerm, categoryFilter, showOnlyInStock]);

  const sortedSnacks = useMemo(() => {
    let sortableItems = [...filteredSnacks];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredSnacks, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const categories = ["All", ...new Set(snacks.map((snack) => snack.category))];

  const handleRowClick = (snack) => {
    setSelectedSnack(snack);
  };

  const handleAddSnack = (newSnack) => {
    setSnacks([...snacks, newSnack]);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <Card className="mb-8 shadow-lg">
        <CardHeader className="bg-primary text-white">
          <CardTitle className="text-3xl font-bold text-center">
            Snacks Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search by product name or ingredients"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2 border rounded"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Button
                variant={showOnlyInStock ? "default" : "outline"}
                onClick={() => setShowOnlyInStock(!showOnlyInStock)}
              >
                In Stock Only
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Snack
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Snack</DialogTitle>
                  </DialogHeader>
                  <AddSnackForm onAddSnack={handleAddSnack} nextId={nextId} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <SnacksTable
              data={sortedSnacks}
              sortConfig={sortConfig}
              onSort={requestSort}
              onRowClick={handleRowClick}
            />
          </div>
        </CardContent>
      </Card>

      {selectedSnack && (
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-secondary text-white">
            <CardTitle className="text-2xl font-bold">
              Selected Snack Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">
              {selectedSnack.product_name}
            </h3>
            <p>
              <strong>Category:</strong> {selectedSnack.category}
            </p>
            <p>
              <strong>Weight:</strong> {selectedSnack.product_weight}
            </p>
            <p>
              <strong>Price:</strong> ${(selectedSnack.price / 100).toFixed(2)}
            </p>
            <p>
              <strong>Calories:</strong> {selectedSnack.calories}
            </p>
            <p>
              <strong>Ingredients:</strong>{" "}
              {selectedSnack.ingredients.join(", ")}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedSnack.in_stock ? "In Stock" : "Out of Stock"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default App;
