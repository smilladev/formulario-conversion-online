# Sistema de Lead Scoring y Valorización - CEIBO

## 📋 Descripción General

Este sistema calcula automáticamente el **Lead Score** (0-100%) y el **Lead Value** (USD) de cada lead capturado a través del formulario Doppler. El sistema evalúa múltiples dimensiones del perfil del lead y envía los datos a Google Tag Manager (GTM), plataformas de publicidad (Google Ads y Meta Ads) y webhooks de integración (n8n).

---

## 🎯 Objetivo

Valorizar leads en tiempo real basándose en criterios de negocio definidos, permitiendo:
- Segmentación automática por calidad de lead
- Optimización de campañas publicitarias con valores dinámicos
- Automatizaciones personalizadas según score
- Reporting y análisis de calidad de leads

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────┐
│  Formulario Doppler │
│   (Captura datos)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Script JS Local   │
│ (Calcula Score/Value)│
└─────┬──────┬────────┘
      │      │
      │      └─────────────────┐
      │                        │
      ▼                        ▼
┌──────────────┐      ┌────────────────┐
│ Google Tag   │      │   Webhook n8n  │
│   Manager    │      │  (Integraciones)│
└──────┬───────┘      └────────────────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌──────────┐   ┌──────────┐
│ Google   │   │   Meta   │
│   Ads    │   │   Ads    │
└──────────┘   └──────────┘
```

---

## 📊 Modelo de Scoring

### Pesos por Campo (Total = 100%)

| Campo | Peso | Descripción |
|-------|------|-------------|
| **Cargo** | 50% | Posición jerárquica del lead |
| **Nivel de Estudios** | 6% | Formación académica |
| **Industria** | 7% | Sector de la empresa |
| **Área de Práctica** | 7% | Departamento o especialidad |
| **Número de Empleados** | 15% | Tamaño de la empresa |
| **Años de Experiencia** | 15% | Seniority profesional |

### Fórmula de Cálculo

```javascript
Lead Score (%) = 
  (scoreCargo / 10) × 50 +
  (scoreEstudios / 10) × 6 +
  (scoreIndustria / 10) × 7 +
  (scoreArea / 10) × 7 +
  (scoreEmpleados / 10) × 15 +
  (scoreExperiencia / 10) × 15
```

```javascript
Lead Value (USD) = VALOR_BASE_PROGRAMA × (Lead Score / 100)
```

**Valor actual:** `VALOR_BASE_PROGRAMA = $1400`

> ⚠️ **Nota:** Este valor debe ajustarse según el análisis estadístico de conversiones offline del equipo de Growth.

---

## 🚫 Regla de Descalificación

**Si CUALQUIER campo tiene score = 0:**
- `Lead Score = 0%`
- `Lead Value = $0`

Esto garantiza que solo leads completos y relevantes reciban valorización.

---

## 📝 Mapeo de Valores y Scores

### 1. Cargo (50%)

| Opción | Score | Texto Visible |
|--------|-------|---------------|
| `Director/Socio/Dueño` | 10 | Director/Socio/Dueño |
| `Gerente/Subgerente` | 10 | Gerente/Subgerente |
| `Jefe/Coordinador` | 5 | Jefe/Coordinador |
| `Analista/Profesional` | 4 | Analista/Profesional |
| `Emprendedor/Independiente` | 7 | Emprendedor/Independiente |
| `Estudiante` | **0** | Estudiante (❌ Descalifica) |
| `Otro` | 4 | Otro |

### 2. Nivel de Estudios (6%)

| Opción | Score | Texto Visible |
|--------|-------|---------------|
| `Secundario incompleto` | **0** | Secundario incompleto (❌ Descalifica) |
| `Secundario completo` | 10 | Secundario completo |
| `Terciario incompleto` | 10 | Terciario incompleto |
| `Terciario completo` | 10 | Terciario completo |
| `Universitario incompleto` | 10 | Universitario incompleto |
| `Universitario completo` | 10 | Universitario completo |
| `Posgrado/Maestría` | 10 | Posgrado/Maestría |
| `Doctorado/PhD` | 10 | Doctorado/PhD |

### 3. Industria (7%)

| Opción | Score | Texto Visible |
|--------|-------|---------------|
| `Agro/Alimentos y Bebidas` | 10 | Agro/Alimentos y Bebidas |
| `Automotriz/Autopartes` | 10 | Automotriz/Autopartes |
| `Banca/Servicios Financieros` | 10 | Banca/Servicios Financieros |
| `Construcción/Real Estate` | 10 | Construcción/Real Estate |
| `Educación` | 10 | Educación |
| `Energía/Minería/Petróleo & Gas` | 10 | Energía/Minería/Petróleo & Gas |
| `Gobierno/Sector Público` | 10 | Gobierno/Sector Público |
| `Manufactura` | 10 | Manufactura |
| `Salud/Farmacéutica/Biotecnología` | 10 | Salud/Farmacéutica/Biotecnología |
| `Servicios Profesionales (Consultoría/Legal/Contable)` | 9 | Servicios Profesionales |
| `Tecnología/Software/IT` | 10 | Tecnología/Software/IT |
| `Telecomunicaciones` | 10 | Telecomunicaciones |
| `Transporte/Logística` | 10 | Transporte/Logística |
| `Turismo/Hotelería/Gastronomía` | 10 | Turismo/Hotelería/Gastronomía |
| `Otro` | 7 | Otro |

### 4. Área de Práctica (7%)

| Opción | Score | Texto Visible |
|--------|-------|---------------|
| `Administración/Estrategia General` | 10 | Administración/Estrategia General |
| `Finanzas/Contabilidad` | 10 | Finanzas/Contabilidad |
| `Marketing/Comercialización` | 10 | Marketing/Comercialización |
| `Operaciones/Supply Chain/Producción` | 10 | Operaciones/Supply Chain/Producción |
| `Tecnología/Sistemas/Transformación Digital` | 10 | Tecnología/Sistemas/Transformación Digital |
| `Recursos Humanos/Desarrollo Organizacional` | 10 | Recursos Humanos/Desarrollo Organizacional |
| `Legal/Compliance` | 10 | Legal/Compliance |
| `Salud/Ciencias de la Vida` | 10 | Salud/Ciencias de la Vida |
| `Educación/Académico/Investigación` | 10 | Educación/Académico/Investigación |
| `Emprendimiento/Innovación` | 9 | Emprendimiento/Innovación |
| `Otro` | 7 | Otro |

### 5. Número de Empleados (15%)

| Opción | Score | Texto Visible |
|--------|-------|---------------|
| `1–10` | 4 | 1–10 empleados |
| `11–50` | 9 | 11–50 empleados |
| `51–200` | 10 | 51–200 empleados |
| `201–500` | 10 | 201–500 empleados |
| `501–1000` | 10 | 501–1000 empleados |
| `1000+` | 10 | 1000+ empleados |

### 6. Años de Experiencia (15%)

| Opción | Score | Texto Visible |
|--------|-------|---------------|
| `1-4` | 6 | 1-4 años |
| `5-9` | 10 | 5-9 años |
| `10-15` | 10 | 10-15 años |
| `15+` | 10 | 15+ años |

---

## 🔧 Implementación Técnica

### Campos del Formulario Doppler

Los campos utilizan IDs internos de Doppler:

```javascript
{
  '_dp_string219310': 'Nivel de Estudios',     // Campo Custom 1
  '_dp_string18650': 'Cargo',                  // Campo Custom 2
  '_dp_string219311': 'Industria',             // Campo Custom 3
  '_dp_string35228': 'Área de Práctica',       // Campo Custom 4
  '_dp_string219712': 'Número de Empleados',   // Campo Custom 5
  '_dp_string221700': 'Años de Experiencia'    // Campo Custom 6
}
```

### Flujo de Datos

1. **Captura del Submit:**
   ```javascript
   form.addEventListener('submit', handleSubmit);
   ```

2. **Extracción de Valores:**
   ```javascript
   const scoreEstudios = estudiosScoring[formData['_dp_string219310']] || 0;
   const scoreCargo = cargoScoring[formData['_dp_string18650']] || 0;
   // ... resto de campos
   ```

3. **Validación de Descalificación:**
   ```javascript
   if (scoreEstudios === 0 || scoreCargo === 0 || ...) {
     formData['LeadScore'] = 0;
     formData['LeadValue'] = 0;
   }
   ```

4. **Cálculo Ponderado:**
   ```javascript
   const leadScore = 
     (scoreCargo / 10) * PESOS.cargo +
     (scoreEstudios / 10) * PESOS.estudios +
     // ... resto de campos
   
   const leadValue = Math.round((VALOR_BASE_PROGRAMA * (leadScore / 100)) * 100) / 100;
   ```

5. **Envío a GTM:**
   ```javascript
   window.dataLayer.push({
     'event': 'dopplerFormSubmit',
     'formId': 'PavPYqQLC1+k5ArEBTJldw==',
     'formData': formData
   });
   ```

6. **Envío a n8n (Fire-and-Forget):**
   ```javascript
   fetch("https://develop-ceibo.app.n8n.cloud/webhook/form", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(formData),
     keepalive: true
   });
   ```

---

## 📤 Estructura del Data Layer

```javascript
{
  'event': 'dopplerFormSubmit',
  'formId': 'PavPYqQLC1+k5ArEBTJldw==',
  'formData': {
    '_dp_string219310': 'Universitario completo',
    '_dp_string18650': 'Gerente/Subgerente',
    '_dp_string219311': 'Tecnología/Software/IT',
    '_dp_string35228': 'Marketing/Comercialización',
    '_dp_string219712': '51–200',
    '_dp_string221700': '10-15',
    'LeadScore': 94,           // Calculado automáticamente
    'LeadValue': 1316,         // Calculado automáticamente
    // ... otros campos del formulario
  },
  'timestamp': '2026-01-20T15:30:00.000Z'
}
```

---

## 🛠️ Cómo Implementar en Otro Formulario

### Paso 1: Identificar los campos del formulario

Inspecciona el HTML del formulario para obtener los atributos `name` o `id` de cada campo:

```html
<select name="cargo_field_123">
  <option value="Director/Socio/Dueño">Director/Socio/Dueño</option>
  ...
</select>
```

### Paso 2: Actualizar las referencias en el código

En la función `handleSubmit`, reemplaza los IDs de Doppler por los IDs de tu formulario:

```javascript
// ANTES (Doppler)
const scoreEstudios = estudiosScoring[formData['_dp_string219310']] || 0;

// DESPUÉS (tu formulario)
const scoreEstudios = estudiosScoring[formData['cargo_field_123']] || 0;
```

### Paso 3: Ajustar los valores de las opciones

Asegúrate de que los valores (`value`) de cada `<option>` coincidan **exactamente** con las claves de los objetos de scoring:

```javascript
// El value DEBE coincidir con la clave del objeto scoring
<option value="Director/Socio/Dueño">Director/Socio/Dueño</option>

// En el código:
const cargoScoring = {
  "Director/Socio/Dueño": 10,  // ← Coincide exactamente
  ...
}
```

### Paso 4: Configurar GTM y destinos

- Actualiza el `formId` en el `dataLayer.push()`
- Configura las tags de conversión en GTM para usar `{{formData.LeadValue}}`
- Verifica que el webhook de n8n esté configurado correctamente

### Paso 5: Probar con logs

Abre la consola del navegador y envía el formulario. Deberías ver:

```
========================================
✅ LEAD CALIFICADO
========================================
Scores individuales (0-10):
  - Estudios: 10
  - Cargo: 10
  - Industria: 10
  - Área: 10
  - Empleados: 10
  - Experiencia: 10
----------------------------------------
📊 RESULTADO FINAL:
  Lead Score: 100.00%
  Lead Value: $1400
========================================
```

---

## 🔄 Cómo Modificar la Lógica de Scoring

### Cambiar los pesos de los campos

```javascript
const PESOS = {
  cargo: 40,        // Reducir de 50% a 40%
  estudios: 10,     // Aumentar de 6% a 10%
  industria: 10,    // Aumentar de 7% a 10%
  area: 10,         // Aumentar de 7% a 10%
  empleados: 15,    // Mantener 15%
  experiencia: 15   // Mantener 15%
};
// Total debe ser 100%
```

### Cambiar scores individuales

```javascript
const cargoScoring = {
  "Director/Socio/Dueño": 10,
  "Gerente/Subgerente": 8,        // Reducir de 10 a 8
  "Jefe/Coordinador": 6,          // Aumentar de 5 a 6
  "Analista/Profesional": 4,
  "Emprendedor/Independiente": 7,
  "Estudiante": 0,                // Mantener descalificación
  "Otro": 3                       // Reducir de 4 a 3
}
```

### Cambiar el valor base del programa

```javascript
const VALOR_BASE_PROGRAMA = 2000;  // Cambiar de $1400 a $2000
```

### Agregar nuevos campos

1. **Agregar el peso:**
   ```javascript
   const PESOS = {
     cargo: 40,
     estudios: 6,
     industria: 7,
     area: 7,
     empleados: 10,      // Reducir para hacer espacio
     experiencia: 10,    // Reducir para hacer espacio
     tamanio_venta: 20   // NUEVO CAMPO
   };
   ```

2. **Crear el objeto de scoring:**
   ```javascript
   const tamanioVentaScoring = {
     "Menos de $10K": 3,
     "$10K - $50K": 6,
     "$50K - $100K": 8,
     "$100K+": 10
   };
   ```

3. **Capturar el score:**
   ```javascript
   const scoreTamanioVenta = tamanioVentaScoring[formData['nuevo_campo_id']] || 0;
   ```

4. **Agregar a la validación de descalificación:**
   ```javascript
   if (scoreEstudios === 0 || scoreCargo === 0 || ... || scoreTamanioVenta === 0) {
   ```

5. **Incluir en el cálculo:**
   ```javascript
   const leadScore = 
     (scoreCargo / 10) * PESOS.cargo +
     // ... otros campos
     (scoreTamanioVenta / 10) * PESOS.tamanio_venta;
   ```

### Eliminar la regla de descalificación

Si quieres permitir leads parciales:

```javascript
// ANTES - Con descalificación
if (scoreEstudios === 0 || scoreCargo === 0 || ...) {
  formData['LeadScore'] = 0;
  formData['LeadValue'] = 0;
} else {
  // calcular normalmente
}

// DESPUÉS - Sin descalificación
// Simplemente calcula siempre
const leadScore = 
  (scoreCargo / 10) * PESOS.cargo +
  (scoreEstudios / 10) * PESOS.estudios +
  // ...
```

---

## 📊 Ejemplos de Cálculo

### Ejemplo 1: Lead Premium (Score Alto)

**Datos del Lead:**
- Cargo: `Director/Socio/Dueño` → Score: 10
- Estudios: `Posgrado/Maestría` → Score: 10
- Industria: `Tecnología/Software/IT` → Score: 10
- Área: `Marketing/Comercialización` → Score: 10
- Empleados: `501–1000` → Score: 10
- Experiencia: `15+` → Score: 10

**Cálculo:**
```
Lead Score = (10/10)×50 + (10/10)×6 + (10/10)×7 + (10/10)×7 + (10/10)×15 + (10/10)×15
           = 50 + 6 + 7 + 7 + 15 + 15
           = 100%

Lead Value = $1400 × (100 / 100)
           = $1400
```

### Ejemplo 2: Lead Medio

**Datos del Lead:**
- Cargo: `Jefe/Coordinador` → Score: 5
- Estudios: `Universitario completo` → Score: 10
- Industria: `Otro` → Score: 7
- Área: `Otro` → Score: 7
- Empleados: `11–50` → Score: 9
- Experiencia: `1-4` → Score: 6

**Cálculo:**
```
Lead Score = (5/10)×50 + (10/10)×6 + (7/10)×7 + (7/10)×7 + (9/10)×15 + (6/10)×15
           = 25 + 6 + 4.9 + 4.9 + 13.5 + 9
           = 63.3%

Lead Value = $1400 × (63.3 / 100)
           = $886.20
```

### Ejemplo 3: Lead Descalificado

**Datos del Lead:**
- Cargo: `Estudiante` → Score: **0** ❌
- Estudios: `Universitario incompleto` → Score: 10
- (resto de campos...)

**Resultado:**
```
Lead Score = 0%  (descalificado por cargo = 0)
Lead Value = $0
```

---

## 🐛 Debugging y Logs

El sistema incluye logs detallados en la consola del navegador:

```javascript
console.log('🔍 VALORES CAPTURADOS:');
console.log('  Estudios (_dp_string219310):', formData['_dp_string219310']);
// ...

console.log('========================================');
console.log('✅ LEAD CALIFICADO');
console.log('========================================');
console.log('Scores individuales (0-10):');
console.log('  - Estudios:', scoreEstudios);
// ...
console.log('📊 RESULTADO FINAL:');
console.log('  Lead Score: ' + leadScore.toFixed(2) + '%');
console.log('  Lead Value: $' + leadValue);
console.log('========================================');
```

### Cómo verificar el funcionamiento:

1. Abre las **Herramientas de Desarrollo** (F12)
2. Ve a la pestaña **Console**
3. Llena y envía el formulario
4. Verifica los logs que muestran:
   - Valores capturados de cada campo
   - Scores individuales (0-10)
   - Cálculo ponderado por campo
   - Lead Score y Lead Value finales

---

## 🔗 Integraciones

### Google Tag Manager

**Evento enviado:**
```javascript
{
  event: 'dopplerFormSubmit',
  formData: {
    LeadScore: 94,
    LeadValue: 1316,
    // ... otros campos
  }
}
```

**Variables sugeridas en GTM:**
- `{{formData.LeadScore}}` - Score del lead (%)
- `{{formData.LeadValue}}` - Valor del lead (USD)
- `{{formData._dp_string18650}}` - Cargo
- etc.

### Google Ads

Configurar tag de conversión con valor dinámico:
```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXX/XXXXXXXXX',
  'value': {{formData.LeadValue}},
  'currency': 'USD'
});
```

### Meta Ads (Facebook Pixel)

```javascript
fbq('track', 'Lead', {
  value: {{formData.LeadValue}},
  currency: 'USD',
  content_name: 'Formulario CEIBO'
});
```

### n8n Webhook

**Endpoint:** `https://develop-ceibo.app.n8n.cloud/webhook/form`

**Payload enviado:**
```json
{
  "_dp_string219310": "Universitario completo",
  "_dp_string18650": "Gerente/Subgerente",
  "_dp_string219311": "Tecnología/Software/IT",
  "_dp_string35228": "Marketing/Comercialización",
  "_dp_string219712": "51–200",
  "_dp_string221700": "10-15",
  "LeadScore": 94,
  "LeadValue": 1316,
  "email": "usuario@example.com",
  "nombre": "Juan Pérez",
  // ... otros campos del formulario
}
```

---

## ⚠️ Consideraciones Importantes

### 1. Validación de Datos

El sistema usa el operador `||` para asignar score 0 si no encuentra coincidencia:

```javascript
const scoreEstudios = estudiosScoring[formData['_dp_string219310']] || 0;
```

Esto significa que si un valor no está mapeado, el lead será descalificado.

### 2. Coincidencia Exacta

Los valores deben coincidir **exactamente** (case-sensitive):

```javascript
// ✅ CORRECTO
"Director/Socio/Dueño" === "Director/Socio/Dueño"

// ❌ INCORRECTO (mayúsculas diferentes)
"director/socio/dueño" !== "Director/Socio/Dueño"
```

### 3. Fire-and-Forget en n8n

La petición a n8n usa `keepalive: true` para garantizar el envío incluso si Doppler redirige la página:

```javascript
fetch(url, {
  method: "POST",
  body: JSON.stringify(formData),
  keepalive: true  // ← Crítico para envíos asincrónicos
});
```

### 4. Compatibilidad con Doppler

El script **NO interfiere** con el flujo normal de Doppler:
- No usa `preventDefault()`
- No modifica el DOM del formulario
- Solo escucha el evento submit y ejecuta código adicional

### 5. Timing del Script

El script espera a que el formulario esté disponible:

```javascript
const checkFormInterval = setInterval(() => {
  const form = document.querySelector('form[data-dp-form], form');
  if (form) {
    clearInterval(checkFormInterval);
    form.addEventListener('submit', handleSubmit);
  }
}, 500);
```

---

## 📁 Estructura de Archivos

```
formulario-conversion-online/
├── index.html                              # Formulario con script de scoring
├── README.md                               # Este documento
└── ARQUITECTURA RECOMENDADA – VALORIZACIÓN DE LEADS.md  # Documento de requisitos
```

---

## 🚀 Próximos Pasos

1. **Ajustar `VALOR_BASE_PROGRAMA`** según análisis de conversiones offline
2. **Validar scores** con el equipo de negocio
3. **Configurar tags** en GTM para Google Ads y Meta Ads
4. **Crear automatizaciones** en Doppler basadas en LeadScore
5. **Implementar dashboard** de reporting en Looker Studio o similar

---

## 📞 Soporte

Para modificaciones o consultas sobre el sistema de scoring:
- Revisar logs de consola del navegador
- Verificar coincidencia exacta de valores en objetos de scoring
- Confirmar que los pesos sumen 100%
- Validar que GTM esté correctamente instalado

---

## 📜 Changelog

### v1.0 (Enero 2026)
- ✅ Implementación inicial del sistema de lead scoring
- ✅ Integración con Doppler, GTM y n8n
- ✅ Regla de descalificación por campo = 0
- ✅ Logs detallados en consola
- ✅ Cálculo dinámico de Lead Value
- ✅ Documentación completa

---

**Última actualización:** Enero 20, 2026  
**Versión:** 1.0  
**Autor:** CEIBO Growth Team
