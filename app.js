const components = {
  'site-header': 'src/foundation/header.html',
  hero: 'src/sections/hero.html',
  services: 'src/sections/services.html',
  trust: 'src/sections/trust.html',
  testimonials: 'src/sections/testimonials.html',
  booking: 'src/sections/booking.html',
};

async function loadComponent(id, path) {
  const target = document.getElementById(id);
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    target.innerHTML = await response.text();
  } catch (error) {
    target.innerHTML = `<p class="component-error">Unable to load this section.</p>`;
    console.error(`Failed to load ${path}`, error);
  }
}

Promise.all(Object.entries(components).map(([id, path]) => loadComponent(id, path)));
document.getElementById('year').textContent = new Date().getFullYear();
