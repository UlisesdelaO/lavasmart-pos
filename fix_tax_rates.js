function corregirTasasImpuesto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const itemsSheet = ss.getSheetByName('Items');
  const itemsData = itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 9).getValues();
  
  itemsData.forEach((item, index) => {
    const precio = item[2];
    const categoria = item[8];
    const taxRate = item[3];
    
    if (precio > 0 && categoria !== 'Descuentos' && categoria !== 'Promociones' && taxRate !== 0.16) {
      itemsSheet.getRange(index + 2, 4).setValue(0.16);
      console.log('Corregido: ' + item[0] + ' - ' + item[1] + ' -> 0.16');
    }
  });
  
  return 'Tasas corregidas';
}
