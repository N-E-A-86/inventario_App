import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown, X } from "lucide-react";

// Combobox component for selecting ingredients
function IngredientCombobox({ inventory, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          Seleccionar ingrediente...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0"
        style={{ zIndex: 9999, backgroundColor: 'white' }}
      >
        <Command>
          <CommandInput placeholder="Buscar ingrediente..." />
          <CommandList>
            <CommandEmpty>No se encontró el ingrediente.</CommandEmpty>
            <CommandGroup className="bg-white z-50">
              {inventory.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


export default function AddRecipeForm() {
  const [open, setOpen] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  // Fetch inventory for the combobox
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      setInventory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  // Recalculate total cost when ingredients change
  useEffect(() => {
    const cost = ingredients.reduce((acc, ing) => {
      const inventoryItem = inventory.find(item => item.id === ing.id);
      return acc + (inventoryItem ? inventoryItem.price * ing.quantity : 0);
    }, 0);
    setTotalCost(cost);
  }, [ingredients, inventory]);

  const handleAddIngredient = (item) => {
    if (!ingredients.some(ing => ing.id === item.id)) {
      setIngredients([...ingredients, { ...item, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (id, quantity) => {
    const newQuantity = Math.max(0, Number(quantity));
    setIngredients(
      ingredients.map(ing => (ing.id === id ? { ...ing, quantity: newQuantity } : ing))
    );
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipeName || ingredients.length === 0) {
      alert("Por favor, pon un nombre a la receta y añade al menos un ingrediente.");
      return;
    }
    try {
      await addDoc(collection(db, "recipes"), {
        name: recipeName,
        ingredients: ingredients.map(({ id, quantity }) => ({ inventoryId: id, quantity })),
        totalCost: totalCost,
      });
      setRecipeName("");
      setIngredients([]);
      setOpen(false);
    } catch (error) {
      console.error("Error adding recipe: ", error);
      alert("Hubo un error al crear la receta.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">Crear Receta</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">Crear Nueva Receta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6 px-4">
            <div className="grid grid-cols-4 items-center gap-4 mb-6">
              <Label htmlFor="name" className="text-right font-medium text-gray-700">Nombre</Label>
              <Input id="name" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} className="col-span-3" />
            </div>
            
            <h3 className="font-semibold mt-6 text-gray-800">Ingredientes</h3>
            <div className="mb-6">
              <IngredientCombobox inventory={inventory} onSelect={handleAddIngredient} />
            </div>

            <div className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2">
              {ingredients.map(ing => (
                <div key={ing.id} className="flex items-center gap-4 p-2 rounded-md bg-gray-50">
                  <span className="flex-1 font-medium text-gray-700">{ing.name}</span>
                  <Input
                    type="number"
                    className="w-24"
                    value={ing.quantity}
                    onChange={(e) => handleQuantityChange(ing.id, e.target.value)}
                  />
                  <span className="text-gray-600">{ing.unit}</span>
                  <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveIngredient(ing.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="text-right font-bold text-xl mt-6 text-gray-800 mb-6">
              Costo Total: <span className="text-green-600">${totalCost.toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter className="px-4 py-3 bg-gray-50 rounded-b-lg">
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Guardar Receta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
