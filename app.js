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
// ======================
// LISTADO Y BÚSQUEDA
// ======================

function mostrarExpedientes(lista) {
  const contenedor = document.getElementById("lista-expedientes");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No hay expedientes para mostrar.</p>";
    return;
  }

  lista.forEach(exp => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ddd";
    div.style.padding = "12px";
    div.style.marginBottom = "10px";
    div.style.borderRadius = "6px";
    div.style.background = "#fafafa";

    div.innerHTML = `
      <strong>${exp.id}</strong> - ${exp.nombre}<br>
      Responsable: ${exp.responsable}<br>
      Estado: <b>${exp.estado}</b><br>
      <button onclick="verDetalle('${exp.id}')">Ver detalle</button>
    `;

    contenedor.appendChild(div);
  });
}

function buscarExpedientes() {
  const texto = document.getElementById("buscar").value.trim().toLowerCase();

  if (!texto) {
    mostrarExpedientes(expedientes);
    return;
  }

  const filtrados = expedientes.filter(exp => 
    exp.id.toLowerCase().includes(texto) || 
    exp.nombre.toLowerCase().includes(texto)
  );

  if (filtrados.length === 0) {
    document.getElementById("lista-expedientes").innerHTML = "<p>No se encontraron resultados.</p>";
  } else {
    mostrarExpedientes(filtrados);
  }
}

function mostrarTodos() {
  document.getElementById("buscar").value = "";
  mostrarExpedientes(expedientes);
}

// Función temporal (la completamos después)
function verDetalle(id) {
  alert("Detalle del expediente: " + id + "\n(Lo terminamos en el siguiente paso)");
}

// Mostrar los expedientes al cargar la página
mostrarExpedientes(expedientes);