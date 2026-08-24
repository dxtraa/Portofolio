// Ambil data portofolio dari JSON
fetch('data/portfolio.json')
  .then(res => res.json())
  .then(data => {
    // Hero
    document.getElementById('hero-name').textContent = data.profile.name;
    document.getElementById('hero-title').textContent = data.profile.title;

    // About
    document.getElementById('avatar').src = data.profile.avatar;
    document.getElementById('bio').textContent = data.profile.bio;

    // Projects
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = data.projects.map(project => `
      <div class="project-card">
        <img src="${project.image}" alt="${project.title}">
        <div class="card-body">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tags">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          ${project.link ? `<a href="${project.link}" target="_blank" class="btn" style="margin-top:1rem">Lihat Proyek</a>` : ''}
        </div>
      </div>
    `).join('');

    // Experience
    const expList = document.getElementById('experience-list');
    expList.innerHTML = '<h3>💼 Pengalaman</h3>' + data.experiences.map(exp => `
      <div class="exp-item">
        <div class="role">${exp.role}</div>
        <div class="company">${exp.company}</div>
        <div class="period">${exp.period}</div>
        <p>${exp.description}</p>
      </div>
    `).join('');

    // Education
    const eduList = document.getElementById('education-list');
    eduList.innerHTML = '<h3>🎓 Pendidikan</h3>' + data.education.map(edu => `
      <div class="edu-item">
        <div class="degree">${edu.degree}</div>
        <div class="institution">${edu.institution}</div>
        <div class="period">${edu.period}</div>
        <p>${edu.description}</p>
      </div>
    `).join('');

    // Skills
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');

    // Contact
    const contactInfo = document.getElementById('contact-info');
    contactInfo.innerHTML = `
      <p>📧 ${data.profile.email}</p>
      <p>📍 ${data.profile.location}</p>
      <p>
        ${data.profile.social.github ? `<a href="${data.profile.social.github}" target="_blank">GitHub</a>` : ''}
        ${data.profile.social.linkedin ? `<a href="${data.profile.social.linkedin}" target="_blank">LinkedIn</a>` : ''}
        ${data.profile.social.twitter ? `<a href="${data.profile.social.twitter}" target="_blank">Twitter</a>` : ''}
      </p>
    `;

    // Footer
    document.getElementById('footer-name').textContent = data.profile.name;
  })
  .catch(err => console.error('Gagal memuat data:', err));

// Animasi gelembung (bubbles)
const canvas = document.getElementById('bubbles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bubbles = [];
for (let i = 0; i < 50; i++) {
  bubbles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 8 + 2,
    speed: Math.random() * 1 + 0.5,
    opacity: Math.random() * 0.5 + 0.2
  });
}

function animateBubbles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubbles.forEach(b => {
    b.y -= b.speed;
    if (b.y < -10) {
      b.y = canvas.height + 10;
      b.x = Math.random() * canvas.width;
    }
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`;
    ctx.fill();
  });
  requestAnimationFrame(animateBubbles);
}
animateBubbles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
