// app.js - Gestor de Tareas Académicas

// Elementos del DOM
const taskForm = document.getElementById('taskForm');
const tituloInput = document.getElementById('titulo');
const cursoInput = document.getElementById('curso');
const fechaEntregaInput = document.getElementById('fechaEntrega');
const alertContainer = document.getElementById('alertContainer');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.btn-filter');

// 1. Estado y Persistencia
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'todas';

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Muestra alertas dinámicas de Bootstrap
function showAlert(message, type = 'danger') {
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mb-3" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

function clearAlert() {
  alertContainer.innerHTML = '';
}

// 2. Captura y Validación del Formulario
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearAlert();

  const titulo = tituloInput.value.trim();
  const curso = cursoInput.value.trim();
  const fechaEntrega = fechaEntregaInput.value;

  // Validación de campos vacíos
  if (!titulo || !curso || !fechaEntrega) {
    showAlert('Por favor, completa todos los campos del formulario.');
    return;
  }

  // Validación: Fecha debe ser posterior a la fecha actual (comparando a medianoche)
  const selectedDate = new Date(fechaEntrega + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate <= today) {
    showAlert('La fecha de entrega debe ser posterior a la fecha actual.');
    return;
  }

  // Estructura del objeto de tarea
  const newTask = {
    id: Date.now(),
    titulo,
    curso,
    fechaEntrega,
    completada: false
  };

  tasks.push(newTask);
  saveToLocalStorage();
  renderTasks();

  taskForm.reset();
  showAlert('¡Tarea agregada exitosamente!', 'success');
});

// 3. Manipulación Dinámica del DOM y Métodos Iterativos ES6+
function renderTasks() {
  // Uso de filter para filtrar el arreglo según el estado
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'pendientes') return !task.completada;
    if (currentFilter === 'completadas') return task.completada;
    return true; // 'todas'
  });

  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<li class="list-group-item text-center text-muted">No hay tareas disponibles.</li>`;
    return;
  }

  // Uso de map / forEach para renderizar
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completada ? 'bg-light' : ''}`;
    
    li.innerHTML = `
      <div class="form-check">
        <input class="form-check-input me-2" type="checkbox" id="task-${task.id}" ${task.completada ? 'checked' : ''} onchange="toggleTask(${task.id})">
        <label class="form-check-label ${task.completada ? 'text-decoration-line-through text-muted' : ''}" for="task-${task.id}">
          <strong>${task.titulo}</strong> <span class="badge bg-secondary ms-1">${task.curso}</span>
          <br>
          <small class="text-muted">Entrega: ${task.fechaEntrega}</small>
        </label>
      </div>
      <button class="btn btn-outline-danger btn-sm" onclick="deleteTask(${task.id})">
        Eliminar
      </button>
    `;

    taskList.appendChild(li);
  });
}

// Cambiar estado de completada / pendiente mediante find()
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completada = !task.completada;
    saveToLocalStorage();
    renderTasks();
  }
}

// Eliminar tarea mediante filter()
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveToLocalStorage();
  renderTasks();
}

// Control del Filtro Visual (Todas / Pendientes / Completadas)
filterButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterButtons.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    currentFilter = e.target.getAttribute('data-filter');
    renderTasks();
  });
});

// Inicialización
document.addEventListener('DOMContentLoaded', renderTasks);