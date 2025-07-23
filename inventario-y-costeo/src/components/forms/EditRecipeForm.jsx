import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditRecipeForm({ recipe, onClose }) {
  const [name, setName] = useState(recipe.name);
  const [totalCost, setTotalCost] = useState(recipe.totalCost);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "recipes", recipe.id), {
        name,
        totalCost: parseFloat(totalCost),
      });
      onClose();
    } catch (error) {
      console.error("Error al actualizar la receta:", error);
      alert("Error al actualizar la receta.");
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">Editar Receta</DialogTitle>
          <DialogDescription className="text-gray-600">
            Modifica los detalles de la receta y haz clic en guardar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6 px-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right font-medium text-gray-700">Nombre</Label>
              <Input
                id="edit-name"
                className="col-span-3"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-cost" className="text-right font-medium text-gray-700">Costo Total</Label>
              <Input
                id="edit-cost"
                type="number"
                step="0.01"
                className="col-span-3"
                value={totalCost}
                onChange={e => setTotalCost(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>
          <DialogFooter className="px-4 py-3 bg-gray-50 rounded-b-lg">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
