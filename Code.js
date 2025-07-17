/**
 * Aplicación POS Lavasmart con Google Sheets como base de datos
 * @author Lavasmart
 */

/**
 * Función que se ejecuta cuando se abre la aplicación web
 * @param {Object} e - Objeto de evento con parámetros de URL
 * @return {HtmlOutput} Página HTML renderizada
 */
function doGet(e) {
  try {
    // Verificar si hay parámetros
    const params = e ? e.parameter : {};
    let template;
    
    // Elegir plantilla según el modo
    if (params.mode === 'reports') {
      template = HtmlService.createTemplateFromFile('reports');
      return template
        .evaluate()
        .setTitle('POS Lavasmart')
        .setFaviconUrl('https://www.google.com/images/branding/product/ico/googleg_lodp.ico');
    } else if (params.mode === 'calendar') {
      // Llamar a doCalendar de Calendar.js
      return doCalendar();
    } else {
      template = HtmlService.createTemplateFromFile('index');
    return template
        .evaluate()
        .setTitle('POS Lavasmart')
        .setFaviconUrl('https://www.google.com/images/branding/product/ico/googleg_lodp.ico');
    }
  } catch (error) {
    Logger.log("Error en doGet: " + error.message);
    return HtmlService.createHtmlOutput(`<h1>Error</h1><p>${error.message}</p>`);
  }
}

/**
 * Incluye archivos HTML en la plantilla principal
 * @param {string} filename - Nombre del archivo a incluir
 * @return {string} Contenido del archivo HTML
 */
function include(filename) {
  try {
    var content = HtmlService.createHtmlOutputFromFile(filename).getContent();
    if (!content || content.trim() === '') {
      return `<div style='color:red;font-weight:bold;'>[Error: El archivo '${filename}' está vacío o no se pudo cargar]</div>`;
    }
    return content;
  } catch (e) {
    return `<div style='color:red;font-weight:bold;'>[Error: No se pudo incluir '${filename}': ${e.message}]</div>`;
  }
}

/**
 * Obtiene los datos de productos y ventas desde las hojas de cálculo
 * @return {Object} Objeto con los datos de productos y ventas
 */
function getData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const itemsSheet = ss.getSheetByName("Items");
    const salesSheet = ss.getSheetByName("Sales");
    
    if (!itemsSheet || !salesSheet) {
      throw new Error("No se encontraron las hojas necesarias");
    }
    
    const result = {};
    
    // Número de columnas a leer para los productos (SKU, descripción, precio, tasa impuesto, imagen, tiempo, nombre de archivo, precio ideal, categoría)
    const ITEMS_COLUMNS = 9;
    
    // Obtener datos solo si hay filas disponibles
    const itemsLastRow = itemsSheet.getLastRow();
    if (itemsLastRow > 1) {
      result.items = itemsSheet.getRange(2, 1, itemsLastRow - 1, ITEMS_COLUMNS).getValues();
    } else {
      result.items = [];
    }
    
    // Obtener ventas solo si hay filas disponibles
    const salesLastRow = salesSheet.getLastRow();
    if (salesLastRow > 1) {
      result.sales = salesSheet.getRange(2, 1, salesLastRow - 1, ITEMS_COLUMNS).getValues();
    } else {
      result.sales = [];
    }
    
    return result;
  } catch (error) {
    Logger.log("Error en getData: " + error.message);
    return { error: error.message, items: [], sales: [] };
  }
}

/**
 * Guarda los datos de una venta en las hojas correspondientes
 * @param {string} data - Cadena JSON con los datos de la orden y el pago
 * @return {Object} Resultado de la operación
 */
function setData(data) {
  try {
    const importedData = JSON.parse(data);
    
    if (!importedData.order || !importedData.payment) {
      throw new Error("Formato de datos incorrecto");
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const salesSheet = ss.getSheetByName("Sales");
    const paymentsSheet = ss.getSheetByName("Payments");
    
    if (!salesSheet || !paymentsSheet) {
      throw new Error("No se encontraron las hojas necesarias");
    }
    
    // Verificar si el número de factura ya existe
    const invoiceNumber = importedData.order[0][1]; // El número de factura está en la segunda columna
    const salesData = salesSheet.getDataRange().getValues();
    const paymentsData = paymentsSheet.getDataRange().getValues();
    
    const existsInSales = salesData.some(row => row[1] === invoiceNumber);
    const existsInPayments = paymentsData.some(row => row[1] === invoiceNumber);
    
    if (existsInSales || existsInPayments) {
      throw new Error("El número de factura ya existe. Por favor, intente nuevamente.");
    }
    
    // Guardar líneas de la orden en la hoja "Sales"
    const orderLength = importedData.order.length;
    if (orderLength > 0) {
      const salesRange = salesSheet.getRange(salesSheet.getLastRow() + 1, 1, orderLength, 6);
      salesRange.setValues(importedData.order);
    }
    
    // Guardar información del pago en la hoja "Payments"
    if (importedData.payment.length > 0) {
      const paymentColumns = importedData.payment[0].length;
      const paymentRange = paymentsSheet.getRange(paymentsSheet.getLastRow() + 1, 1, 1, paymentColumns);
      paymentRange.setValues(importedData.payment);
    }
    
    return { success: true };
  } catch (error) {
    Logger.log("Error en setData: " + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Genera un reporte de ventas para un período específico
 * @param {string} fechaInicio - Fecha de inicio en formato YYYY-MM-DD
 * @param {string} fechaFin - Fecha de fin en formato YYYY-MM-DD
 * @return {Object} Datos del reporte y estadísticas
 */
function generarReportePeriodo(fechaInicio, fechaFin) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const salesSheet = ss.getSheetByName("Sales");
    const paymentsSheet = ss.getSheetByName("Payments");
    
    if (!salesSheet || !paymentsSheet) {
      throw new Error("No se encontraron las hojas necesarias");
    }
    
    // Convertir fechas de texto a objetos Date
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    
    // Validar fechas
    if (isNaN(fechaInicioObj.getTime()) || isNaN(fechaFinObj.getTime())) {
      throw new Error("Formato de fecha inválido. Use YYYY-MM-DD");
    }
    
    // Ajustar fecha final para incluir todo el día
    fechaFinObj.setHours(23, 59, 59, 999);
    
    // Obtener datos de ventas
    const salesData = salesSheet.getDataRange().getValues();
    const paymentsData = paymentsSheet.getDataRange().getValues();
    
    // Filtrar por rango de fechas
    const ventasFiltradas = salesData.filter((row, index) => {
      if (index === 0) return false; // Excluir encabezados
      
      const fechaVenta = new Date(row[0]);
      return fechaVenta >= fechaInicioObj && fechaVenta <= fechaFinObj;
    });
    
    const pagosFiltrados = paymentsData.filter((row, index) => {
      if (index === 0) return false; // Excluir encabezados
      
      const fechaPago = new Date(row[0]);
      return fechaPago >= fechaInicioObj && fechaPago <= fechaFinObj;
    });
    
    // Generar estadísticas
    const estadisticas = calcularEstadisticas(ventasFiltradas, pagosFiltrados);
    
    return {
      success: true,
      periodo: {
        inicio: fechaInicio,
        fin: fechaFin
      },
      ventas: ventasFiltradas,
      pagos: pagosFiltrados,
      estadisticas: estadisticas
    };
  } catch (error) {
    Logger.log("Error en generarReportePeriodo: " + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Calcula estadísticas basadas en datos de ventas y pagos
 * @param {Array} ventas - Datos de ventas
 * @param {Array} pagos - Datos de pagos
 * @return {Object} Estadísticas calculadas
 */
function calcularEstadisticas(ventas, pagos) {
  const resultado = {
    totalVentas: 0,
    totalImpuestos: 0,
    totalIngresos: 0,
    promedioVenta: 0,
    porMetodoPago: {
      efectivo: 0,
      tarjeta: 0
    },
    productosMasVendidos: [],
    ventasPorDia: {}
  };
  
  // Calcular totales
  let conteoProductos = {};
  
  ventas.forEach(venta => {
    // Sumar montos
    const cantidad = parseFloat(venta[3]) || 0;
    const precio = parseFloat(venta[4]) || 0;
    const impuesto = parseFloat(venta[5]) || 0;
    
    resultado.totalVentas += cantidad * precio;
    resultado.totalImpuestos += impuesto;
    
    // Contar productos
    const sku = venta[2];
    if (sku) {
      if (!conteoProductos[sku]) {
        conteoProductos[sku] = 0;
      }
      conteoProductos[sku] += cantidad;
    }
    
    // Ventas por día
    if (venta[0]) {
      const fecha = Utilities.formatDate(new Date(venta[0]), 'GMT-6', 'yyyy-MM-dd');
      if (!resultado.ventasPorDia[fecha]) {
        resultado.ventasPorDia[fecha] = 0;
      }
      resultado.ventasPorDia[fecha] += cantidad * precio;
    }
  });
  
  // Calcular total de ingresos
  pagos.forEach(pago => {
    const monto = parseFloat(pago[2]) || 0;
    resultado.totalIngresos += monto;
    
    // Contar por método de pago
    const metodoPago = pago[3];
    if (metodoPago === 'cash') {
      resultado.porMetodoPago.efectivo += monto;
    } else if (metodoPago === 'credit') {
      resultado.porMetodoPago.tarjeta += monto;
    }
  });
  
  // Calcular promedio de venta
  if (pagos.length > 0) {
    resultado.promedioVenta = resultado.totalIngresos / pagos.length;
  }
  
  // Obtener productos más vendidos
  resultado.productosMasVendidos = Object.entries(conteoProductos)
    .map(([sku, cantidad]) => ({ sku, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5); // Top 5
  
  return resultado;
}

/**
 * Crea una hoja de reportes mensual
 * @param {number} mes - Mes (1-12)
 * @param {number} anio - Año (4 dígitos)
 * @return {Object} Resultado y URL de la hoja
 */
function crearReporteMensual(mes, anio) {
  try {
    // Validar parámetros
    mes = parseInt(mes);
    anio = parseInt(anio);
    
    if (isNaN(mes) || mes < 1 || mes > 12 || isNaN(anio) || anio < 2000) {
      throw new Error("Mes o año inválido");
    }
    
    // Convertir a formato de 2 dígitos para el mes
    const mesStr = mes.toString().padStart(2, '0');
    
    // Crear fechas para el rango del mes
    const fechaInicio = `${anio}-${mesStr}-01`;
    
    // Obtener último día del mes
    const ultimoDia = new Date(anio, mes, 0).getDate();
    const fechaFin = `${anio}-${mesStr}-${ultimoDia}`;
    
    // Generar reporte
    const reporte = generarReportePeriodo(fechaInicio, fechaFin);
    
    if (!reporte.success) {
      throw new Error(reporte.error);
    }
    
    // Crear hoja para el reporte
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const nombreHoja = `Reporte_${anio}_${mesStr}`;
    
    // Verificar si ya existe la hoja
    let reporteSheet = ss.getSheetByName(nombreHoja);
    if (reporteSheet) {
      reporteSheet.clear();
    } else {
      reporteSheet = ss.insertSheet(nombreHoja);
    }
    
    // Formatear hoja
    reporteSheet.setFrozenRows(2);
    
    // Agregar título
    reporteSheet.getRange(1, 1, 1, 5).merge();
    reporteSheet.getRange(1, 1).setValue(`REPORTE MENSUAL: ${mes}/${anio}`).setFontWeight("bold").setHorizontalAlignment("center");
    
    // Agregar estadísticas
    reporteSheet.getRange(3, 1).setValue("Total Ventas:");
    reporteSheet.getRange(3, 2).setValue(reporte.estadisticas.totalVentas);
    
    reporteSheet.getRange(4, 1).setValue("Total Impuestos:");
    reporteSheet.getRange(4, 2).setValue(reporte.estadisticas.totalImpuestos);
    
    reporteSheet.getRange(5, 1).setValue("Total Ingresos:");
    reporteSheet.getRange(5, 2).setValue(reporte.estadisticas.totalIngresos);
    
    reporteSheet.getRange(6, 1).setValue("Promedio por Venta:");
    reporteSheet.getRange(6, 2).setValue(reporte.estadisticas.promedioVenta);
    
    reporteSheet.getRange(7, 1).setValue("Ventas en Efectivo:");
    reporteSheet.getRange(7, 2).setValue(reporte.estadisticas.porMetodoPago.efectivo);
    
    reporteSheet.getRange(8, 1).setValue("Ventas con Tarjeta:");
    reporteSheet.getRange(8, 2).setValue(reporte.estadisticas.porMetodoPago.tarjeta);
    
    // Aplicar formato de moneda
    reporteSheet.getRange(3, 2, 8, 1).setNumberFormat("$#,##0.00");
    
    // Agregar productos más vendidos
    reporteSheet.getRange(10, 1).setValue("PRODUCTOS MÁS VENDIDOS:").setFontWeight("bold");
    reporteSheet.getRange(11, 1).setValue("SKU");
    reporteSheet.getRange(11, 2).setValue("Cantidad");
    
    // Llenar datos de productos más vendidos
    reporte.estadisticas.productosMasVendidos.forEach((producto, index) => {
      reporteSheet.getRange(12 + index, 1).setValue(producto.sku);
      reporteSheet.getRange(12 + index, 2).setValue(producto.cantidad);
    });
    
    // Agregar ventas por día
    reporteSheet.getRange(10, 4).setValue("VENTAS POR DÍA:").setFontWeight("bold");
    reporteSheet.getRange(11, 4).setValue("Fecha");
    reporteSheet.getRange(11, 5).setValue("Total");
    
    // Llenar datos por día
    let rowIndex = 12;
    for (const [fecha, total] of Object.entries(reporte.estadisticas.ventasPorDia)) {
      reporteSheet.getRange(rowIndex, 4).setValue(fecha);
      reporteSheet.getRange(rowIndex, 5).setValue(total).setNumberFormat("$#,##0.00");
      rowIndex++;
    }
    
    // Ajustar anchos de columna
    reporteSheet.autoResizeColumns(1, 5);
    
    return {
      success: true,
      mensaje: `Reporte para ${mes}/${anio} creado exitosamente`,
      hoja: nombreHoja,
      url: ss.getUrl() + "#gid=" + reporteSheet.getSheetId()
    };
  } catch (error) {
    Logger.log("Error en crearReporteMensual: " + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene las últimas órdenes realizadas
 * @param {number} cantidad - Número de órdenes a obtener (por defecto 10)
 * @return {Object} Últimas órdenes con detalles
 */
function getUltimasOrdenes(cantidad = 10) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const salesSheet = ss.getSheetByName("Sales");
    const paymentsSheet = ss.getSheetByName("Payments");
    
    if (!salesSheet || !paymentsSheet) {
      throw new Error("No se encontraron las hojas necesarias");
    }
    
    // Obtener todos los datos
    const salesData = salesSheet.getDataRange().getValues();
    const paymentsData = paymentsSheet.getDataRange().getValues();
    
    // Quitar encabezados
    const salesRows = salesData.slice(1);
    const paymentsRows = paymentsData.slice(1);
    
    // Obtener invoices únicos ordenados por fecha (más reciente primero)
    const invoiceMap = {};
    
    // Agrupar ventas por invoice number
    salesRows.forEach(row => {
      const fecha = row[0]; // fecha
      const invoiceNum = row[1]; // número de factura
      
      if (!invoiceMap[invoiceNum]) {
        invoiceMap[invoiceNum] = {
          fecha: fecha,
          numero: invoiceNum,
          items: [],
          pago: null
        };
      }
      
      invoiceMap[invoiceNum].items.push({
        sku: row[2],
        cantidad: row[3],
        precio: row[4],
        impuesto: row[5],
        subtotal: row[3] * row[4],
        total: (row[3] * row[4]) + row[5]
      });
    });
    
    // Agregar información de pagos
    paymentsRows.forEach(row => {
      const invoiceNum = row[1]; // número de factura
      
      if (invoiceMap[invoiceNum]) {
        invoiceMap[invoiceNum].pago = {
          fecha: row[0],
          total: row[2],
          metodoPago: row[3] === 'cash' ? 'Efectivo' : 'Tarjeta',
          cambio: row[4]
        };
      }
    });
    
    // Convertir a array y ordenar por fecha (más reciente primero)
    let ordenesArray = Object.values(invoiceMap);
    ordenesArray.sort((a, b) => {
      // Convertir a objeto Date si es string
      const fechaA = a.fecha instanceof Date ? a.fecha : new Date(a.fecha);
      const fechaB = b.fecha instanceof Date ? b.fecha : new Date(b.fecha);
      return fechaB - fechaA; // Orden descendente
    });
    
    // Limitar a la cantidad solicitada
    ordenesArray = ordenesArray.slice(0, cantidad);
    
    // Calcular totales para cada orden
    ordenesArray.forEach(orden => {
      let totalItems = 0;
      let totalImpuestos = 0;
      
      orden.items.forEach(item => {
        totalItems += item.subtotal;
        totalImpuestos += item.impuesto;
      });
      
      orden.totalItems = totalItems;
      orden.totalImpuestos = totalImpuestos;
      orden.granTotal = totalItems + totalImpuestos;
      
      // Formatear fecha
      if (orden.fecha) {
        try {
          const fecha = new Date(orden.fecha);
          orden.fechaFormateada = Utilities.formatDate(fecha, 'GMT-6', 'dd/MM/yyyy HH:mm');
        } catch (e) {
          orden.fechaFormateada = "Fecha no disponible";
        }
      }
    });
    
    return {
      success: true,
      ordenes: ordenesArray,
      total: ordenesArray.length
    };
  } catch (error) {
    Logger.log("Error en getUltimasOrdenes: " + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene los detalles completos de una orden específica
 * @param {number} invoiceNumber - Número de factura a buscar
 * @return {Object} Detalles completos de la orden
 */
function getDetalleOrden(invoiceNumber) {
  try {
    // Convertir a número si es string
    invoiceNumber = parseInt(invoiceNumber);
    
    if (isNaN(invoiceNumber)) {
      throw new Error("Número de factura inválido");
    }
    
    // Obtener todas las órdenes y buscar la específica
    const resultado = getUltimasOrdenes(1000); // Número grande para obtener todas
    
    if (!resultado.success) {
      throw new Error(resultado.error);
    }
    
    const orden = resultado.ordenes.find(o => parseInt(o.numero) === invoiceNumber);
    
    if (!orden) {
      throw new Error("Orden no encontrada");
    }
    
    // Obtener información de productos para mostrar descripciones
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const itemsSheet = ss.getSheetByName("Items");
    
    if (itemsSheet) {
      const itemsData = itemsSheet.getDataRange().getValues();
      const itemsMap = {};
      
      // Crear mapa de productos por SKU
      itemsData.forEach(row => {
        itemsMap[row[0]] = {
          descripcion: row[1],
          precio: row[2],
          impuesto: row[3],
          imagen: row[4],
          tiempo: row[5]
        };
      });
      
      // Enriquecer items con descripciones
      orden.items.forEach(item => {
        if (itemsMap[item.sku]) {
          item.descripcion = itemsMap[item.sku].descripcion;
          item.tiempo = itemsMap[item.sku].tiempo;
          item.imagen = itemsMap[item.sku].imagen;
        } else {
          item.descripcion = "Producto no disponible";
          item.tiempo = 0;
          item.imagen = "";
        }
      });
    }
    
    return {
      success: true,
      orden: orden
    };
  } catch (error) {
    Logger.log("Error en getDetalleOrden: " + error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Reimprime una factura existente
 * @param {number} invoiceNumber - Número de factura a reimprimir
 * @return {Object} Datos para reimprimir la factura
 */
function reimprimirFactura(invoiceNumber) {
  try {
    const resultado = getDetalleOrden(invoiceNumber);
    
    if (!resultado.success) {
      throw new Error(resultado.error);
    }
    
    return {
      success: true,
      factura: resultado.orden
    };
  } catch (error) {
    Logger.log("Error en reimprimirFactura: " + error.message);
    return { success: false, error: error.message };
  }
}