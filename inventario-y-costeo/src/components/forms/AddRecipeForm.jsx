import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { convertToGramsOrMl } from "@/lib/conversions";
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

export default function AddRecipeForm() {
  const [open, setOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState([{ itemId: "", quantity: 0, unit: "" }]);

  useEffect(() => {
    const fetchInventory = async () => {
      const inventorySnapshot = await getDocs(collection(db, "inventory"));
      const items = inventorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventoryItems(items);
    };
    if (open) {
      fetchInventory();
    }
  }, [open]);

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { itemId: "", quantity: 0, unit: "" }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipeName || ingredients.some(ing => !ing.itemId || ing.quantity <= 0)) {
      alert("Por favor, complete todos los campos de la receta.");
      return;
    }

    try {
      let totalCost = 0;
      for (const ingredient of ingredients) {
        const inventoryItem = inventoryItems.find(item => item.id === ingredient.itemId);
        if (inventoryItem) {
          const ingredientQuantityInBaseUnit = convertToGramsOrMl(ingredient.quantity, ingredient.unit);
          const inventoryItemQuantityInBaseUnit = convertToGramsOrMl(inventoryItem.quantity, inventoryItem.unit);
          totalCost += (ingredientQuantityInBaseUnit / inventoryItemQuantityInBaseUnit) * inventoryItem.price;
        }
      }

      const recipeData = {
        name: recipeName,
        ingredients: ingredients.map(ing => ({
          itemId: ing.itemId,
          quantity: Number(ing.quantity),
          unit: ing.unit
        })),
        totalCost: totalCost,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "recipes"), recipeData);

      setRecipeName("");
      setIngredients([{ itemId: "", quantity: 0 }]);
      setOpen(false);
    } catch (error) {
      console.error("Error adding recipe: ", error);
      alert("Hubo un error al añadir la receta.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="modern-button">Añadir Receta</Button>
      </DialogTrigger>
      <DialogContent className="modern-dialog">
        <DialogHeader>
          <DialogTitle className="modern-dialog-title">Añadir Nueva Receta</DialogTitle>
          <DialogDescription className="text-gray-600">
            Rellena los detalles de la nueva receta.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipeName" className="text-right modern-label">Nombre</Label>
              <Input
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="col-span-3 modern-input"
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
                <Input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                  className="col-span-3 modern-input"
                  placeholder="Unidad"
                />
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
            <Button type="submit" className="modern-button">Guardar Receta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
