import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

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
      alert("Error al actualizar la receta.");
    }
  }

 // ...existing code...
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow"
      aria-label="Editar receta"
    >
      <div>
        <label htmlFor="edit-name" className="block text-sm font-medium mb-1">Nombre</label>
        <input
          id="edit-name"
          className="border rounded px-3 py-2 w-full"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="edit-cost" className="block text-sm font-medium mb-1">Costo Total</label>
        <input
          id="edit-cost"
          type="number"
          step="0.01"
          className="border rounded px-3 py-2 w-full"
          value={totalCost}
          onChange={e => setTotalCost(e.target.value)}
          required
          min="0"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}