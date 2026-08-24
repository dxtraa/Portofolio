// Simpan konfigurasi di localStorage biar tidak perlu ketik ulang
const defaultConfig = {
  token: '',
  owner: '',
  repo: '',
  path: 'data/portfolio.json'
};

function getConfig() {
  return {
    token: document.getElementById('token').value || localStorage.getItem('gh_token') || '',
    owner: document.getElementById('owner').value || localStorage.getItem('gh_owner') || '',
    repo: document.getElementById('repo').value || localStorage.getItem('gh_repo') || '',
    path: document.getElementById('path').value || localStorage.getItem('gh_path') || 'data/portfolio.json'
  };
}

function saveConfigToLocalStorage(config) {
  localStorage.setItem('gh_token', config.token);
  localStorage.setItem('gh_owner', config.owner);
  localStorage.setItem('gh_repo', config.repo);
  localStorage.setItem('gh_path', config.path);
}

// Isi otomatis dari localStorage saat halaman dibuka
window.onload = function() {
  if (localStorage.getItem('gh_token')) document.getElementById('token').value = localStorage.getItem('gh_token');
  if (localStorage.getItem('gh_owner')) document.getElementById('owner').value = localStorage.getItem('gh_owner');
  if (localStorage.getItem('gh_repo')) document.getElementById('repo').value = localStorage.getItem('gh_repo');
  if (localStorage.getItem('gh_path')) document.getElementById('path').value = localStorage.getItem('gh_path');
};

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = type;
  setTimeout(() => statusDiv.textContent = '', 5000);
}

async function loadData() {
  const config = getConfig();
  saveConfigToLocalStorage(config);
  if (!config.token || !config.owner || !config.repo) {
    showStatus('Mohon isi token, owner, dan repo!', 'error');
    return;
  }

  try {
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github+json'
      }
    });
    if (!response.ok) throw new Error(`Gagal memuat: ${response.status} ${response.statusText}`);
    const data = await response.json();
    const content = atob(data.content.replace(/\n/g, ''));
    document.getElementById('jsonEditor').value = content;
    showStatus('Data berhasil dimuat!', 'success');
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

async function saveData() {
  const config = getConfig();
  saveConfigToLocalStorage(config);
  if (!config.token || !config.owner || !config.repo) {
    showStatus('Mohon isi token, owner, dan repo!', 'error');
    return;
  }

  const newContent = document.getElementById('jsonEditor').value;
  try {
    // Validasi JSON
    JSON.parse(newContent);
  } catch {
    showStatus('JSON tidak valid! Periksa kembali.', 'error');
    return;
  }

  try {
    // Ambil SHA file saat ini
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github+json'
      }
    });
    if (!response.ok) throw new Error(`Gagal mengambil SHA: ${response.status}`);
    const data = await response.json();
    const sha = data.sha;

    // Commit perubahan
    const updateResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update portfolio data from admin panel',
        content: btoa(unescape(encodeURIComponent(newContent))),
        sha: sha
      })
    });

    if (!updateResponse.ok) throw new Error(`Gagal menyimpan: ${updateResponse.status} ${updateResponse.statusText}`);
    showStatus('Data berhasil disimpan! Tunggu beberapa menit untuk update di GitHub Pages.', 'success');
  } catch (error) {
    showStatus(error.message, 'error');
  }
}
