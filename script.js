const USERS = {
  "582947": { name: "Carlos", control: "tecnico1" },
  "647382": { name: "María", control: "soporte2" },
  "749120": { name: "Jorge", control: "empresa3" }
};

let currentUser = null;
let currentMode = null;
let data = {};

const authScreen = document.getElementById("auth-screen");
const menuScreen = document.getElementById("menu-screen");
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const backToMenuBtn = document.getElementById("back-to-menu");

// 👁️ Mostrar/Ocultar palabra
document.getElementById("toggle-pass").addEventListener("click", () => {
  const pass = document.getElementById("user-pass");
  pass.type = pass.type === "password" ? "text" : "password";
});

// 🔹 Login
document.getElementById("login-btn").addEventListener("click", () => {
  const id = document.getElementById("user-id").value.trim();
  const pass = document.getElementById("user-pass").value.trim();
  const msg = document.getElementById("auth-msg");

  if (!id || !pass) return msg.textContent = "❗ Completa ambos campos.";
  const user = USERS[id];
  if (!user) return msg.textContent = "❌ Usuario no encontrado.";
  if (pass !== user.control) return msg.textContent = "❌ Palabra incorrecta.";

  currentUser = user;
  msg.textContent = "";
  authScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
});

// 🔹 Seleccionar modo
function selectMode(mode) {
  currentMode = mode;
  menuScreen.classList.add("hidden");
  chatContainer.classList.remove("hidden");
  chatBox.innerHTML = "";
  document.getElementById("chat-title").textContent = mode.toUpperCase();
  addMessage("bot", `Has entrado en el modo "${mode.toUpperCase()}".`);
  loadQuickOptions(mode);
}

// 🔹 Volver al menú
backToMenuBtn.addEventListener("click", () => {
  chatContainer.classList.add("hidden");
  menuScreen.classList.remove("hidden");
  chatBox.innerHTML = "";
});

// 🔹 Cerrar sesión
function logout() {
  currentUser = null;
  document.getElementById("user-id").value = "";
  document.getElementById("user-pass").value = "";
  chatContainer.classList.add("hidden");
  menuScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
}

// 🔹 Mostrar mensaje en chat
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerHTML = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🔹 Cargar opciones rápidas
function loadQuickOptions(mode) {
  const quickOptions = document.getElementById("quick-options");
  quickOptions.innerHTML = "";
  const items = data[mode] || [];

  items.forEach(item => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = item.preguntas[0];
    btn.onclick = () => sendMessage(item.preguntas[0], false, mode);
    quickOptions.appendChild(btn);
  });

  // Botón IA
  const aiBtn = document.createElement("button");
  aiBtn.classList.add("option-btn");
  aiBtn.textContent = "No encuentro mi problema (IA)";
  aiBtn.onclick = async () => {
    if (!currentMode) {
      alert("❗ Debes seleccionar primero un modo de ayuda.");
      return;
    }
    const text = prompt("Describe tu problema:");
    if (text) sendMessage(text, true, currentMode);
  };
  quickOptions.appendChild(aiBtn);
}

// 🔹 Ll
