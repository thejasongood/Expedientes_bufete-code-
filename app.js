// Cargar expedientes guardados o empezar vacío
let expedientes = JSON.parse(localStorage.getItem("expedientes")) || [];

// Escuchar el formulario
document.getElementById("form-expediente").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const responsable = document.getElementById("responsable").value.trim();
  const categoria = document.getElementById("categoria").value;

  // Validar que no estén vacíos
  if (!nombre || !descripcion || !responsable) {
    document.getElementById("mensaje").textContent = "Todos los campos obligatorios deben llenarse.";
    document.getElementById("mensaje").style.color = "red";
    return;
  }

  // Crear el expediente
  const nuevo = {
    id: "EXP-" + Date.now(),
    nombre: nombre,
    descripcion: descripcion,
    responsable: responsable,
    categoria: categoria || "Sin categoría",
    estado: "Abierto",
    fechaApertura: new Date().toLocaleString("es-GT"),
    actividades: [],
    historial: [
      {
        tipo: "estado",
        texto: "Expediente abierto",
        fecha: new Date().toLocaleString("es-GT")
      }
    ]
  };

  expedientes.push(nuevo);
  localStorage.setItem("expedientes", JSON.stringify(expedientes));

  document.getElementById("mensaje").textContent = "Expediente creado: " + nuevo.id;
  document.getElementById("mensaje").style.color = "green";

  // Limpiar formulario
  document.getElementById("form-expediente").reset();
});