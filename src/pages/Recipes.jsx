import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import AddRecipeForm from "@/components/forms/AddRecipeForm";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{recipe.name}</h2>
            <p className="text-gray-500">Costo Total: ${recipe.totalCost.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
