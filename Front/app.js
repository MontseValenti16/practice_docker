// Cambiar nombre del servicio Docker por IP pública
const API_URL = 'http://54.167.5.5:5000';

// Función para cargar todas las mesas
const loadMesas = async () => {
  try {
    const res = await fetch(`${API_URL}/mesas`);
    if (!res.ok) throw new Error(`Error al cargar mesas: ${res.status}`);
    const data = await res.json();

    const list = document.getElementById("mesasList");
    list.innerHTML = "";

    data.forEach(mesa => {
      const li = document.createElement("li");
      li.textContent = `Mesa ${mesa.id}: ${mesa.nombre} (${mesa.capacidad}) - ${mesa.estado}`;

      const btnGroup = document.createElement("div");
      btnGroup.className = "btn-group";

      // Botón actualizar
      const btnUpd = document.createElement("button");
      btnUpd.textContent = "Actualizar";
      btnUpd.className = "update";
      btnUpd.onclick = async () => {
        const nuevoNombre = prompt("Nuevo nombre", mesa.nombre);
        const nuevaCap = prompt("Nueva capacidad", mesa.capacidad);
        const nuevoEstado = prompt("Nuevo estado", mesa.estado);

        try {
          await fetch(`${API_URL}/mesas/${mesa.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevoNombre, capacidad: Number(nuevaCap), estado: nuevoEstado })
          });
          loadMesas();
        } catch (error) {
          console.error(error);
          alert("Error al actualizar mesa");
        }
      };

      // Botón borrar
      const btnDel = document.createElement("button");
      btnDel.textContent = "Borrar";
      btnDel.onclick = async () => {
        try {
          await fetch(`${API_URL}/mesas/${mesa.id}`, { method: "DELETE" });
          loadMesas();
        } catch (error) {
          console.error(error);
          alert("Error al borrar mesa");
        }
      };

      btnGroup.appendChild(btnUpd);
      btnGroup.appendChild(btnDel);
      li.appendChild(btnGroup);
      list.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    alert("No se pudieron cargar las mesas. Verifica que el backend esté levantado.");
  }
};

// Evento para agregar nueva mesa
document.getElementById("addMesa").addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value;
  const capacidad = document.getElementById("capacidad").value;

  if (!nombre || !capacidad) {
    alert("Nombre y capacidad son requeridos");
    return;
  }

  try {
    await fetch(`${API_URL}/mesas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, capacidad: Number(capacidad) })
    });
    document.getElementById("nombre").value = "";
    document.getElementById("capacidad").value = "";
    loadMesas();
  } catch (error) {
    console.error(error);
    alert("Error al agregar mesa");
  }
});

// Cargar mesas al iniciar
loadMesas();
