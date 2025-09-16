// app.js — registra o Service Worker e gerencia instalação PWA

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => {
      document.getElementById('swStatus').textContent = 'Service Worker registrado';
    })
    .catch(err => {
      document.getElementById('swStatus').textContent = 'Erro: ' + err;
    });
} else {
  document.getElementById('swStatus').textContent = 'Service Worker não suportado';
}

// Instalação PWA
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
installBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  alert('Escolha: ' + choice.outcome);
  deferredPrompt = null;
  installBtn.style.display = 'none';
});
