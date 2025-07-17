import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddItemForm from "@/components/forms/AddItemForm";
import PdfUploader from "@/components/forms/PdfUploader";
import EditItemForm from "@/components/forms/EditItemForm";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInventory(items);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Inventario</h1>
        <div className="flex gap-2">
          <PdfUploader />
          <AddItemForm />
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Precio/Unidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell className="text-right">
                  <EditItemForm item={item} />
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  async function handleDelete(id) {
    if (window.confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
      try {
        await deleteDoc(doc(db, "inventory", id));
      } catch (error) {
        console.error("Error removing document: ", error);
        alert("Hubo un error al eliminar el artículo.");
      }
    }
  }
}
