import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddItemForm() {
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    price: 0,
    provider: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(newItem).some(val => val === "" || val === 0)) {
      alert("Por favor, rellena todos los campos.");
      return;
    }
    try {
      await addDoc(collection(db, "inventory"), {
        ...newItem,
        quantity: Number(newItem.quantity),
        price: Number(newItem.price),
      });
      setNewItem({ name: "", category: "", quantity: 0, unit: "", price: 0, provider: "" });
      setOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Hubo un error al añadir el artículo.");
    }
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.id]: e.target.value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">Añadir Artículo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">Añadir Nuevo Artículo</DialogTitle>
          <DialogDescription className="text-gray-600">
            Rellena los detalles del nuevo artículo de inventario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6 px-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium text-gray-700">Nombre</Label>
              <Input id="name" value={newItem.name} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right font-medium text-gray-700">Categoría</Label>
              <Input id="category" value={newItem.category} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right font-medium text-gray-700">Cantidad</Label>
              <Input id="quantity" type="number" value={newItem.quantity} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right font-medium text-gray-700">Unidad</Label>
              <Input id="unit" value={newItem.unit} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right font-medium text-gray-700">Precio</Label>
              <Input id="price" type="number" value={newItem.price} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right font-medium text-gray-700">Proveedor</Label>
              <Input id="provider" value={newItem.provider} onChange={handleChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter className="px-4 py-3 bg-gray-50 rounded-b-lg">
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Guardar Artículo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
