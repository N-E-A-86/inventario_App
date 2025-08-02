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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Recetas</h1>
        <AddRecipeForm />
      </div>
      {editingRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EditRecipeForm
            recipe={editingRecipe}
            onClose={() => setEditingRecipe(null)}
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="shadow-md rounded-lg p-6 flex flex-col hover:shadow-lg transition-shadow">
            <div className="flex-grow">
              <h2 className="text-2xl font-bold">{recipe.name}</h2>
              <p className="mt-2">Costo Total: <span className="font-bold text-green-600">${typeof recipe.totalCost === 'number' ? recipe.totalCost.toFixed(2) : '0.00'}</span></p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setEditingRecipe(recipe)} className="modern-button-edit">Editar</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(recipe.id)} className="modern-button modern-button-destructive">Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
