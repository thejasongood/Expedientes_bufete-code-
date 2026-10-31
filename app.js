let expedientes = JSON.parse(localStorage.getItem("expedientes")) || [];
let expedienteActual = null;

// ========== CREAR ==========
document.getElementById("form-expediente").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const responsable = document.getElementById("responsable").value.trim();
  const categoria = document.getElementById("categoria").value;

  if (!nombre || !descripcion || !responsable) {
    mostrarMensaje("Completa todos los campos obligatorios.", "var(--rojo)");
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

  mostrarMensaje("Expediente creado correctamente: " + nuevo.id, "var(--verde)");
  document.getElementById("form-expediente").reset();
  mostrarExpedientes(expedientes);
});

function mostrarMensaje(texto, color) {
  const msg = document.getElementById("mensaje");
  msg.textContent = texto;
  msg.style.color = color;
}

// ========== LISTADO ==========
function mostrarExpedientes(lista) {
  const contenedor = document.getElementById("lista-expedientes");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = "<p style='color:#718096;'>No hay expedientes para mostrar.</p>";
    return;
  }

  lista.forEach(exp => {
    const div = document.createElement("div");
    div.className = "tarjeta";

    div.innerHTML = `
      <div class="tarjeta-info">
        <strong>${exp.id}</strong> — ${exp.nombre}<br>
        <span style="font-size:0.85rem; color:#718096;">Responsable: ${exp.responsable}</span>
        <div style="margin-top:6px;">
          <span class="estado ${exp.estado}">${exp.estado}</span>
        </div>
      </div>
    `;

    const btn = document.createElement("button");
    btn.textContent = "Ver detalle";
    btn.className = "btn btn-secondary";
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
    document.getElementById("lista-expedientes").innerHTML = "<p style='color:#718096;'>No se encontraron resultados.</p>";
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
    <p><strong>Estado:</strong> <span class="estado ${expedienteActual.estado}">${expedienteActual.estado}</span></p>
    <p><strong>Persona:</strong> ${expedienteActual.nombre}</p>
    <p><strong>Responsable:</strong> ${expedienteActual.responsable}</p>
    <p><strong>Categoría:</strong> ${expedienteActual.categoria}</p>
    <p><strong>Apertura:</strong> ${expedienteActual.fechaApertura}</p>
    <p style="grid-column: 1 / -1;"><strong>Asunto:</strong> ${expedienteActual.descripcion}</p>
  `;

  // Zona actividad
  const zonaAct = document.getElementById("zona-actividad");
  if (expedienteActual.estado === "Cerrado") {
    zonaAct.innerHTML = `<p style="color:var(--rojo); font-size:0.9rem;">Expediente cerrado. No se pueden agregar actividades.</p>`;
  } else {
    zonaAct.innerHTML = `
      <textarea id="nueva-actividad" rows="2" placeholder="Descripción de la actividad..."></textarea>
      <div style="margin-top:10px;">
        <button onclick="agregarActividad()" class="btn btn-primary">Agregar actividad</button>
      </div>
    `;
  }

  // Zona estado
  const zonaEst = document.getElementById("zona-estado");
  if (expedienteActual.estado === "Abierto") {
    zonaEst.innerHTML = `<button onclick="cambiarEstado('En seguimiento')" class="btn btn-primary">Pasar a En seguimiento</button>`;
  } else if (expedienteActual.estado === "En seguimiento") {
    zonaEst.innerHTML = `
      <input type="text" id="motivo-cierre" placeholder="Motivo de cierre" style="max-width:300px; margin-bottom:10px;">
      <br>
      <button onclick="cerrarExpediente()" class="btn btn-primary">Cerrar expediente</button>
    `;
  } else {
    // Cerrado → Reabrir
    zonaEst.innerHTML = `
      <input type="text" id="motivo-reabrir" placeholder="Motivo de reapertura" style="max-width:300px; margin-bottom:10px;">
      <br>
      <button onclick="reabrirExpediente()" class="btn btn-primary">Reabrir expediente</button>
    `;
  }

  mostrarHistorial();
}

function mostrarHistorial() {
  const cont = document.getElementById("historial");
  cont.innerHTML = "";

  [...expedienteActual.historial].reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "historial-item";
    div.innerHTML = `
      <span class="fecha">${item.fecha}</span><br>
      <span class="tipo">${item.tipo.toUpperCase()}</span> ${item.texto}
    `;
    cont.appendChild(div);
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

function reabrirExpediente() {
  if (expedienteActual.estado !== "Cerrado") {
    alert("Solo se pueden reabrir expedientes que estén Cerrados.");
    return;
  }

  const motivo = document.getElementById("motivo-reabrir").value.trim();
  if (!motivo) {
    alert("Debes escribir un motivo de reapertura.");
    return;
  }

  expedienteActual.estado = "En seguimiento";
  expedienteActual.historial.push({
    tipo: "estado",
    texto: "Reabierto. Motivo: " + motivo,
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

// Iniciar
mostrarExpedientes(expedientes);