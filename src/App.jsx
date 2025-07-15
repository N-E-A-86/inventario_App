import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Inventory from "./pages/Inventory";
import Recipes from "./pages/Recipes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Inventory />} />
        <Route path="recipes" element={<Recipes />} />
      </Route>
    </Routes>
  );
}

export default App;
