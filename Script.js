const SPREADSHEET_ID = "1VpLVMESZoryHqn7wdCtZpedGou7BiYsQBU-QAAml7Fw";
const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error('No se recibieron datos.');
    }

    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (!ss) {
      throw new Error('No se pudo encontrar el Spreadsheet.');
    }

    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontro la pestana: ' + SHEET_NAME);
    }

    const ts = data['timestamp'] || Utilities.formatDate(new Date(), 'America/Argentina/Buenos_Aires', 'dd/MM/yyyy HH:mm:ss');

    sheet.appendRow([
      data['_dp_string319']    || '', // nombre
      data['_dp_string320']    || '', // apellido
      data['_dp_string246369'] || '', // sexo
      data['_dp_date219708']   || '', // fecha_de_nacimiento
      data['_dp_email']        || '', // email
      data['phonePrefix']      || '', // codigo
      data['phoneNumber']      || '', // telefono
      data['_dp_country']      || '', // pais
      data['_dp_string219310'] || '', // nivel_de_estudios
      data['_dp_string18650']  || '', // cargo
      data['_dp_string35228']  || '', // area
      data['_dp_string219311'] || '', // industria (no participa del scoring, se persiste igual)
      data['_dp_string197389'] || '', // tipo_de_documento
      data['_dp_string219707'] || '', // numero_documento
      data['LeadScore']        || 0,  // lead_scoring
      data['LeadValue']        || 0,  // lead_value
      ts,
      '', '', '', '', '', '',
      data['utm_content']      || '',
      data['utm']              || '',
      data['utm_source']       || '',
      data['utm_medium']       || '',
      data['utm_campaign']     || '',
      data['utm_term']         || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
