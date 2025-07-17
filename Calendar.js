/**
 * Administrador de Calendarios para Lavasmart
 */

/**
 * Define la lista de calendarios a mostrar
 * Se puede mover a PropertiesService para mayor flexibilidad
 */
const CALENDARS = [
            
            { name: "Acero", id: "c_b226d59101f7e512cee58047a0379fb9a084ad249dae4011426f19778ddb6a23@group.calendar.google.com", color: "acero", active: true },
            { name: "Azul", id: "c_53d3cf4236f9616c406e81ce45d9b15449cde08ecff5af924a94567921a75b7a@group.calendar.google.com", color: "azul", active: true },
            { name: "Blanco", id: "c_df9af658c740078e34a0fd8377e10bdb241d3369614d32387b19bdfb14d27417@group.calendar.google.com", color: "blanco", active: true },
            { name: "Plata", id: "c_188fce238860c25007d89ba96531953fab1ed8b4efc584b5a61577ad0c24bcfc@group.calendar.google.com", color: "plata", active: true },
            { name: "Zafiro", id: "c_544e4329b2a43041fd84cdd1b5057000d5b466489c167d7cc9a7c6d3c4eac617@group.calendar.google.com", color: "zafiro", active: true },
            { name: "Cobalto", id: "c_0cda317b24248c8d70230d6bd62c61dc9e6e6c2440526c0cad4c0dba11025e9b@group.calendar.google.com", color: "cobalto", active: true }

];

/**
 * Renderiza la página del calendario
 * @return {HtmlOutput} HTML de la página del calendario
 */
function doCalendar() {
  try {
    Logger.log("=== INICIO doCalendar ===");
    
    // Verificar si el archivo existe
    try {
      Logger.log("Verificando existencia de calendar.html");
      const htmlContent = HtmlService.createHtmlOutputFromFile('calendar').getContent();
      Logger.log("Archivo calendar.html encontrado");
    } catch (fileError) {
      Logger.log("ERROR: No se pudo encontrar el archivo calendar.html");
      Logger.log("Mensaje: " + fileError.message);
      throw new Error("No se pudo encontrar el archivo calendar.html: " + fileError.message);
    }
    
    Logger.log("Creando template desde archivo calendar.html");
    const template = HtmlService.createTemplateFromFile('calendar');
    
    Logger.log("Obteniendo lista de calendarios");
    template.calendars = getCalendarList();
    
    Logger.log("Evaluando template");
    const output = template.evaluate()
      .setTitle('Calendario')
      .setFaviconUrl('https://www.gstatic.com/images/icons/material/system/1x/calendar_today_black_24dp.png')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
    Logger.log("=== FIN doCalendar ===");
    return output;
  } catch (error) {
    Logger.log("ERROR en doCalendar: " + error.message);
    Logger.log("Stack: " + error.stack);
    throw error;
  }
}

/**
 * Verifica la disponibilidad de los calendarios configurados
 * @return {Object} Estado de los calendarios
 */
function checkCalendarAccess() {
  Logger.log("Verificando acceso a calendarios...");
  const results = {
    success: true,
    calendars: []
  };
  
  try {
    CALENDARS.forEach(cal => {
      try {
        const calendar = CalendarApp.getCalendarById(cal.id);
        const accessible = calendar !== null;
        Logger.log(`Calendario ${cal.name}: ${accessible ? "Accesible" : "No accesible"}`);
        
        results.calendars.push({
          name: cal.name,
          id: cal.id,
          accessible: accessible
        });
        
        if (!accessible) {
          results.success = false;
        }
      } catch (calError) {
        Logger.log(`Error al verificar calendario ${cal.name}: ${calError.message}`);
        results.calendars.push({
          name: cal.name,
          id: cal.id,
          accessible: false,
          error: calError.message
        });
        results.success = false;
      }
    });
    
    return results;
  } catch (error) {
    Logger.log("Error en checkCalendarAccess: " + error.message);
    return {
      success: false,
      error: error.message,
      calendars: []
    };
  }
}

/**
 * Obtiene eventos de los calendarios especificados dentro de un rango de fechas
 * @param {Array} calendarIds - Array de IDs de calendarios a consultar
 * @param {Date} startDate - Fecha de inicio (opcional, por defecto 2 semanas antes)
 * @param {Date} endDate - Fecha de fin (opcional, por defecto 1 mes después)
 * @return {Array} Array de eventos formateados
 */
function getCalendarEvents(calendarIds, startDate, endDate) {
  try {
    Logger.log("=== INICIO getCalendarEvents ===");
    Logger.log("Parámetros recibidos:");
    Logger.log("calendarIds: " + JSON.stringify(calendarIds));
    Logger.log("startDate: " + startDate);
    Logger.log("endDate: " + endDate);
    
    // Validar y limpiar los IDs de calendario
    if (!calendarIds || !Array.isArray(calendarIds)) {
      Logger.log("calendarIds no válido, usando 'primary' por defecto");
      calendarIds = ['primary'];
    }
    
    // Asegurar que los IDs sean strings válidos
    Logger.log("Limpieza de IDs de calendario");
    calendarIds = calendarIds.map(id => {
      if (id === 'primary') return id;
      return String(id).trim();
    }).filter(id => id.length > 0);
    
    if (calendarIds.length === 0) {
      Logger.log("No hay IDs válidos, usando 'primary' por defecto");
      calendarIds = ['primary'];
    }
    
    Logger.log("IDs de calendario procesados: " + JSON.stringify(calendarIds));
    
    // Establecer fechas predeterminadas si no se proporcionan
    if (!startDate) {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 14); // 2 semanas atrás
      Logger.log("startDate no proporcionado, usando: " + startDate.toISOString());
    }
    
    if (!endDate) {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 mes adelante
      Logger.log("endDate no proporcionado, usando: " + endDate.toISOString());
    }
    
    // Convertir a objetos Date si son strings
    if (typeof startDate === 'string') {
      Logger.log("Convirtiendo startDate de string a Date");
      startDate = new Date(startDate);
    }
    if (typeof endDate === 'string') {
      Logger.log("Convirtiendo endDate de string a Date");
      endDate = new Date(endDate);
    }
    
    // Validar fechas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      Logger.log("ERROR: Fechas inválidas");
      Logger.log("startDate: " + startDate);
      Logger.log("endDate: " + endDate);
      throw new Error("Fechas inválidas proporcionadas");
    }
    
    Logger.log("Rango de fechas válido:");
    Logger.log("Inicio: " + startDate.toISOString());
    Logger.log("Fin: " + endDate.toISOString());
    
    const allEvents = [];
    
    // Procesar cada calendario
    for (const calendarId of calendarIds) {
      try {
        Logger.log(`\nProcesando calendario: ${calendarId}`);
        
        let calendar;
        if (calendarId === 'primary') {
          Logger.log("Obteniendo calendario principal");
          calendar = CalendarApp.getDefaultCalendar();
        } else {
          Logger.log("Obteniendo calendario por ID");
          calendar = CalendarApp.getCalendarById(calendarId);
        }
        
        if (!calendar) {
          Logger.log(`ERROR: Calendario no encontrado: ${calendarId}`);
          continue;
        }
        
        Logger.log(`Calendario encontrado: ${calendar.getName()}`);
        
        const events = calendar.getEvents(startDate, endDate);
        Logger.log(`Encontrados ${events.length} eventos en el calendario ${calendarId}`);
        
        events.forEach((event, index) => {
          try {
            Logger.log(`\nProcesando evento ${index + 1}/${events.length}`);
            Logger.log(`Título: ${event.getTitle()}`);
            
            const startTime = event.getStartTime();
            const endTime = event.getEndTime();
            
            Logger.log(`Fechas del evento:`);
            Logger.log(`Inicio: ${startTime}`);
            Logger.log(`Fin: ${endTime}`);
            
            if (!startTime || !endTime || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
              Logger.log(`ERROR: Evento con fechas inválidas: ${event.getTitle()}`);
              return;
            }
            
            // Crear objeto de evento con valores validados
            const eventObj = {
              id: String(event.getId() || Utilities.getUuid()),
              title: String(event.getTitle() || 'Sin título').trim(),
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              allDay: Boolean(event.isAllDayEvent()),
              calendarId: String(calendarId),
              location: String(event.getLocation() || '').trim(),
              description: String(event.getDescription() || '').trim(),
              creator: String((event.getCreators() && event.getCreators()[0]) || '').trim()
            };
            
            Logger.log("Objeto de evento creado:");
            Logger.log(JSON.stringify(eventObj));
            
            // Validar que los valores requeridos no sean vacíos
            if (!eventObj.title || !eventObj.start || !eventObj.end) {
              Logger.log(`ERROR: Evento con campos requeridos vacíos: ${event.getTitle()}`);
              return;
            }
            
            allEvents.push(eventObj);
            Logger.log("Evento agregado exitosamente");
          } catch (eventError) {
            Logger.log(`ERROR al procesar evento: ${eventError.message}`);
            Logger.log(`Stack: ${eventError.stack}`);
          }
        });
      } catch (calendarError) {
        Logger.log(`ERROR al procesar calendario ${calendarId}: ${calendarError.message}`);
        Logger.log(`Stack: ${calendarError.stack}`);
      }
    }
    
    Logger.log(`\n=== FIN getCalendarEvents ===`);
    Logger.log(`Total de eventos procesados: ${allEvents.length}`);
    return allEvents;
  } catch (error) {
    Logger.log("ERROR FATAL en getCalendarEvents:");
    Logger.log(`Mensaje: ${error.message}`);
    Logger.log(`Stack: ${error.stack}`);
    throw error;
  }
}

/**
 * Obtiene la lista de calendarios configurados
 * @return {Array} Lista de calendarios con sus IDs y nombres
 */
function getCalendarList() {
  Logger.log("Obteniendo lista de calendarios configurados");
  return CALENDARS;
}

/*
function doGet(e) {
  try {
    Logger.log("=== INICIO doGet ===");
    Logger.log("Parámetros recibidos: " + JSON.stringify(e));
    
    // Verificar si hay parámetros
    const params = e ? e.parameter : {};
    let template;
    
    // Elegir plantilla según el modo
    if (params.mode === 'reports') {
      Logger.log("Modo: reports");
      template = HtmlService.createTemplateFromFile('reports');
    } else if (params.mode === 'calendar') {
      Logger.log("Modo: calendar - Llamando a doCalendar");
      try {
        const output = doCalendar();
        Logger.log("doCalendar ejecutado exitosamente");
        return output;
      } catch (error) {
        Logger.log("ERROR en doCalendar: " + error.message);
        Logger.log("Stack: " + error.stack);
        throw error;
      }
    } else {
      Logger.log("Modo: default (index)");
      template = HtmlService.createTemplateFromFile('index');
    }
    
    Logger.log("Renderizando plantilla");
    const output = template.evaluate()
        .setTitle('POS Lavasmart')
        .setFaviconUrl('https://www.google.com/images/branding/product/ico/googleg_lodp.ico')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
    Logger.log("=== FIN doGet ===");
    return output;
  } catch (error) {
    Logger.log("ERROR FATAL en doGet:");
    Logger.log("Mensaje: " + error.message);
    Logger.log("Stack: " + error.stack);
    return HtmlService.createHtmlOutput(`<h1>Error</h1><p>${error.message}</p>`);
  }
}
*/

/**
 * Función de depuración para probar la obtención de eventos
 * @param {string} calendarId - ID de un solo calendario para probar
 * @return {Object} Información detallada para depuración
 */
function debugCalendarEvents(calendarId) {
  try {
    Logger.log("Iniciando depuración para calendario: " + calendarId);
    
    // Verificar que se proporciona un ID de calendario
    if (!calendarId) {
      return {
        success: false,
        error: "Se requiere un ID de calendario para depurar",
        timestamp: new Date().toISOString()
      };
    }
    
    // Fechas para prueba (rango pequeño)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); // 1 semana atrás
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7); // 1 semana adelante
    
    // Intentar obtener el calendario
    let calendar;
    let calendarAccessible = false;
    let calendarName = "No disponible";
    
    try {
      calendar = CalendarApp.getCalendarById(calendarId);
      if (calendar) {
        calendarAccessible = true;
        calendarName = calendar.getName();
      }
    } catch (calError) {
      return {
        success: false,
        error: "Error al acceder al calendario: " + calError.message,
        calendarId: calendarId,
        timestamp: new Date().toISOString()
      };
    }
    
    if (!calendarAccessible) {
      return {
        success: false,
        error: "Calendario no accesible o no encontrado",
        calendarId: calendarId,
        timestamp: new Date().toISOString()
      };
    }
    
    // Intentar obtener eventos
    let events = [];
    let rawEvents = [];
    try {
      rawEvents = calendar.getEvents(startDate, endDate);
      Logger.log(`Obtenidos ${rawEvents.length} eventos para depuración`);
      
      // Extraer datos simplificados de cada evento (limitar a 10 para prueba)
      const sampleEvents = rawEvents.slice(0, 10);
      
      sampleEvents.forEach(event => {
        try {
          // Datos básicos del evento
          const simpleEvent = {
            id: event.getId(),
            title: event.getTitle(),
            start: {
              raw: event.getStartTime().toString(),
              iso: event.getStartTime().toISOString(),
              date: Utilities.formatDate(event.getStartTime(), Session.getScriptTimeZone(), "yyyy-MM-dd")
            },
            end: {
              raw: event.getEndTime().toString(),
              iso: event.getEndTime().toISOString(),
              date: Utilities.formatDate(event.getEndTime(), Session.getScriptTimeZone(), "yyyy-MM-dd")
            },
            allDay: event.isAllDayEvent(),
            location: event.getLocation() || '',
            description: (event.getDescription() || '').substring(0, 100) // Limitar longitud
          };
          
          events.push(simpleEvent);
        } catch (eventError) {
          events.push({
            error: `Error procesando evento: ${eventError.message}`,
            raw: String(event)
          });
        }
      });
    } catch (eventsError) {
      return {
        success: false,
        error: "Error al obtener eventos: " + eventsError.message,
        calendarId: calendarId,
        calendarName: calendarName,
        calendarAccessible: calendarAccessible,
        timestamp: new Date().toISOString()
      };
    }
    
    // Devolver resultados detallados
    return {
      success: true,
      calendarId: calendarId,
      calendarName: calendarName,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        timezone: Session.getScriptTimeZone()
      },
      totalEvents: rawEvents.length,
      eventSamples: events,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log("Error en debugCalendarEvents: " + error.message);
    console.error("Error en debugCalendarEvents: " + error.message + "\n" + error.stack);
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Función de prueba para verificar getCalendarEvents
 */
function testCalendarEvents() {
  try {
    Logger.log("Iniciando prueba de getCalendarEvents...");
    
    // Fechas de prueba para 2025
    const startDate = new Date('2025-03-01');
    const endDate = new Date('2025-03-31');
    
    Logger.log(`Rango de fechas: ${startDate.toISOString()} a ${endDate.toISOString()}`);
    
    // Obtener eventos
    const events = getCalendarEvents(['primary'], startDate, endDate);
    
    // Log de resultados
    Logger.log(`Total de eventos encontrados: ${events.length}`);
    
    // Verificar cada evento
    events.forEach((event, index) => {
      Logger.log(`\nEvento ${index + 1}:`);
      Logger.log(`ID: ${event.id}`);
      Logger.log(`Título: ${event.title}`);
      Logger.log(`Inicio: ${event.start}`);
      Logger.log(`Fin: ${event.end}`);
      Logger.log(`Todo el día: ${event.allDay}`);
      Logger.log(`Ubicación: ${event.location}`);
      Logger.log(`Descripción: ${event.description}`);
    });
    
    return {
      success: true,
      totalEvents: events.length,
      events: events
    };
  } catch (error) {
    Logger.log("Error en testCalendarEvents: " + error.message);
    return {
      success: false,
      error: error.message
    };
  }
}