import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
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
import "@/modern-theme.css";

export default function EditItemForm({ item }) {
  const [open, setOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  async function handleSubmit(e) {
    e.preventDefault();
    const { name, category, quantity, unit, price, provider } = editedItem;
    if (!name || !category || !quantity || !unit || !price || !provider) {
      alert("Por favor, complete todos los campos");
      return;
    }
    if (isNaN(quantity) || isNaN(price)) {
      alert("Por favor, ingrese un número válido para la cantidad y el precio");
      return;
    }
    const itemRef = doc(db, "inventory", item.id);
    try {
      await updateDoc(itemRef, {
        ...editedItem,
        quantity: Number(editedItem.quantity),
        price: Number(editedItem.price),
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Hubo un error al actualizar el artículo.");
    }
  }

  function handleChange(e) {
    const { id, value } = e.target;
    if (id === "quantity" || id === "price") {
      if (isNaN(value)) {
        alert("Por favor, ingrese un número válido");
        return;
      }
    }
    setEditedItem({ ...editedItem, [id]: value });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Editar Artículo</DialogTitle>
          <DialogDescription>
            Realice cambios en el artículo aquí. Haga clic en guardar cuando haya terminado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={editedItem.name}
                onChange={handleChange}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoría
              </Label>
              <Input
                id="category"
                value={editedItem.category}
                onChange={handleChange}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Cantidad
              </Label>
              <Input
                id="quantity"
                type="number"
                value={editedItem.quantity}
                onChange={handleChange}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unidad
              </Label>
              <Input
                id="unit"
                value={editedItem.unit}
                onChange={handleChange}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Precio
              </Label>
              <Input
                id="price"
                type="number"
                value={editedItem.price}
                onChange={handleChange}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right">
                Proveedor
              </Label>
              <Input
                id="provider"
                value={editedItem.provider}
                onChange={handleChange}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
