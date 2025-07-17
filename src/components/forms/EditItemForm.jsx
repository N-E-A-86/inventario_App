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
        <Button variant="ghost" size="sm">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Artículo</DialogTitle>
          <DialogDescription>
            Modifica los detalles del artículo y haz clic en guardar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input id="name" value={editedItem.name} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Categoría</Label>
              <Input id="category" value={editedItem.category} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Cantidad</Label>
              <Input id="quantity" type="number" value={editedItem.quantity} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">Unidad</Label>
              <Input id="unit" value={editedItem.unit} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Precio</Label>
              <Input id="price" type="number" value={editedItem.price} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right">Proveedor</Label>
              <Input id="provider" value={editedItem.provider} onChange={handleChange} className="col-span-3" />
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
