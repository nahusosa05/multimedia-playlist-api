const API_CANALES = "http://localhost:8080/api/canales";
const API_CONTENIDOS = "http://localhost:8080/api/contenidos";

document.addEventListener("DOMContentLoaded", () => {
    listarCanales();
    listarContenidos();
});

// Cambia la etiqueta dinámica según el tipo de contenido elegido
document.getElementById("contenido-tipo").addEventListener("change", (e) => {
    const label = document.getElementById("etiqueta-dato-extra");
    const input = document.getElementById("contenido-dato-extra");
    if (e.target.value === "CANCION") {
        label.textContent = "Álbum";
        input.type = "text";
    } else if (e.target.value === "VIDEO") {
        label.textContent = "Calidad (ej: 1080p, 4K)";
        input.type = "text";
    } else {
        label.textContent = "Número de Episodio";
        input.type = "number";
    }
});

// ==================== CRUD CANALES ====================
document.getElementById("formulario-canal").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("canal-id").value;
    const canal = {
        nombre: document.getElementById("canal-nombre").value.trim(),
        suscriptores: parseInt(document.getElementById("canal-suscriptores").value)
    };

    fetch(id ? `${API_CANALES}/${id}` : API_CANALES, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(canal)
    })
        .then(res => {
            if (!res.ok) throw new Error("Error al guardar canal");
            limpiarFormCanal();
            listarCanales();
        })
        .catch(err => alert(err.message));
});

document.getElementById("boton-cancelar-canal").addEventListener("click", limpiarFormCanal);

function limpiarFormCanal() {
    document.getElementById("formulario-canal").reset();
    document.getElementById("canal-id").value = "";
}

function listarCanales() {
    fetch(API_CANALES)
        .then(res => res.json())
        .then(canales => {
            const tbody = document.getElementById("cuerpo-tabla-canales");
            const select = document.getElementById("contenido-canal-select");
            tbody.innerHTML = "";
            select.innerHTML = '<option value="">Seleccione un canal...</option>';

            canales.forEach(c => {
                tbody.innerHTML += `
                    <tr>
                        <td>${c.id}</td>
                        <td>${c.nombre}</td>
                        <td>${c.suscriptores.toLocaleString()}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarCanal(${c.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarCanal(${c.id})">X</button>
                        </td>
                    </tr>`;
                select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
            });
        });
}

function editarCanal(id) {
    fetch(`${API_CANALES}/${id}`)
        .then(res => res.json())
        .then(c => {
            document.getElementById("canal-id").value = c.id;
            document.getElementById("canal-nombre").value = c.nombre;
            document.getElementById("canal-suscriptores").value = c.suscriptores;
        });
}

function eliminarCanal(id) {
    if (!confirm("¿Eliminar canal?")) return;
    fetch(`${API_CANALES}/${id}`, { method: "DELETE" })
        .then(async res => {
            if (!res.ok) {
                const msg = await res.text();
                alert(msg || "No se puede eliminar el canal.");
                return;
            }
            listarCanales();
        });
}

// ==================== CRUD PLAYLIST ====================
document.getElementById("formulario-contenido").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("contenido-id").value;
    const tipo = document.getElementById("contenido-tipo").value;
    const extra = document.getElementById("contenido-dato-extra").value.trim();

    const payload = {
        tipo: tipo,
        titulo: document.getElementById("contenido-titulo").value.trim(),
        duracionMinutos: parseFloat(document.getElementById("contenido-duracion").value),
        canal: { id: parseInt(document.getElementById("contenido-canal-select").value) }
    };

    if (tipo === "CANCION") payload.album = extra;
    else if (tipo === "VIDEO") payload.calidad = extra;
    else if (tipo === "PODCAST") payload.numeroEpisodio = parseInt(extra);

    fetch(id ? `${API_CONTENIDOS}/${id}` : API_CONTENIDOS, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (!res.ok) throw new Error("Error al guardar elemento");
            limpiarFormContenido();
            listarContenidos();
        })
        .catch(err => alert(err.message));
});

document.getElementById("boton-cancelar-contenido").addEventListener("click", limpiarFormContenido);

function limpiarFormContenido() {
    document.getElementById("formulario-contenido").reset();
    document.getElementById("contenido-id").value = "";
    document.getElementById("contenido-tipo").disabled = false;
    document.getElementById("etiqueta-dato-extra").textContent = "Álbum";
}

function listarContenidos() {
    fetch(API_CONTENIDOS)
        .then(res => res.json())
        .then(lista => {
            const tbody = document.getElementById("cuerpo-tabla-contenidos");
            tbody.innerHTML = "";

            lista.forEach(item => {
                let detalle = item.album ? `Álbum: ${item.album}`
                    : item.calidad ? `Calidad: ${item.calidad}`
                        : `Ep. #${item.numeroEpisodio}`;

                tbody.innerHTML += `
                    <tr>
                        <td><span class="badge bg-info text-dark">${item.tipo}</span></td>
                        <td>${item.titulo}</td>
                        <td>${item.canal ? item.canal.nombre : "-"}</td>
                        <td>${item.duracionMinutos.toFixed(2)}</td>
                        <td>${detalle}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarContenido(${item.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarContenido(${item.id})">X</button>
                        </td>
                    </tr>`;
            });
        });
}

function editarContenido(id) {
    fetch(`${API_CONTENIDOS}/${id}`)
        .then(res => res.json())
        .then(item => {
            document.getElementById("contenido-id").value = item.id;
            const selectTipo = document.getElementById("contenido-tipo");
            selectTipo.value = item.tipo;
            selectTipo.dispatchEvent(new Event("change"));
            selectTipo.disabled = true; // El tipo de entidad no cambia al editar

            document.getElementById("contenido-canal-select").value = item.canal.id;
            document.getElementById("contenido-titulo").value = item.titulo;
            document.getElementById("contenido-duracion").value = item.duracionMinutos;
            document.getElementById("contenido-dato-extra").value = item.album ?? item.calidad ?? item.numeroEpisodio;
        });
}

function eliminarContenido(id) {
    if (!confirm("¿Eliminar elemento de la playlist?")) return;
    fetch(`${API_CONTENIDOS}/${id}`, { method: "DELETE" })
        .then(() => listarContenidos());
}