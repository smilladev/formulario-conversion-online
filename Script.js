//const SPREADSHEET_ID = "19UIyi_9Z1EwoMcPKt6l99Gqk-o0ocwp_aji6o6rWUxg";
const SPREADSHEET_ID = "1IhRKEOIixLidbF9ehEmpPHvPa0tO6DvxCM1JSe-fwxA";
const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error("No se recibieron datos en el cuerpo de la solicitud.");
    }

    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (!ss) {
      throw new Error("No se pudo encontrar el Spreadsheet con el ID proporcionado.");
    }

    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error("No se encontró la pestaña llamada: '" + SHEET_NAME + "'. Verifica espacios o mayúsculas.");
    }

sheet.appendRow([
  data["_dp_string319"]    || "",   // nombre
  data["_dp_string320"]    || "",   // apellido
  data["_dp_email"]        || "",   // email
  data["phonePrefix"]      || "",   // codigo
  data["phoneNumber"]      || "",   // telefono
  data["_dp_country"]      || "",   // pais
  data["_dp_string219310"] || "",   // nivel_de_estudios
  data["_dp_string18650"]  || "",   // cargo
  data["_dp_string219311"] || "",   // industria
  data["_dp_string35228"]  || "",   // area
  data["_dp_string219712"] || "",   // numero_empleados
  data["_dp_string197389"] || "",   // tipo_de_documento
  data["_dp_string219707"] || "",   // numero_documento
  data["LeadScore"]        || 0,    // lead_scoring
  data["timestamp"]        || new Date().toLocaleString("es-AR", {timeZone: "America/Argentina/Buenos_Aires"}), // timestamp
  "",                               // (columna vacía P)
  "",                               // (columna vacía Q)
  "",                               // Oportunidad
  "",                               // Contacto (si/no)
  "",                               // Observaciones
  "",                               // Oportunidad
  data["utm_content"]      || "",   // utm_content
  data["utm"]              || "",   // utm
  data["utm_source"]       || "",   // utm_source
  data["utm_medium"]       || "",   // utm_medium
  data["utm_campaign"]     || "",   // utm_campaign
  data["utm_term"]         || ""    // utm_term
]);

    return ContentService
      .createTextOutput(JSON.stringify({ "status": "ok", "message": "Datos guardados correctamente" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}