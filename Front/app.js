const API_URL = 'http://api-valenti:5000';

const loadMesas = () => {
  fetch(`${API_URL}/mesas`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("mesasList");
      list.innerHTML = "";
      data.forEach(mesa => {
        const li = document.createElement("li");
        li.textContent = `Mesa ${mesa.id}: ${mesa.nombre} (${mesa.capacidad}) - ${mesa.estado}`;

        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group";

        // Botón borrar
        const btnDel = document.createElement("button");
        btnDel.textContent = "Borrar";
        btnDel.onclick = () => {
          fetch(`${API_URL}/mesas/${mesa.id}`, { method: "DELETE" })
            .then(() => loadMesas());
        };

        // Botón actualizar
        const btnUpd = document.createElement("button");
        btnUpd.textContent = "Actualizar";
        btnUpd.className = "update";
        btnUpd.onclick = () => {
          const nuevoNombre = prompt("Nuevo nombre", mesa.nombre);
          const nuevaCap = prompt("Nueva capacidad", mesa.capacidad);
          const nuevoEstado = prompt("Nuevo estado", mesa.estado);
          fetch(`${API_URL}/mesas/${mesa.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevoNombre, capacidad: Number(nuevaCap), estado: nuevoEstado })
          }).then(() => loadMesas());
        };

        btnGroup.appendChild(btnUpd);
        btnGroup.appendChild(btnDel);
        li.appendChild(btnGroup);
        list.appendChild(li);
      });
    });
};

document.getElementById("addMesa").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const capacidad = document.getElementById("capacidad").value;
  fetch(`${API_URL}/mesas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, capacidad: Number(capacidad) })
  }).then(() => {
    document.getElementById("nombre").value = "";
    document.getElementById("capacidad").value = "";
    loadMesas();
  });
});

// Cargar mesas al iniciar
loadMesas();
