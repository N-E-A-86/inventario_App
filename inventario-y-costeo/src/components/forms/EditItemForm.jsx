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

export default function EditItemForm({ item }) {
  const [open, setOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  const handleChange = (e) => {
    setEditedItem({ ...editedItem, [e.target.id]: e.target.value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">Editar Artículo</DialogTitle>
          <DialogDescription className="text-gray-600">
            Modifica los detalles del artículo y haz clic en guardar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6 px-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium text-gray-700">Nombre</Label>
              <Input id="name" value={editedItem.name} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right font-medium text-gray-700">Categoría</Label>
              <Input id="category" value={editedItem.category} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right font-medium text-gray-700">Cantidad</Label>
              <Input id="quantity" type="number" value={editedItem.quantity} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right font-medium text-gray-700">Unidad</Label>
              <Input id="unit" value={editedItem.unit} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right font-medium text-gray-700">Precio</Label>
              <Input id="price" type="number" value={editedItem.price} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right font-medium text-gray-700">Proveedor</Label>
              <Input id="provider" value={editedItem.provider} onChange={handleChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter className="px-4 py-3 bg-gray-50 rounded-b-lg">
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
