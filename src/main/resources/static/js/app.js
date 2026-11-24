const API_CANALES = "http://localhost:8080/api/canales";
const API_CONTENIDOS = "http://localhost:8080/api/contenidos";

document.addEventListener("DOMContentLoaded", () => {
    listarCanales();
    listarContenidos();
});

// Cambia la etiqueta dinámica según el tipo de contenido elegido
document.getElementById("tipoContenido").addEventListener("change", (e) => {
    const label = document.getElementById("labelExtra");
    const input = document.getElementById("datoExtra");
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
document.getElementById("form-canal").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("idCanal").value;
    const canal = {
        nombre: document.getElementById("nombreCanal").value.trim(),
        suscriptores: parseInt(document.getElementById("suscriptoresCanal").value)
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

document.getElementById("cancelarCanal").addEventListener("click", limpiarFormCanal);

function limpiarFormCanal() {
    document.getElementById("form-canal").reset();
    document.getElementById("idCanal").value = "";
}

function listarCanales() {
    fetch(API_CANALES)
        .then(res => res.json())
        .then(canales => {
            const tbody = document.getElementById("tabla-canales");
            const select = document.getElementById("selectCanal");
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
            document.getElementById("idCanal").value = c.id;
            document.getElementById("nombreCanal").value = c.nombre;
            document.getElementById("suscriptoresCanal").value = c.suscriptores;
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
document.getElementById("form-contenido").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("idContenido").value;
    const tipo = document.getElementById("tipoContenido").value;
    const extra = document.getElementById("datoExtra").value.trim();

    const payload = {
        tipo: tipo,
        titulo: document.getElementById("tituloContenido").value.trim(),
        duracionMinutos: parseFloat(document.getElementById("duracionContenido").value),
        canal: { id: parseInt(document.getElementById("selectCanal").value) }
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

document.getElementById("cancelarContenido").addEventListener("click", limpiarFormContenido);

function limpiarFormContenido() {
    document.getElementById("form-contenido").reset();
    document.getElementById("idContenido").value = "";
    document.getElementById("tipoContenido").disabled = false;
    document.getElementById("labelExtra").textContent = "Álbum";
}

function listarContenidos() {
    fetch(API_CONTENIDOS)
        .then(res => res.json())
        .then(lista => {
            const tbody = document.getElementById("tabla-contenidos");
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
            document.getElementById("idContenido").value = item.id;
            const selectTipo = document.getElementById("tipoContenido");
            selectTipo.value = item.tipo;
            selectTipo.dispatchEvent(new Event("change"));
            selectTipo.disabled = true; // El tipo de entidad no cambia al editar

            document.getElementById("selectCanal").value = item.canal.id;
            document.getElementById("tituloContenido").value = item.titulo;
            document.getElementById("duracionContenido").value = item.duracionMinutos;
            document.getElementById("datoExtra").value = item.album ?? item.calidad ?? item.numeroEpisodio;
        });
}

function eliminarContenido(id) {
    if (!confirm("¿Eliminar elemento de la playlist?")) return;
    fetch(`${API_CONTENIDOS}/${id}`, { method: "DELETE" })
        .then(() => listarContenidos());
}