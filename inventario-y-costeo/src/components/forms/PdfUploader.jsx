import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

export default function PdfUploader() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Por favor, selecciona un archivo PDF.');
      return;
    }

    setIsProcessing(true);
    const fileReader = new FileReader();
    fileReader.onload = async function() {
      const typedarray = new Uint8Array(this.result);
      try {
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(' ');
        }
        await parseAndupdatePrices(fullText);
      } catch (error) {
        console.error('Error procesando el PDF:', error);
        alert('Hubo un error al procesar el PDF.');
      } finally {
        setIsProcessing(false);
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  const parseAndupdatePrices = async (rawText) => {
    const text = rawText.replace(/\s+/g, ' ');

    // A more robust regex to capture product names that may contain various characters
    // and prices that are clearly separated by a '$'.
    const priceRegex = /([A-Za-z0-9\sáéíóúÁÉÍÓÚñÑ.:-]+?)\s*\$(\s*[\d,.]+)/g;
    let match;
    const updates = [];

    while ((match = priceRegex.exec(text)) !== null) {
      let itemName = match[1].replace(/:$/, "").trim(); // Clean trailing colons and whitespace
      
      // Skip any matches that are clearly not items
      if (itemName.toLowerCase().includes("listado de prec")) continue;

      const priceString = match[2].replace(/[.,]/g, '').trim();
      const itemPrice = parseFloat(priceString);
      
      if (!isNaN(itemPrice) && itemName) {
        updates.push({ name: itemName, price: itemPrice });
      }
    }

    if (updates.length === 0) {
      alert("No se encontraron precios con el formato esperado en el PDF. Por favor, asegúrate de que el formato sea como 'Producto: $1.500'");
      return;
    }

    const batch = writeBatch(db);
    const inventoryRef = collection(db, 'inventory');
    let updatedCount = 0;

    // Firestore's `where` is case-sensitive. We need to fetch all items and compare in JS,
    // or ensure the names in the DB and PDF match exactly including case.
    // For now, we'll do a case-insensitive comparison in JS.
    const allItemsSnapshot = await getDocs(inventoryRef);
    const allItems = allItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    for (const update of updates) {
      // 5. Compare hyper-normalized names (lowercase, no spaces)
      const normalizedPdfName = update.name.toLowerCase().replace(/\s/g, '');
      const itemToUpdate = allItems.find(item => 
        item.name.toLowerCase().replace(/\s/g, '') === normalizedPdfName
      );

      if (itemToUpdate) {
        const docRef = allItemsSnapshot.docs.find(doc => doc.id === itemToUpdate.id).ref;
        batch.update(docRef, { price: update.price });
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      await batch.commit();
      alert(`${updatedCount} precios actualizados correctamente.`);
    } else {
      alert("No se encontraron productos en el inventario que coincidan con los del PDF.");
    }
  };

  return (
    <>
      <Input
        id="pdf-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="application/pdf"
        disabled={isProcessing}
      />
      <Button asChild variant="outline" disabled={isProcessing} className="bg-green-500 hover:bg-green-600 text-white">
        <label htmlFor="pdf-upload" className="cursor-pointer">
          {isProcessing ? "Procesando..." : "Actualizar Precios (PDF)"}
        </label>
      </Button>
    </>
  );
}
