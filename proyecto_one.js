// scripts.js

// Detectar en qué página estamos para ejecutar solo lo necesario
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('registroForm')) {
    iniciarRegistroLogin();
  }
  if (document.getElementById('tareaForm')) {
    iniciarOrganizador();
  }
});

// -------------------
// Registro y Login
// -------------------

function iniciarRegistroLogin() {
  const registroSection = document.getElementById('registroSection');
  const loginSection = document.getElementById('loginSection');

  const registroForm = document.getElementById('registroForm');
  const loginForm = document.getElementById('loginForm');

  const mensajeRegistro = document.getElementById('mensajeRegistro');
  const mensajeLogin = document.getElementById('mensajeLogin');

  const btnMostrarLogin = document.getElementById('btnMostrarLogin');
  const btnMostrarRegistro = document.getElementById('btnMostrarRegistro');

  // Mostrar Login
  btnMostrarLogin.addEventListener('click', () => {
    registroSection.style.display = 'none';
    registroSection.setAttribute('aria-hidden', 'true');
    loginSection.style.display = 'block';
    loginSection.setAttribute('aria-hidden', 'false');
    mensajeRegistro.textContent = '';
    mensajeLogin.textContent = '';
  });

  // Mostrar Registro
  btnMostrarRegistro.addEventListener('click', () => {
    loginSection.style.display = 'none';
    loginSection.setAttribute('aria-hidden', 'true');
    registroSection.style.display = 'block';
    registroSection.setAttribute('aria-hidden', 'false');
    mensajeRegistro.textContent = '';
    mensajeLogin.textContent = '';
  });

  // Registro
  registroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    mensajeRegistro.textContent = '';

    const nombre = document.getElementById('nombre').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    if (nombre.length < 3) {
      mensajeRegistro.textContent = 'El nombre debe tener al menos 3 caracteres.';
      return;
    }
    if (usuario.length < 3) {
      mensajeRegistro.textContent = 'El usuario debe tener al menos 3 caracteres.';
      return;
    }
    if (contrasena.length < 6) {
      mensajeRegistro.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    // Guardar perfil
    const perfil = { nombre, usuario, contrasena };
    localStorage.setItem('perfilGuardado', JSON.stringify(perfil));
    mensajeRegistro.style.color = 'green';
    mensajeRegistro.textContent = '✅ Perfil creado correctamente. Ahora podés iniciar sesión.';
    registroForm.reset();

    // Cambiar a login
    setTimeout(() => {
      btnMostrarLogin.click();
      mensajeRegistro.style.color = 'red'; // reset color para futuro
      mensajeRegistro.textContent = '';
    }, 1500);
  });

  // Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    mensajeLogin.textContent = '';

    const usuario = document.getElementById('loginUsuario').value.trim();
    const contrasena = document.getElementById('loginContrasena').value;

    const perfilGuardado = JSON.parse(localStorage.getItem('perfilGuardado'));

    if (!perfilGuardado) {
      mensajeLogin.textContent = 'No hay perfiles registrados. Por favor, creá uno.';
      return;
    }

    if (usuario === perfilGuardado.usuario && contrasena === perfilGuardado.contrasena) {
      sessionStorage.setItem('usuarioActivo', JSON.stringify(perfilGuardado));
      // Redirigir a organizador
      window.location.href = 'index.html';
    } else {
      mensajeLogin.textContent = '❌ Usuario o contraseña incorrectos.';
    }
  });

  // Si ya hay usuario activo, redirigir directamente
  const usuarioActivo = sessionStorage.getItem('usuarioActivo');
  if (usuarioActivo) {
    window.location.href = 'index.html';
  }
}

// -------------------
// Organizador, Calendario y Recordatorios
// -------------------

function iniciarOrganizador() {
  // Seguridad: verificar usuario activo
  const usuarioActivo = JSON.parse(sessionStorage.getItem('usuarioActivo'));
  if (!usuarioActivo) {
    window.location.href = 'index1.html';
    return;
  }

  document.getElementById('bienvenida').textContent = `¡Hola, ${usuarioActivo.nombre}!`;

  // --- TAREAS ---

  const tareaForm = document.getElementById('tareaForm');
  const nuevaTareaInput = document.getElementById('nuevaTarea');
  const listaTareas = document.getElementById('listaTareas');

  function obtenerTareas() {
    return JSON.parse(localStorage.getItem('tareas_' + usuarioActivo.usuario)) || [];
  }

  function guardarTareas(tareas) {
    localStorage.setItem('tareas_' + usuarioActivo.usuario, JSON.stringify(tareas));
  }

  function cargarTareas() {
    const tareas = obtenerTareas();
    listaTareas.innerHTML = '';
    tareas.forEach((tarea, index) => {
      const li = document.createElement('li');
      li.setAttribute('tabindex', '0');

      const span = document.createElement('span');
      span.textContent = tarea;
      li.appendChild(span);

      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.className = 'delete-btn';
      btnEliminar.setAttribute('aria-label', `Eliminar tarea: ${tarea}`);
      btnEliminar.onclick = () => {
        tareas.splice(index, 1);
        guardarTareas(tareas);
        cargarTareas();
      };

      li.appendChild(btnEliminar);
      listaTareas.appendChild(li);
    });
  }

  tareaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = nuevaTareaInput.value.trim();
    if (!texto) return;
    const tareas = obtenerTareas();
    tareas.push(texto);
    guardarTareas(tareas);
    nuevaTareaInput.value = '';
    cargarTareas();
    nuevaTareaInput.focus();
  });

  cargarTareas();

  // ---- recordatorios ---- 

const recordatorioForm = document.getElementById('recordatorioForm');
const nuevoRecordatorioInput = document.getElementById('reminderInput');
const listaRecordatorio = document.getElementById('reminderList');

function obtenerRecordatorio() {
  return JSON.parse(localStorage.getItem('recordatorio_' + usuarioActivo.usuario)) || [];
}

function guardarRecordatorio(recordatorio) {
  localStorage.setItem('recordatorio_' + usuarioActivo.usuario, JSON.stringify(recordatorio));
}

function cargarRecordatorio() {
  const recordatorio = obtenerRecordatorio();
  listaRecordatorio.innerHTML = '';
  recordatorio.forEach((texto, index) => {
    const li = document.createElement('li');
    li.setAttribute('tabindex', '0');

    const span = document.createElement('span');
    span.textContent = texto;
    li.appendChild(span);

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'delete-btn';
    btnEliminar.setAttribute('aria-label', `Eliminar recordatorio: ${texto}`);
    btnEliminar.onclick = () => {
      recordatorio.splice(index, 1);
      guardarRecordatorio(recordatorio);
      cargarRecordatorio();
    };

    li.appendChild(btnEliminar);
    listaRecordatorio.appendChild(li); // ✅ Esta es la línea corregida
  });
}

recordatorioForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = nuevoRecordatorioInput.value.trim();
  if (!texto) return;
  const recordatorio = obtenerRecordatorio();
  recordatorio.push(texto);
  guardarRecordatorio(recordatorio);
  nuevoRecordatorioInput.value = '';
  cargarRecordatorio();
  nuevoRecordatorioInput.focus();
});

cargarRecordatorio();


  // --- CERRAR SESIÓN ---
  document.getElementById('btnCerrarSesion').addEventListener('click', () => {
    sessionStorage.removeItem('usuarioActivo');
    window.location.href = 'index1.html';
  });

  // --- CALENDARIO ---

  const calendarEl = document.getElementById('calendar');
  const monthYearEl = document.getElementById('monthYear');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  let currentDate = new Date();

  function getMarkedDays(year, month) {
    const key = `marcadas-${usuarioActivo.usuario}-${year}-${month}`;
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  function saveMarkedDays(year, month, days) {
    const key = `marcadas-${usuarioActivo.usuario}-${year}-${month}`;
    localStorage.setItem(key, JSON.stringify(days));
  }

  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    monthYearEl.textContent = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    calendarEl.innerHTML = '';

    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    diasSemana.forEach(dia => {
      const dayName = document.createElement('div');
      dayName.classList.add('day-name');
      dayName.textContent = dia;
      calendarEl.appendChild(dayName);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekDay = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();
    const markedDays = getMarkedDays(year, month);

    for (let i = 0; i < firstWeekDay; i++) {
      const empty = document.createElement('div');
      empty.classList.add('day', 'inactive');
      calendarEl.appendChild(empty);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('day');
      dayDiv.textContent = d;
      if (markedDays.includes(d)) dayDiv.classList.add('marked');
      dayDiv.addEventListener('click', () => {
        const index = markedDays.indexOf(d);
        if (index > -1) markedDays.splice(index, 1);
        else markedDays.push(d);
        saveMarkedDays(year, month, markedDays);
        renderCalendar(date);
      });
      calendarEl.appendChild(dayDiv);
    }
  }

  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate);}

  