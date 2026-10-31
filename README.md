# AI Code Wars - Expedientes Bufete Popular
Equipo: Grupo 2 
**Fecha:** 31 de octubre 2026  
**Universidad Mariano Gálvez - Centro Universitario de Chiquimulilla**

---

## 1. Ficha de Análisis

### Problema
El Bufete Popular necesita una forma sencilla de organizar los expedientes de las personas a las que da asesoría gratuita. Actualmente no tienen un sistema claro para saber qué casos están abiertos, quién los atiende y qué se ha hecho en cada uno.

### Usuario principal
Personal del Bufete Popular (abogados, asistentes o coordinadores) que necesitan registrar, consultar y dar seguimiento a casos de forma rápida y sin complicaciones.

### Prioridades (en orden)
1. Poder abrir un expediente con los datos mínimos.
2. Ver el listado de expedientes y buscarlos fácilmente.
3. Registrar actividades y cambiar el estado del expediente.
4. Que la información no se pierda al recargar la página.
5. Que sea fácil de usar (pocos clicks, mensajes claros).

### Datos principales
- Nombre o alias de la persona
- Descripción del asunto
- Nombre del responsable
- Identificador único (se genera automático)
- Fecha y hora de apertura
- Estado (Abierto → En seguimiento → Cerrado)
- Actividades (descripción + fecha/hora)
- Motivo de cierre

### Reglas importantes
- Solo se puede cerrar un expediente si ya tiene al menos una actividad y se escribe un motivo.
- Un expediente cerrado ya no acepta nuevas actividades ni cambios de estado.
- Los campos obligatorios no pueden ir vacíos ni solo con espacios.
- Todo se guarda en el navegador (localStorage).

### Supuestos
- Se usarán solo datos ficticios.
- No se necesita login ni usuarios.
- No se suben documentos.
- La aplicación funciona solo en el navegador (no necesita internet ni servidor).

---

## 2. Responsabilidades del equipo

| Integrante     | Responsabilidad principal                          | Cómo integra su trabajo |
|----------------|----------------------------------------------------|-------------------------|
| Coordinador (yo) | README, integración final, commits y revisión general | Revisa y une el código de todos |
| Persona 2      | Interfaz (HTML + CSS)                              | Entrega pantallas limpias |
| Persona 3      | Crear expedientes + validaciones                   | Función de apertura lista |
| Persona 4      | Actividades + cambios de estado + historial        | Lógica de seguimiento y cierre |
| Persona 5      | localStorage + búsqueda                            | Que se guarde y se pueda buscar |

**Forma de trabajar:**  
Cada quien hace su parte en su rama o archivo. El coordinador integra todo y hace los commits principales. Nos comunicamos por WhatsApp/Discord para no pisarnos el código.

---

## 3. Decisiones y uso de IA
*(Se completará durante el desarrollo)*

| Decisión o necesidad | Aporte de la IA | Decisión del equipo y razón | Cómo se comprobó |
|-----------------------|-----------------|-----------------------------|------------------|
|                       |                 |                             |                  |
|                       |                 |                             |                  |
|                       |                 |                             |                  |

---

## 4. Lista de comprobación
*(Se llenará al final)*

| Recorrido              | Resultado observado | Cumple / Parcial / No cumple |
|------------------------|---------------------|------------------------------|
| 1. Apertura            |                     |                              |
| 2. Consulta            |                     |                              |
| 3. Seguimiento y cierre|                     |                              |
| Persistencia (recargar)|                     |                              |

---

## Cómo ejecutar
1. Abrir `index.html` en el navegador.
2. No se necesita instalar nada.
