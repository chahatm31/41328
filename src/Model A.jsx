import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Select,
  SelectItem,
} from "@/components/ui";
import { useDisclosure } from "@/hooks/use-disclosure";

const initialSnacks = [
  {
    id: 1,
    name: "Granola Bar",
    category: "Bars",
    weight: "40g",
    price: 1.5,
    calories: 190,
    ingredients: "oats, honey, nuts",
    inStock: true,
  },
  {
    id: 2,
    name: "Fruit and Nut Mix",
    category: "Nuts",
    weight: "50g",
    price: 2.0,
    calories: 250,
    ingredients: "dried fruits, almonds, cashews",
    inStock: true,
  },
  {
    id: 3,
    name: "Veggie Chips",
    category: "Chips",
    weight: "30g",
    price: 1.75,
    calories: 140,
    ingredients: "beetroot, sweet potato, sea salt",
    inStock: false,
  },
  {
    id: 4,
    name: "Protein Balls",
    category: "Health",
    weight: "25g",
    price: 2.5,
    calories: 110,
    ingredients: "protein powder, dates, cocoa",
    inStock: true,
  },
];

export default function App() {
  const [snacks, setSnacks] = useState(initialSnacks);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showInStock, setShowInStock] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const columns = useMemo(
    () => [
      { accessor: "id", header: "ID" },
      { accessor: "name", header: "Product Name" },
      { accessor: "category", header: "Category" },
      { accessor: "weight", header: "Weight" },
      { accessor: "price", header: "Price" },
      { accessor: "calories", header: "Calories" },
      { accessor: "inStock", header: "In Stock" },
    ],
    []
  );

  const filteredSnacks = useMemo(
    () =>
      snacks.filter(
        (snack) =>
          (snack.name.toLowerCase().includes(search.toLowerCase()) ||
            snack.ingredients.toLowerCase().includes(search.toLowerCase())) &&
          (filterCategory === "" || snack.category === filterCategory) &&
          (!showInStock || snack.inStock)
      ),
    [snacks, search, filterCategory, showInStock]
  );

  const sortedSnacks = useMemo(() => {
    return [...filteredSnacks].sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }, [filteredSnacks]);

  const handleSort = (column) => {
    // Here you would implement sorting logic for each column
    console.log(`Sort by ${column}`);
  };

  const addSnack = (newSnack) => {
    setSnacks((prev) => [
      ...prev,
      { id: Math.max(...prev.map((s) => s.id), 0) + 1, ...newSnack },
    ]);
    onClose();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <Input
          placeholder="Search by name or ingredients"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2 sm:mb-0 sm:mr-2"
        />
        <div className="flex space-x-2">
          <Select onValueChange={setFilterCategory}>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="Bars">Bars</SelectItem>
            <SelectItem value="Nuts">Nuts</SelectItem>
            <SelectItem value="Chips">Chips</SelectItem>
            <SelectItem value="Health">Health</SelectItem>
          </Select>
          <Button onClick={() => setShowInStock(!showInStock)}>
            {showInStock ? "Show All" : "In Stock Only"}
          </Button>
          <Button onClick={onOpen}>Add Snack</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.accessor}
              onClick={() => handleSort(column.accessor)}
            >
              {column.header}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {sortedSnacks.map((snack) => (
            <TableRow key={snack.id} onClick={() => setSelectedSnack(snack)}>
              <TableCell>{snack.id}</TableCell>
              <TableCell>{snack.name}</TableCell>
              <TableCell>{snack.category}</TableCell>
              <TableCell>{snack.weight}</TableCell>
              <TableCell>${snack.price.toFixed(2)}</TableCell>
              <TableCell>{snack.calories}</TableCell>
              <TableCell>{snack.inStock ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSnack && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{selectedSnack.name}</CardTitle>
            <CardDescription>{selectedSnack.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Weight: {selectedSnack.weight}</p>
            <p>Price: ${selectedSnack.price.toFixed(2)}</p>
            <p>Calories: {selectedSnack.calories}</p>
            <p>Ingredients: {selectedSnack.ingredients}</p>
            <p>In Stock: {selectedSnack.inStock ? "Yes" : "No"}</p>
          </CardContent>
        </Card>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => <AddSnackForm onClose={onClose} onSubmit={addSnack} />}
        </ModalContent>
      </Modal>
    </div>
  );
}

function AddSnackForm({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [calories, setCalories] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [inStock, setInStock] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      category,
      weight,
      price: parseFloat(price),
      calories: parseInt(calories),
      ingredients,
      inStock,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalHeader>Add New Snack</ModalHeader>
      <ModalBody>
        <div className="grid gap-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Label htmlFor="category">Category</Label>
          <Select id="category" onValueChange={setCategory}>
            <SelectItem value="Bars">Bars</SelectItem>
            <SelectItem value="Nuts">Nuts</SelectItem>
            <SelectItem value="Chips">Chips</SelectItem>
            <SelectItem value="Health">Health</SelectItem>
          </Select>
          {/* Add other fields similarly */}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button type="submit">Add Snack</Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </form>
  );
}
