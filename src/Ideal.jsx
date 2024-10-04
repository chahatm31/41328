import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const initialSnacks = [
  {
    id: 1,
    name: "Granola Bar",
    category: "Bars",
    weight: "50g",
    price: 1.99,
    calories: 200,
    ingredients: "Oats, Honey, Nuts, Dried Fruit",
    inStock: true,
  },
  // ... (other snacks)
];

const categories = ["Bars", "Mixes", "Chips", "Balls"];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function App() {
  const [snacks, setSnacks] = useState(initialSnacks);
  const [filteredSnacks, setFilteredSnacks] = useState(snacks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [selectedSnacks, setSelectedSnacks] = useState([]);

  useEffect(() => {
    let result = snacks;

    if (searchTerm) {
      result = result.filter(
        (snack) =>
          snack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          snack.ingredients.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((snack) => snack.category === selectedCategory);
    }

    if (showInStockOnly) {
      result = result.filter((snack) => snack.inStock);
    }

    result = result.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredSnacks(result);
    setCurrentPage(1);
  }, [snacks, searchTerm, selectedCategory, showInStockOnly, sortColumn, sortDirection]);

  const handleAddSnack = (newSnack) => {
    const nextId = Math.max(...snacks.map((s) => s.id)) + 1;
    setSnacks([...snacks, { ...newSnack, id: nextId }]);
    setIsAddDialogOpen(false);
  };

  const handleEditSnack = (editedSnack) => {
    setSnacks(snacks.map((snack) => snack.id === editedSnack.id ? editedSnack : snack));
    setIsEditDialogOpen(false);
    setSelectedSnack(null);
  };

  const handleBulkDelete = () => {
    setSnacks(snacks.filter((snack) => !selectedSnacks.includes(snack.id)));
    setSelectedSnacks([]);
  };

  const handleBulkToggleStock = () => {
    setSnacks(snacks.map((snack) => 
      selectedSnacks.includes(snack.id) ? { ...snack, inStock: !snack.inStock } : snack
    ));
    setSelectedSnacks([]);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSnacks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const categoryData = categories.map(category => ({
    name: category,
    value: snacks.filter(snack => snack.category === category).length
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Snack Inventory Management</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          placeholder="Search by name or ingredients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center">
          <Checkbox
            id="inStock"
            checked={showInStockOnly}
            onCheckedChange={setShowInStockOnly}
          />
          <Label htmlFor="inStock" className="ml-2">
            In Stock Only
          </Label>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Snack</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Snack</DialogTitle>
            </DialogHeader>
            <AddSnackForm onAdd={handleAddSnack} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Select value={sortColumn} onValueChange={setSortColumn}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="calories">Calories</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortDirection} onValueChange={setSortDirection}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
        {selectedSnacks.length > 0 && (
          <>
            <Button onClick={handleBulkDelete}>Delete Selected</Button>
            <Button onClick={handleBulkToggleStock}>Toggle Stock</Button>
          </>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg shadow mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Calories</TableHead>
              <TableHead>Ingredients</TableHead>
              <TableHead>In Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((snack) => (
              <TableRow key={snack.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedSnacks.includes(snack.id)}
                    onCheckedChange={(checked) => {
                      setSelectedSnacks(
                        checked
                          ? [...selectedSnacks, snack.id]
                          : selectedSnacks.filter((id) => id !== snack.id)
                      );
                    }}
                  />
                </TableCell>
                <TableCell>{snack.id}</TableCell>
                <TableCell>{snack.name}</TableCell>
                <TableCell>{snack.category}</TableCell>
                <TableCell>{snack.weight}</TableCell>
                <TableCell>${snack.price.toFixed(2)}</TableCell>
                <TableCell>{snack.calories}</TableCell>
                <TableCell>{snack.ingredients}</TableCell>
                <TableCell>{snack.inStock ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setSelectedSnack(snack);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredSnacks.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Snack</DialogTitle>
          </DialogHeader>
          {selectedSnack && (
            <EditSnackForm snack={selectedSnack} onEdit={handleEditSnack} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p>{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
}

function AddSnackForm({ onAdd }) {
  const [newSnack, setNewSnack] = useState({
    name: "",
    category: "",
    weight: "",
    price: "",
    calories: "",
    ingredients: "",
    inStock: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSnack((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...newSnack,
      price: parseFloat(newSnack.price),
      calories: parseInt(newSnack.calories),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={newSnack.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select name="category" value={newSnack.category} onValueChange={(value) => setNewSnack((prev) => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="weight">Weight</Label>
        <Input
          id="weight"
          name="weight"
          value={newSnack.weight}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={newSnack.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="calories">Calories</Label>
        <Input
          id="calories"
          name="calories"
          type="number"
          value={newSnack.calories}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="ingredients">Ingredients</Label>
        <Input
          id="ingredients"
          name="ingredients"
          value={newSnack.ingredients}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center">
        <Checkbox
          id="inStock"
          checked={newSnack.inStock}
          onCheckedChange={(checked) =>
            setNewSnack((prev) => ({ ...prev, inStock: checked }))
          }
        />
        <Label htmlFor="inStock" className="ml-2">
          In Stock
        </Label>
      </div>
      <Button type="submit">Add Snack</Button>
    </form>
  );
}

function EditSnackForm({ snack, onEdit }) {
  const [editedSnack, setEditedSnack] = useState(snack);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSnack((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit({
      ...editedSnack,
      price: parseFloat(editedSnack.price),
      calories: parseInt(editedSnack.calories),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={editedSnack.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          name="category"
          value={editedSnack.category}
          onValueChange={(value) =>
            setEditedSnack((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="weight">Weight</Label>
        <Input
          id="weight"
          name="weight"
          value={editedSnack.weight}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={editedSnack.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="calories">Calories</Label>
        <Input
          id="calories"
          name="calories"
          type="number"
          value={editedSnack.calories}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="ingredients">Ingredients</Label>
        <Input
          id="ingredients"
          name="ingredients"
          value={editedSnack.ingredients}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center">
        <Checkbox
          id="inStock"
          checked={editedSnack.inStock}
          onCheckedChange={(checked) =>
            setEditedSnack((prev) => ({ ...prev, inStock: checked }))
          }
        />
        <Label htmlFor="inStock" className="ml-2">
          In Stock
        </Label>
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}

function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4">
      <ul className="flex space-x-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <Button
              onClick={() => paginate(number)}
              className={`px-3 py-1 ${
                currentPage === number
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } rounded hover:bg-blue-600 hover:text-white transition-colors duration-200`}
            >
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}