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

    // El orden de abajo tiene que coincidir EXACTO con la fila 1 (encabezados) del sheet real:
    // DB_Tipo de Documento | DB_Nro. de documento | Correo electronico | Nombre | Apellido |
    // DB_Sexo | DB_Fecha de Nacimiento | Pais de Residencia | Provincia DP | Ciudad DP |
    // Pais Telefono | Telefono Codigo Area | Telefono 3 | Producto Nombre | ID. |
    // utm_source | utm_medium | utm_content | utm_term | utm_campaign | campaniaid | Canal |
    // Plantilla auto respuesta | Derivar a | Derivar a cola
    // + columnas nuevas al final: Nivel de estudios | Cargo | Area | LeadScore | LeadValue
    //
    // Provincia DP, Ciudad DP, Producto Nombre, ID., campaniaid, Canal,
    // Plantilla auto respuesta, Derivar a y Derivar a cola no tienen un campo
    // de origen en el form/formData todavia -> quedan vacias a proposito.
    //
    // Telefono: phonePrefix es el codigo de pais (ej: "54") y phoneNumber es
    // TODO lo que sigue (codigo de area + numero local juntos, sin separar --
    // los codigos de area argentinos varian de 2 a 4 digitos, no hay forma
    // confiable de partirlos sin una tabla de prefijos). Va completo a la
    // columna "Telefono Codigo Area" (el titulo de esa columna se puede
    // renombrar en el sheet sin volver a deployar); "Telefono 3" queda vacio.
    sheet.appendRow([
      data['_dp_string197389'] || '', // DB_Tipo de Documento
      data['_dp_string219707'] || '', // DB_Nro. de documento
      data['_dp_email']        || '', // Correo electronico
      data['_dp_string319']    || '', // Nombre
      data['_dp_string320']    || '', // Apellido
      data['_dp_string246369'] || '', // DB_Sexo
      data['_dp_date219708']   || '', // DB_Fecha de Nacimiento
      data['_dp_country']      || '', // Pais de Residencia
      '',                              // Provincia DP (sin dato de origen)
      '',                              // Ciudad DP (sin dato de origen)
      data['phonePrefix']      || '', // Pais Telefono (codigo de pais)
      data['phoneNumber']      || '', // Telefono Codigo Area (codigo de area + numero local, sin separar)
      '',                              // Telefono 3 (sin dato de origen)
      '',                              // Producto Nombre (sin dato de origen)
      '',                              // ID. (sin dato de origen)
      data['utm_source']       || '',
      data['utm_medium']       || '',
      data['utm_content']      || '',
      data['utm_term']         || '',
      data['utm_campaign']     || '',
      '',                              // campaniaid (sin dato de origen)
      '',                              // Canal (sin dato de origen)
      '',                              // Plantilla auto respuesta (sin dato de origen)
      '',                              // Derivar a (sin dato de origen)
      '',                              // Derivar a cola (sin dato de origen)
      data['_dp_string219310'] || '', // Nivel de estudios
      data['_dp_string18650']  || '', // Cargo
      data['_dp_string35228']  || '', // Area
      data['LeadScore']        || 0,  // LeadScore
      data['LeadValue']        || 0   // LeadValue
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
