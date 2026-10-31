let expedientes = JSON.parse(localStorage.getItem("expedientes")) || [];
let expedienteActual = null;

// ========== CREAR EXPEDIENTE ==========
document.getElementById("form-expediente").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const responsable = document.getElementById("responsable").value.trim();
  const categoria = document.getElementById("categoria").value;

  if (!nombre || !descripcion || !responsable) {
    mostrarMensaje("Todos los campos obligatorios deben llenarse.", "red");
    return;
  }

  const nuevo = {
    id: "EXP-" + Date.now(),
    nombre,
    descripcion,
    responsable,
    categoria: categoria || "Sin categoría",
    estado: "Abierto",
    fechaApertura: new Date().toLocaleString("es-GT"),
    actividades: [],
    historial: [{
      tipo: "estado",
      texto: "Expediente abierto",
      fecha: new Date().toLocaleString("es-GT")
    }]
  };

  expedientes.push(nuevo);
  localStorage.setItem("expedientes", JSON.stringify(expedientes));

  mostrarMensaje("Expediente creado: " + nuevo.id, "green");
  document.getElementById("form-expediente").reset();
  mostrarExpedientes(expedientes);
});

function mostrarMensaje(texto, color) {
  const msg = document.getElementById("mensaje");
  msg.textContent = texto;
  msg.style.color = color;
}

// ========== LISTADO Y BÚSQUEDA ==========
function mostrarExpedientes(lista) {
  const contenedor = document.getElementById("lista-expedientes");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No hay expedientes para mostrar.</p>";
    return;
  }

  lista.forEach(exp => {
    const div = document.createElement("div");
    div.className = "tarjeta";

    div.innerHTML = `
      <strong>${exp.id}</strong> — ${exp.nombre}<br>
      Responsable: ${exp.responsable}<br>
      Estado: <b>${exp.estado}</b>
    `;

    const btn = document.createElement("button");
    btn.textContent = "Ver detalle";
    btn.className = "btn-secundario";
    btn.style.marginTop = "10px";
    btn.onclick = () => verDetalle(exp.id);
    div.appendChild(btn);

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

// ========== DETALLE ==========
function verDetalle(id) {
  expedienteActual = expedientes.find(e => e.id === id);
  if (!expedienteActual) return;

  document.getElementById("listado").classList.add("oculto");
  document.getElementById("crear-expediente").classList.add("oculto");
  document.getElementById("detalle").classList.remove("oculto");

  document.getElementById("info-detalle").innerHTML = `
    <p><strong>ID:</strong> ${expedienteActual.id}</p>
    <p><strong>Persona:</strong> ${expedienteActual.nombre}</p>
    <p><strong>Asunto:</strong> ${expedienteActual.descripcion}</p>
    <p><strong>Responsable:</strong> ${expedienteActual.responsable}</p>
    <p><strong>Categoría:</strong> ${expedienteActual.categoria}</p>
    <p><strong>Estado:</strong> <b>${expedienteActual.estado}</b></p>
    <p><strong>Apertura:</strong> ${expedienteActual.fechaApertura}</p>
  `;

  // Zona actividad
  const zonaAct = document.getElementById("zona-actividad");
  if (expedienteActual.estado === "Cerrado") {
    zonaAct.innerHTML = "<p style='color:#c53030;'>Expediente cerrado. No se pueden agregar actividades.</p>";
  } else {
    zonaAct.innerHTML = `
      <textarea id="nueva-actividad" rows="2" placeholder="Descripción de la actividad..."></textarea>
      <br><br>
      <button onclick="agregarActividad()" class="btn-principal">Agregar actividad</button>
    `;
  }

  // Zona estado
  const zonaEst = document.getElementById("zona-estado");
  if (expedienteActual.estado === "Abierto") {
    zonaEst.innerHTML = `<button onclick="cambiarEstado('En seguimiento')" class="btn-principal">Pasar a En seguimiento</button>`;
  } else if (expedienteActual.estado === "En seguimiento") {
    zonaEst.innerHTML = `
      <input type="text" id="motivo-cierre" placeholder="Motivo de cierre" style="max-width:280px; margin-bottom:10px;">
      <br>
      <button onclick="cerrarExpediente()" class="btn-principal">Cerrar expediente</button>
    `;
  } else {
    zonaEst.innerHTML = "<p>Expediente cerrado. No se puede cambiar el estado.</p>";
  }

  mostrarHistorial();
}

function mostrarHistorial() {
  const cont = document.getElementById("historial");
  cont.innerHTML = "";
  expedienteActual.historial.forEach(item => {
    const p = document.createElement("p");
    p.innerHTML = `<small>${item.fecha}</small> — <b>${item.tipo.toUpperCase()}</b>: ${item.texto}`;
    cont.appendChild(p);
  });
}

function agregarActividad() {
  const texto = document.getElementById("nueva-actividad").value.trim();
  if (!texto) {
    alert("La descripción de la actividad es obligatoria");
    return;
  }

  const actividad = {
    tipo: "actividad",
    texto: texto,
    fecha: new Date().toLocaleString("es-GT")
  };

  expedienteActual.actividades.push(actividad);
  expedienteActual.historial.push(actividad);
  guardarYActualizar();
}

function cambiarEstado(nuevoEstado) {
  expedienteActual.estado = nuevoEstado;
  expedienteActual.historial.push({
    tipo: "estado",
    texto: "Cambió a " + nuevoEstado,
    fecha: new Date().toLocaleString("es-GT")
  });
  guardarYActualizar();
}

function cerrarExpediente() {
  const motivo = document.getElementById("motivo-cierre").value.trim();

  if (expedienteActual.actividades.length === 0) {
    alert("No se puede cerrar. Debe tener al menos una actividad.");
    return;
  }
  if (!motivo) {
    alert("Debes escribir un motivo de cierre.");
    return;
  }

  expedienteActual.estado = "Cerrado";
  expedienteActual.historial.push({
    tipo: "estado",
    texto: "Cerrado. Motivo: " + motivo,
    fecha: new Date().toLocaleString("es-GT")
  });
  guardarYActualizar();
}

function guardarYActualizar() {
  const index = expedientes.findIndex(e => e.id === expedienteActual.id);
  expedientes[index] = expedienteActual;
  localStorage.setItem("expedientes", JSON.stringify(expedientes));
  verDetalle(expedienteActual.id);
}

function cerrarDetalle() {
  document.getElementById("detalle").classList.add("oculto");
  document.getElementById("listado").classList.remove("oculto");
  document.getElementById("crear-expediente").classList.remove("oculto");
  mostrarExpedientes(expedientes);
}

// Al cargar la página
mostrarExpedientes(expedientes);