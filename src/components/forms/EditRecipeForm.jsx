import { useState, useEffect } from "react";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { convertToBaseUnit } from "@/lib/conversions";
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
import "@/modern-theme.css";

export default function EditRecipeForm({ recipe, onClose }) {
  const [name, setName] = useState(recipe.name);
  const [ingredients, setIngredients] = useState(recipe.ingredients || []);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const inventorySnapshot = await getDocs(collection(db, "inventory"));
      const items = inventorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventoryItems(items);
    };
    fetchInventory();
  }, []);

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { itemId: "", quantity: 0 }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || ingredients.some(ing => !ing.itemId || ing.quantity <= 0)) {
      alert("Por favor, complete todos los campos de la receta.");
      return;
    }

    try {
      let totalCost = 0;
      for (const ingredient of ingredients) {
        const inventoryItem = inventoryItems.find(item => item.id === ingredient.itemId);
        if (inventoryItem) {
          const ingredientQuantityInBaseUnit = convertToBaseUnit(ingredient.quantity, ingredient.unit, inventoryItem.type);
          const inventoryItemQuantityInBaseUnit = convertToBaseUnit(inventoryItem.quantity, inventoryItem.unit, inventoryItem.type);
          if (inventoryItemQuantityInBaseUnit > 0) {
            totalCost += (ingredientQuantityInBaseUnit / inventoryItemQuantityInBaseUnit) * inventoryItem.price;
          }
        }
      }

      await updateDoc(doc(db, "recipes", recipe.id), {
        name,
        ingredients: ingredients.map(ing => ({
          itemId: ing.itemId,
          quantity: Number(ing.quantity),
          unit: ing.unit
        })),
        totalCost: totalCost,
      });
      onClose();
    } catch (error) {
      console.error("Error al actualizar la receta:", error);
      alert("Error al actualizar la receta.");
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="modern-dialog max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="modern-dialog-title">Editar Receta</DialogTitle>
          <DialogDescription className="text-gray-600">
            Modifica los detalles de la receta y haz clic en guardar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6 px-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right modern-label">Nombre</Label>
              <Input
                id="edit-name"
                className="col-span-3 modern-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <h4 className="text-lg font-semibold mt-4 modern-label">Ingredientes</h4>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-12 items-center gap-2">
                <select
                  value={ingredient.itemId}
                  onChange={(e) => handleIngredientChange(index, "itemId", e.target.value)}
                  className="col-span-6 modern-input"
                >
                  <option value="">Seleccionar ingrediente</option>
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                  className="col-span-3 modern-input"
                  placeholder="Cantidad"
                />
                <select
                  value={ingredient.unit}
                  onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                  className="col-span-3 modern-input"
                >
                  <option value="">Unidad</option>
                  <optgroup label="Peso">
                    <option value="gr">gr</option>
                    <option value="kg">kg</option>
                    <option value="oz">oz</option>
                    <option value="lb">lb</option>
                  </optgroup>
                  <optgroup label="Volumen">
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                  </optgroup>
                  <optgroup label="Unidades">
                    <option value="un">un</option>
                  </optgroup>
                </select>
                <Button type="button" variant="destructive" onClick={() => removeIngredient(index)} className="col-span-2">
                  X
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addIngredient} className="mt-2 modern-button">
              Añadir Ingrediente
            </Button>
          </div>
          <DialogFooter className="px-4 py-3 bg-gray-50 rounded-b-lg">
            <Button type="button" variant="outline" onClick={onClose} className="modern-button-cancel">Cancelar</Button>
            <Button type="submit" className="modern-button">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
