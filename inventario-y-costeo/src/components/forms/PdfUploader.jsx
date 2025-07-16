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
    // 1. Normalize the extracted text: remove multiple spaces
    const text = rawText.replace(/\s+/g, ' ');
    console.log("Texto Normalizado:", text); // DEBUGGING

    // 2. Improved Regex to handle accents and more price variations
    const priceRegex = /([\w\sáéíóúÁÉÍÓÚñÑ]+?)\s*:?\s*\$\s*([\d.,]+)/g;
    let match;
    const updates = [];

    while ((match = priceRegex.exec(text)) !== null) {
      // 3. Normalize the item name from the PDF
      const itemName = match[1].trim();
      
      // 4. Normalize the price string (remove dots and commas)
      const priceString = match[2].replace(/[.,]/g, '');
      const itemPrice = parseFloat(priceString);
      
      if (!isNaN(itemPrice)) {
        updates.push({ name: itemName, price: itemPrice });
      }
    }
    
    console.log("Precios encontrados y parseados:", updates); // DEBUGGING

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
      // 5. Compare normalized names
      const itemToUpdate = allItems.find(item => 
        item.name.toLowerCase().replace(/\s+/g, ' ') === update.name.toLowerCase()
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
      <Button asChild variant="outline" disabled={isProcessing}>
        <label htmlFor="pdf-upload">
          {isProcessing ? "Procesando..." : "Actualizar Precios (PDF)"}
        </label>
      </Button>
    </>
  );
}
