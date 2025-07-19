import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import AddRecipeForm from "@/components/forms/AddRecipeForm";
import EditRecipeForm from "@/components/forms/EditRecipeForm";
// ...existing code...

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // ...existing code...
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "recipes"), (snapshot) => {
      const recipesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesData);
    });

    return () => unsubscribe();
  }, []);

 return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Recetas</h1>
        <AddRecipeForm />
      </div>
      {editingRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <EditRecipeForm
            recipe={editingRecipe}
            onClose={() => setEditingRecipe(null)}
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-lg p-4 flex flex-col">
            <div className="flex-grow">
              <h2 className="text-xl font-semibold">{recipe.name}</h2>
              <p className="text-gray-500">Costo Total: ${recipe.totalCost.toFixed(2)}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" size="sm" onClick={() => setEditingRecipe(recipe)}>Editar</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(recipe.id)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  async function handleDelete(id) {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta receta?")) {
      try {
        await deleteDoc(doc(db, "recipes", id));
      } catch (error) {
        console.error("Error removing recipe: ", error);
        alert("Hubo un error al eliminar la receta.");
      }
    }
  }
}
