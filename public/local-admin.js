(() => {
  function applyFooterText() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const saleLink = footer.querySelector('a[data-path="propiedades-en-venta"]');
    const industrialLink = footer.querySelector('a[data-path="propiedades-en-alquiler"]');
    if (saleLink) saleLink.textContent = 'Propiedades en Venta';
    if (industrialLink) industrialLink.textContent = 'Alquileres industriales';
    footer.querySelectorAll('p').forEach(paragraph => {
      if (paragraph.textContent.includes('5859 CABA')) paragraph.textContent = 'Cumplimiento de la Ley 10.973 de la Provincia de Buenos Aires y normativas de corretaje inmobiliario vigentes.';
    });
    footer.querySelectorAll('span').forEach(span => {
      if (span.textContent.includes('Colegio Único de Corredores Inmobiliarios de la CABA')) span.remove();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyFooterText, { once: true });
  else applyFooterText();

  const grid = document.getElementById('propertyCardsGrid');
  const headerActions = document.querySelector('header > div > div:last-child');
  if (!grid || !headerActions) return;
  const cardTemplate = grid.querySelector('.property-card')?.outerHTML || '';

  const style = document.createElement('style');
  style.textContent = `
    .am-overlay{position:fixed;inset:0;z-index:100;display:none;place-items:center;padding:18px;background:rgba(20,22,24,.58);backdrop-filter:blur(4px)}
    .am-overlay.is-open{display:grid}.am-dialog{width:min(100%,560px);max-height:min(90vh,820px);overflow:auto;background:#fff;border-radius:18px;padding:26px;box-shadow:0 24px 80px #0003;color:#191c1d}
    .am-dialog.am-wide{width:min(100%,900px)}.am-title{font:700 24px/1.25 'Plus Jakarta Sans',sans-serif;margin:0 0 6px}.am-muted{color:#62666a;font-size:14px;margin:0 0 20px}
    .am-field{display:grid;gap:6px;margin:14px 0}.am-field label{font-weight:600;font-size:13px}.am-field input,.am-field textarea,.am-field select{width:100%;box-sizing:border-box;border:1px solid #d8dadd;border-radius:9px;padding:11px 12px;font:inherit;background:#fff}.am-field textarea{min-height:100px;resize:vertical}
    .am-actions{display:flex;align-items:center;justify-content:flex-end;gap:10px;margin-top:20px;flex-wrap:wrap}.am-button{border:0;border-radius:9px;padding:11px 16px;font:600 14px 'Inter',sans-serif;cursor:pointer;background:#191c1d;color:white}.am-button.am-secondary{background:#f0f1f2;color:#191c1d}.am-button.am-primary{background:#9d3e00;color:#fff}.am-close{float:right;border:0;background:#f1f2f3;border-radius:50%;height:34px;width:34px;font-size:20px;cursor:pointer}
    .am-error{color:#b42318;font-size:13px;min-height:18px}.am-admin-row,.am-user-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #eee}.am-admin-row strong,.am-user-row strong{display:block}.am-inline-actions{display:flex;gap:8px;flex-wrap:wrap}.am-small{padding:8px 11px;font-size:12px}.am-hidden{display:none!important}.am-drop{border:1px dashed #b9bdc1;border-radius:9px;padding:13px;color:#62666a;font-size:13px}.am-contact-link{color:inherit;text-decoration:none}
    .am-whatsapp-float{position:fixed;right:24px;bottom:24px;z-index:70;display:flex;align-items:center;gap:9px;padding:13px 18px;border-radius:999px;background:#20b858;color:#fff;text-decoration:none;font:700 15px 'Inter',sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.22);transition:transform .18s,background .18s}.am-whatsapp-float:hover{background:#159447;transform:translateY(-2px)}.am-whatsapp-float svg{width:25px;height:25px;flex:none}
    .am-sold-mark{position:absolute;inset:0;z-index:15;display:grid;place-items:center;pointer-events:none}.am-sold-mark::before{content:"";position:absolute;width:125%;height:8px;background:#d71920;transform:rotate(-24deg);box-shadow:0 1px 3px #0006}.am-sold-mark span{position:relative;padding:8px 18px;background:#d71920;color:#fff;font:800 16px 'Plus Jakarta Sans',sans-serif;letter-spacing:.08em;transform:rotate(-8deg);box-shadow:0 2px 8px #0005}
    .am-photo-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:10px}.am-photo-item{position:relative;border:1px solid #ddd;border-radius:9px;overflow:hidden;background:#f5f5f5}.am-photo-item img{display:block;width:100%;height:78px;object-fit:cover}.am-photo-item label{display:flex;align-items:center;gap:5px;padding:6px;font-size:11px}.am-photo-item input{width:auto}
     .am-detail-gallery{display:grid;gap:12px}.am-detail-main{grid-row:1;position:relative;background:#f2f3f4;border-radius:12px;min-height:300px;display:grid;place-items:center;overflow:hidden}.am-detail-main img{display:block;width:100%;height:min(58vh,520px);object-fit:contain}.am-detail-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:2;border:0;border-radius:50%;width:38px;height:38px;background:#191c1dcc;color:#fff;font-size:24px;cursor:pointer}.am-detail-arrow.prev{left:12px}.am-detail-arrow.next{right:12px}.am-detail-thumbs{grid-row:2;display:flex;gap:8px;overflow-x:auto;padding-bottom:3px}.am-detail-thumb{border:2px solid transparent;border-radius:7px;padding:0;background:#eee;cursor:pointer;flex:0 0 72px;overflow:hidden}.am-detail-thumb.active{border-color:#9d3e00}.am-detail-thumb img{display:block;width:72px;height:54px;object-fit:cover}.am-detail-info{grid-row:3;display:grid;gap:5px}.am-detail-info h2{margin:0;font:700 24px/1.25 'Plus Jakarta Sans',sans-serif}.am-detail-city{color:#9d3e00;font-weight:700}.am-detail-price{font:800 21px 'Plus Jakarta Sans',sans-serif;margin-top:7px}.am-detail-description{color:#62666a;line-height:1.5;margin:8px 0 0;white-space:pre-wrap}
    .am-detail-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}.am-detail-actions a{display:inline-flex;align-items:center;justify-content:center;padding:11px 16px;border-radius:9px;text-decoration:none;font:700 14px 'Inter',sans-serif}.am-detail-actions .am-whatsapp{background:#20b858;color:#fff}.am-detail-actions .am-contact{background:#191c1d;color:#fff}
    .am-toggle-field{display:flex;align-items:center;gap:10px;margin:18px 0;font-weight:600}.am-toggle{appearance:none;width:44px;height:24px;margin:0;border:0;border-radius:999px;background:#c8cbd0;position:relative;cursor:pointer;transition:background .2s}.am-toggle::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0004;transition:transform .2s}.am-toggle:checked{background:#9d3e00}.am-toggle:checked::after{transform:translateX(20px)}
     .am-finance-badge{position:absolute;top:44px;left:12px;z-index:16;padding:6px 10px;border-radius:6px;background:#16833f;color:#fff;font:800 11px 'Plus Jakarta Sans',sans-serif;letter-spacing:.03em;box-shadow:0 2px 6px #0004}
     .am-featured-track{display:flex!important;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;padding:4px 2px 14px}.am-featured-track .property-card{flex:0 0 min(86vw,380px);scroll-snap-align:start}.am-featured-track::-webkit-scrollbar{height:8px}.am-featured-track::-webkit-scrollbar-thumb{background:#c8cbd0;border-radius:999px}.am-carousel-controls{display:flex;justify-content:flex-end;gap:8px;margin:-12px 0 16px}.am-carousel-controls button{width:38px;height:38px;border:0;border-radius:50%;background:#191c1d;color:#fff;cursor:pointer;font-size:22px}.am-carousel-controls button:hover{background:#9d3e00}
    @media(max-width:600px){.am-dialog{padding:20px}.am-title{font-size:21px}.am-admin-row{align-items:flex-start;flex-direction:column}}
  `;
  document.head.append(style);
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/jpeg';
  favicon.href = './logo.jpeg';
  document.head.append(favicon);

  const api = async (url, options = {}) => {
    const response = await fetch(url, {
      credentials: 'same-origin',
      ...options,
      headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'No se pudo completar la solicitud.');
    return result;
  };
  let users = [];
  let properties = [];
  let activeOperation = 'Venta';
  let saleLandingOrder = false;
  let financeLanding = false;
  const filters = { text: '', city: '', type: '', price: '', bedrooms: '' };
  function populateLocationFilters() {
    const citySelect = document.getElementById('citySelect');
    if (!citySelect) return;
    const currentCity = citySelect.value;
    const cities = [...new Set(properties.map(property => property.city).filter(Boolean))].sort();
    citySelect.innerHTML = '<option value="">Ciudad</option>' + cities.map(city => `<option value="${esc(city)}">${esc(city)}</option>`).join('');
    citySelect.value = currentCity;
  }
  async function refreshProperties() {
    properties = await api(`/api/properties${session?.role === 'admin' ? '?all=1' : ''}`);
    const heroImage = properties.find(property => property.images?.[0])?.images?.[0];
    if (heroImage) document.documentElement.style.setProperty('--am-hero-image', `url("${heroImage}")`);
    populateLocationFilters();
    renderProperties();
    return properties;
  }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const modal = document.createElement('div');
  modal.className = 'am-overlay';
  modal.innerHTML = '<section class="am-dialog" role="dialog" aria-modal="true" aria-labelledby="am-dialog-title"><button class="am-close" type="button" aria-label="Cerrar">×</button><div class="am-content"></div></section>';
  document.body.append(modal);
  const dialog = modal.querySelector('.am-dialog');
  const content = modal.querySelector('.am-content');
  const closeButton = modal.querySelector('.am-close');
  let session = null;

  function openModal(html, wide = false) {
    dialog.classList.toggle('am-wide', wide);
    content.innerHTML = html;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => content.querySelector('input,button')?.focus(), 0);
  }
  function closeModal() { modal.classList.remove('is-open'); document.body.style.overflow = ''; }
  function openValuationModal() {
    openModal('<h2 class="am-title" id="am-dialog-title">Solicitar tasación gratis</h2><p class="am-muted">Dejanos tus datos y un asesor se va a comunicar con vos.</p><form id="am-valuation-form"><div class="am-field"><label for="am-valuation-first-name">Nombre</label><input id="am-valuation-first-name" required maxlength="60"></div><div class="am-field"><label for="am-valuation-last-name">Apellido</label><input id="am-valuation-last-name" required maxlength="60"></div><div class="am-field"><label for="am-valuation-phone">Teléfono</label><input id="am-valuation-phone" type="tel" required maxlength="40"></div><div class="am-field"><label for="am-valuation-description">Descripción</label><textarea id="am-valuation-description" required maxlength="1000" placeholder="Contanos qué propiedad querés tasar"></textarea></div><p class="am-error" id="am-valuation-error" role="alert"></p><div class="am-actions"><button class="am-button am-secondary" data-close type="button">Cancelar</button><button class="am-button am-primary" type="submit">Enviar consulta</button></div></form>');
    content.querySelector('[data-close]').addEventListener('click', closeModal);
    content.querySelector('#am-valuation-form').addEventListener('submit', async event => {
      event.preventDefault();
      const submit = content.querySelector('button[type="submit"]');
      submit.disabled = true; submit.textContent = 'Enviando…';
      try {
        await api('/api/valuation-requests', { method: 'POST', body: JSON.stringify({
          firstName: content.querySelector('#am-valuation-first-name').value,
          lastName: content.querySelector('#am-valuation-last-name').value,
          phone: content.querySelector('#am-valuation-phone').value,
          description: content.querySelector('#am-valuation-description').value
        }) });
        closeModal();
        openModal('<h2 class="am-title" id="am-dialog-title">Gracias por tu consulta</h2><p class="am-muted">Recibimos tus datos. Próximamente un asesor de AM Propiedades se va a comunicar con vos.</p><div class="am-actions"><button class="am-button am-primary" data-close type="button">Cerrar</button></div>');
        content.querySelector('[data-close]').addEventListener('click', closeModal);
      } catch (error) {
        content.querySelector('#am-valuation-error').textContent = error.message || 'No se pudo enviar la consulta.';
        submit.disabled = false; submit.textContent = 'Enviar consulta';
      }
    });
  }
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
  grid.addEventListener('click', event => {
    const button = event.target.closest('.am-card-edit');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    const property = properties.find(item => item.id === button.dataset.editCard);
    if (property) openPropertyEditor(property);
  });

  function openPropertyDetail(property) {
    const images = property.images?.length ? property.images : ['https://placehold.co/1200x760/E9E7E4/695B53?text=Sin+foto'];
    let current = 0;
    const message = `Hola Alejandro, Me interesa recibir mas informacion de ${property.title}.`;
    openModal(`<div class="am-detail-gallery"><div class="am-detail-info"><h2 id="am-dialog-title">${esc(property.title)}</h2><div class="am-detail-city">${esc([property.neighborhood, property.city].filter(Boolean).join(', '))}</div><div class="am-detail-price">${esc(property.price)}</div><p class="am-detail-description"><strong>Descripción</strong><br>${esc(property.description || 'Sin descripción cargada.')}</p><div class="am-detail-actions"><a class="am-whatsapp" href="${esc(whatsappUrl(message))}" target="_blank" rel="noopener noreferrer">WhatsApp</a><a class="am-contact" href="${esc(whatsappUrl(message))}" target="_blank" rel="noopener noreferrer">Contactar</a></div></div><div class="am-detail-main"><button class="am-detail-arrow prev" type="button" aria-label="Foto anterior">‹</button><img id="am-detail-image" src="${esc(images[0])}" alt="${esc(property.title)}"><button class="am-detail-arrow next" type="button" aria-label="Foto siguiente">›</button></div><div class="am-detail-thumbs">${images.map((image, index) => `<button class="am-detail-thumb${index === 0 ? ' active' : ''}" data-photo-index="${index}" type="button"><img src="${esc(image)}" alt="Foto ${index + 1}"></button>`).join('')}</div></div>`, true);
    const image = content.querySelector('#am-detail-image');
    const thumbs = [...content.querySelectorAll('[data-photo-index]')];
    const showPhoto = index => {
      current = (index + images.length) % images.length;
      image.src = images[current];
      thumbs.forEach((thumb, thumbIndex) => thumb.classList.toggle('active', thumbIndex === current));
    };
    content.querySelector('.prev').addEventListener('click', () => showPhoto(current - 1));
    content.querySelector('.next').addEventListener('click', () => showPhoto(current + 1));
    thumbs.forEach(thumb => thumb.addEventListener('click', () => showPhoto(Number(thumb.dataset.photoIndex))));
  }

  function attachCardInteractions() {
    grid.querySelectorAll('.property-card').forEach(card => {
      const images = [...card.querySelectorAll('.carousel-img')];
      let current = 0;
      const update = index => {
        current = (index + images.length) % images.length;
        images.forEach((image, i) => image.classList.toggle('hidden', i !== current));
        const counter = card.querySelector('.carousel-counter');
        if (counter) counter.textContent = `${current + 1}/${images.length}`;
      };
      card.querySelector('.btn-next')?.addEventListener('click', event => { event.stopPropagation(); update(current + 1); });
      card.querySelector('.btn-prev')?.addEventListener('click', event => { event.stopPropagation(); update(current - 1); });
      card.querySelector('.btn-favorite')?.addEventListener('click', event => {
        event.stopPropagation();
        const button = event.currentTarget;
        const active = button.dataset.favorited === 'true';
        button.dataset.favorited = String(!active);
        const icon = button.querySelector('.fav-icon');
        if (icon) icon.style.fontVariationSettings = active ? "'FILL' 0" : "'FILL' 1";
      });
      card.querySelector('.am-card-edit')?.addEventListener('click', event => {
        event.stopPropagation();
        const property = properties.find(item => item.id === event.currentTarget.dataset.editCard);
        if (property) openPropertyEditor(property);
      });
      card.addEventListener('click', event => {
        if (event.target.closest('button, a, select, input')) return;
        const property = properties.find(item => item.id === card.dataset.propertyId);
        if (property) openPropertyDetail(property);
      });
    });
  }

  function renderProperties() {
    const sort = document.getElementById('sortSelect')?.value || 'relevancia';
    const visible = properties.filter(property => {
      if (!property.published) return false;
      if (!financeLanding && activeOperation && property.operation !== activeOperation) return false;
      const creditValue = String(property.aptaCredito ?? '').trim().toUpperCase();
      const hasCredit = property.aptaCredito === true || ['SI', 'SÍ', 'YES', 'TRUE', 'APTA', 'APTO'].includes(creditValue);
      const financingValue = String(property.financing || '').trim().toUpperCase();
      const hasFinancing = financingValue && !['NO', 'NO SE FINANCIA'].includes(financingValue);
      if (financeLanding && !hasCredit && !hasFinancing) return false;
      if (!financeLanding && sort === 'relevancia' && !saleLandingOrder && !property.featured) return false;
      if (filters.city && property.city !== filters.city) return false;
      if (filters.text && ![property.title, property.city, property.neighborhood, property.type].join(' ').toLowerCase().includes(filters.text)) return false;
      if (filters.type && property.type !== filters.type) return false;
      if (filters.price === 'ars' && !property.price.includes('$')) return false;
      if (filters.price && filters.price !== 'ars') {
        const limit = Number(filters.price.replace('k', '')) * 1000;
        const numericPrice = Number(String(property.price).replace(/[^0-9]/g, ''));
        if (numericPrice > limit || property.price.includes('$')) return false;
      }
      if (filters.bedrooms && Number(property.bedrooms || 0) < Number(filters.bedrooms.replace('+', ''))) return false;
      return true;
    });
    visible.sort((a, b) => {
      if (sort === 'menor_precio') return (a.priceValue || 0) - (b.priceValue || 0);
      if (sort === 'mayor_precio') return (b.priceValue || 0) - (a.priceValue || 0);
      if (sort === 'recientes') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (saleLandingOrder) {
        const cityKey = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const aBahia = cityKey(a.city) === 'bahia blanca' ? 0 : 1;
        const bBahia = cityKey(b.city) === 'bahia blanca' ? 0 : 1;
        return aBahia - bBahia || cityKey(a.city).localeCompare(cityKey(b.city)) || String(a.title || '').localeCompare(String(b.title || ''));
      }
      return 0;
    });
    const showFeaturedCarousel = sort === 'relevancia' && !saleLandingOrder && !financeLanding;
    grid.classList.toggle('am-featured-track', showFeaturedCarousel);
    const host = grid.parentElement;
    host?.querySelector('.am-carousel-controls')?.remove();
    if (showFeaturedCarousel) {
      const controls = document.createElement('div');
      controls.className = 'am-carousel-controls';
      controls.innerHTML = '<button type="button" aria-label="Anterior">‹</button><button type="button" aria-label="Siguiente">›</button>';
      controls.children[0].addEventListener('click', () => grid.scrollBy({ left: -grid.clientWidth * 0.85, behavior: 'smooth' }));
      controls.children[1].addEventListener('click', () => grid.scrollBy({ left: grid.clientWidth * 0.85, behavior: 'smooth' }));
      grid.before(controls);
    }
    grid.innerHTML = visible.length
      ? visible.map(property => propertyFromTemplate(property.id, property.title, property.price, property.description, property.images || [], cardTemplate, property)).join('')
      : `<div class="col-span-full rounded-xl bg-surface-container-lowest p-8 text-center text-secondary"><strong class="block text-on-surface text-lg mb-2">${sort === 'relevancia' ? 'No hay propiedades destacadas todavía' : 'Próximamente, nuevas propiedades'}</strong>${sort === 'relevancia' ? 'El administrador puede elegirlas desde Editar propiedad.' : 'Estamos preparando las publicaciones de AM Propiedades en Bahía Blanca.'}</div>`;
    attachCardInteractions();
    grid.querySelectorAll('.property-card').forEach(card => {
      const button = [...card.querySelectorAll('a')].find(link => link.textContent.includes('WhatsApp'));
      if (!button) return;
      const title = card.querySelector('h3')?.textContent.trim();
      button.href = whatsappUrl(title ? `Hola Alejandro, Me interesa recibir mas informacion de ${title}.` : whatsappMessage);
      button.target = '_blank'; button.rel = 'noopener noreferrer';
    });
    const count = document.getElementById('propertyCount');
    if (count) count.textContent = `${visible.length} propiedades`;
  }

  const nav = document.querySelector('header nav');
  document.querySelector('#operationTabs [data-op="temporal"]')?.remove();
  document.getElementById('btnViewMap')?.remove();
  document.getElementById('mapViewContainer')?.remove();
  const searchInput = document.getElementById('searchInput');
  const citySelect = document.getElementById('citySelect');
  const propertyTypeSelect = document.getElementById('propertyTypeSelect');
  const priceSelect = document.getElementById('priceSelect');
  const roomsSelect = document.getElementById('roomsSelect');
  const searchButton = document.getElementById('btnExecuteSearch');
  const valuationButton = [...document.querySelectorAll('a, button')].find(button => button.textContent.trim().toLowerCase().includes('solicitar tasación gratis'));
  valuationButton?.addEventListener('click', event => { event.preventDefault(); openValuationModal(); });
  function resetSearchFilters() {
    filters.text = '';
    filters.city = '';
    filters.type = '';
    filters.price = '';
    filters.bedrooms = '';
    if (searchInput) searchInput.value = '';
    if (citySelect) citySelect.value = '';
    if (propertyTypeSelect) propertyTypeSelect.value = '';
    if (priceSelect) priceSelect.value = '';
    if (roomsSelect) roomsSelect.value = '';
  }
  function navigateToProperties(operation) {
    clearSearchFilters();
    activeOperation = operation;
    saleLandingOrder = operation === 'Venta' || operation === 'Alquiler';
    financeLanding = false;
    renderProperties();
    document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function navigateToFinance() {
    clearSearchFilters();
    activeOperation = '';
    saleLandingOrder = false;
    financeLanding = true;
    renderProperties();
    document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function clearSearchFilters() {
    resetSearchFilters();
  }
  document.querySelectorAll('#operationTabs .op-tab').forEach(tab => tab.addEventListener('click', () => {
    activeOperation = tab.dataset.op === 'alquilar' ? 'Alquiler' : 'Venta';
    financeLanding = false;
  }));
  searchButton?.addEventListener('click', event => {
    event.preventDefault();
    saleLandingOrder = false;
    financeLanding = false;
    filters.text = searchInput?.value.trim().toLowerCase() || '';
    filters.city = citySelect?.value || '';
    filters.type = ({ departamentos: 'Departamento', casas: 'Casa', ph: 'PH', terrenos: 'Terreno', galpones: 'Galpón', oficinas: 'Oficina' })[propertyTypeSelect?.value] || '';
    filters.price = priceSelect?.value || '';
    filters.bedrooms = roomsSelect?.value || '';
    renderProperties();
    document.getElementById('propertyCardsGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('sortSelect')?.addEventListener('change', () => { saleLandingOrder = false; renderProperties(); });
  document.querySelectorAll('nav a[data-path]').forEach(link => link.addEventListener('click', event => {
    const path = link.dataset.path;
    if (path === 'inicio') {
      event.preventDefault();
      document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (path === 'propiedades-en-venta') {
      event.preventDefault();
      navigateToProperties('Venta');
    } else if (path === 'propiedades-en-alquiler') {
      event.preventDefault();
      navigateToProperties('Alquiler');
    } else if (path === 'emprendimientos' || path === 'apto-credito') {
      event.preventDefault();
      navigateToFinance();
    } else if (path === 'emprendimientos') {
      event.preventDefault();
      document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (path === 'contacto') {
      event.preventDefault();
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }));
  document.querySelectorAll('img[alt="AM Propiedades Logo"]').forEach(image => {
    image.src = './logo.jpeg?v=am-logo-2026';
    image.style.height = image.closest('footer') ? '44px' : '52px';
    image.style.width = 'auto';
    image.style.objectFit = 'contain';
    image.nextElementSibling?.remove();
  });
  if (nav) {
    const links = [...nav.querySelectorAll('a')];
    const financing = links.find(link => link.dataset.path === 'emprendimientos');
    if (financing) { financing.textContent = 'Apto Crédito/Financia'; financing.dataset.path = 'apto-credito'; }
    const contact = links.find(link => link.dataset.path === 'contacto');
    if (contact) contact.href = '#contacto-am';
  }
  const footer = document.querySelector('footer');
  if (footer) {
    footer.id = 'contacto-am';
    const footerColumns = [...footer.querySelectorAll('.grid > div')];
    const legal = footerColumns[0]?.querySelector('.inline-block');
    if (legal) legal.textContent = 'MV 2009';
    const commercial = footerColumns.find(column => column.querySelector('h4')?.textContent.trim() === 'Atención Comercial');
    const details = [...(commercial?.querySelectorAll('li') || [])];
    if (details[0]) details[0].innerHTML = '<strong class="text-on-surface">Dirección:</strong> Avenida Alem 995, Bahía Blanca';
    if (details[1]) details[1].innerHTML = '<strong class="text-on-surface">Teléfono:</strong> <a class="am-contact-link" href="tel:+542914483222">+54 291 4483 222</a>';
    details[2]?.remove();
    if (details[3]) details[3].innerHTML = '<strong class="text-on-surface">Horarios:</strong> Lun a Vie: 9 a 16 hs';
    const footerCopy = footerColumns[0]?.querySelector('p');
    if (footerCopy) footerCopy.textContent = 'Atención personalizada para operaciones inmobiliarias en Bahía Blanca.';
    const legalCopy = footerColumns[3]?.querySelector('p');
    if (legalCopy) legalCopy.textContent = 'Asesoramiento profesional en operaciones inmobiliarias. MV 2009.';
    const copyright = [...footer.querySelectorAll('p')].find(paragraph => paragraph.textContent.includes('Todos los derechos reservados'));
    if (copyright) copyright.textContent = '© 2026 AM Propiedades. Todos los derechos reservados.';
  }
  const whatsappMessage = 'Hola Alejandro, Me interesa recibir mas informacion de...';
  const whatsappUrl = (message = whatsappMessage) => `https://wa.me/542914483222?text=${encodeURIComponent(message)}`;
  document.querySelectorAll('.property-card a').forEach(link => {
    if (!link.textContent.includes('WhatsApp')) return;
    const title = link.closest('.property-card')?.querySelector('h3')?.textContent.trim();
    link.href = whatsappUrl(title ? `Hola Alejandro, Me interesa recibir mas informacion de ${title}.` : whatsappMessage);
    link.target = '_blank'; link.rel = 'noopener noreferrer';
  });
  [...document.querySelectorAll('a')].filter(link => link.textContent.includes('Contactar Asesor')).forEach(link => {
    link.href = whatsappUrl(); link.target = '_blank'; link.rel = 'noopener noreferrer';
  });
  const whatsappFloat = document.createElement('a');
  whatsappFloat.className = 'am-whatsapp-float';
  whatsappFloat.href = whatsappUrl();
  whatsappFloat.target = '_blank'; whatsappFloat.rel = 'noopener noreferrer';
  whatsappFloat.setAttribute('aria-label', 'Contactar a Alejandro por WhatsApp');
  whatsappFloat.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C8.87 3 3.04 8.81 3.04 15.96c0 2.28.6 4.51 1.73 6.48L3 29l6.74-1.73a13.1 13.1 0 0 0 6.29 1.6h.01c7.16 0 13-5.81 13-12.96A12.88 12.88 0 0 0 25.2 6.7 12.96 12.96 0 0 0 16.04 3Zm0 23.66h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.24-4 1.03 1.07-3.88-.26-.41a10.7 10.7 0 0 1-1.65-5.7c0-5.93 4.83-10.75 10.77-10.75 2.87 0 5.57 1.12 7.6 3.15a10.65 10.65 0 0 1 3.15 7.59c0 5.93-4.84 10.71-10.77 10.71Zm5.9-8.03c-.32-.16-1.9-.94-2.2-1.04-.3-.11-.51-.16-.73.16-.21.32-.84 1.04-1.03 1.25-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.6-.95-.84-1.6-1.88-1.79-2.2-.19-.32-.02-.5.14-.66.14-.14.32-.38.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.56.08-.86.4-.3.33-1.13 1.1-1.13 2.68 0 1.58 1.16 3.1 1.32 3.32.16.21 2.28 3.47 5.52 4.87.77.33 1.37.53 1.84.68.77.24 1.47.2 2.03.12.62-.1 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.52-.08-.14-.3-.22-.62-.38Z"/></svg><span>WhatsApp</span>';
  document.body.append(whatsappFloat);

  function openLogin() {
    openModal(`<h2 class="am-title" id="am-dialog-title">Ingresar</h2><p class="am-muted">Accedé a tu cuenta de AM Propiedades.</p><form id="am-login-form"><div class="am-field"><label for="am-login-email">Correo electrónico</label><input id="am-login-email" type="email" autocomplete="username" required></div><div class="am-field"><label for="am-login-password">Contraseña</label><input id="am-login-password" type="password" autocomplete="current-password" required></div><p class="am-error" id="am-login-error" role="alert"></p><div class="am-actions"><button class="am-button am-secondary" type="button" data-close>Cancelar</button><button class="am-button am-primary" type="submit">Ingresar</button></div></form>`);
    content.querySelector('[data-close]').addEventListener('click', closeModal);
    content.querySelector('#am-login-form').addEventListener('submit', async event => {
      event.preventDefault();
      const email = content.querySelector('#am-login-email').value.trim().toLowerCase();
      const password = content.querySelector('#am-login-password').value;
      const submit = content.querySelector('button[type="submit"]'); submit.disabled = true;
      try {
        const result = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        session = result.user;
        await refreshProperties();
        if (session.role === 'admin') users = await api('/api/users');
        closeModal(); updateHeader();
      } catch (error) {
        content.querySelector('#am-login-error').textContent = error.message;
        submit.disabled = false;
      }
    });
  }

  function updateHeader() {
    headerActions.innerHTML = session
      ? `${session.role === 'admin' ? '<button class="am-button am-secondary am-small" type="button" data-admin-panel>Panel admin</button><a class="inline-flex items-center justify-center font-label-btn text-label-btn px-space-md py-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition-all" data-publish-property href="#">Publicar propiedad</a>' : ''}<span class="font-specs-label text-secondary hidden sm:inline">${esc(session.name)}</span><button class="am-button am-primary am-small" type="button" data-logout>Salir</button>`
      : `<a class="inline-flex items-center justify-center font-label-btn text-label-btn px-space-md py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all" data-path="ingreso" href="#">Ingresar</a>`;
    if (!session) {
      headerActions.querySelector('[data-path="ingreso"]')?.addEventListener('click', event => { event.preventDefault(); openLogin(); });
    }
    headerActions.querySelector('[data-admin-panel]')?.addEventListener('click', openAdmin);
    headerActions.querySelector('[data-publish-property]')?.addEventListener('click', event => { event.preventDefault(); openPropertyEditor(); });
    headerActions.querySelector('[data-logout]')?.addEventListener('click', async () => {
      try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
      session = null; users = []; await refreshProperties().catch(() => { properties = []; renderProperties(); }); updateHeader();
    });
  }

  function propertyFromTemplate(id, title, price, description, images, sourceHtml, property = {}) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(sourceHtml || cardTemplate || '<article class="property-card"><div class="carousel-container"></div><div><div class="font-price-card"></div><h3></h3><p class="mt-1"></p></div></article>', 'text/html');
    const card = doc.querySelector('.property-card');
    card.dataset.propertyId = id;
    const heading = card.querySelector('h3'); if (heading) heading.textContent = title;
    const priceNode = card.querySelector('.font-price-card'); if (priceNode) priceNode.textContent = price;
    const descriptionNode = card.querySelector('.mt-1'); if (descriptionNode) descriptionNode.textContent = description;
    const cityNode = heading?.parentElement?.querySelector('.text-primary');
    if (cityNode) cityNode.textContent = [property.neighborhood, property.city].filter(Boolean).join(', ');
    const branchNode = [...card.querySelectorAll('span')].find(node => node.textContent.trim().startsWith('Sucursal'));
    if (branchNode) branchNode.parentElement?.remove();
    const cardBody = card.querySelector('.p-4');
    const cardMain = cardBody?.firstElementChild;
    const financialBlock = cardMain ? [...cardMain.children].find(child => child.classList.contains('mb-2.5')) : null;
    const specsBlock = cardMain?.querySelector('.flex.items-center.gap-3.py-2.my-2');
    const addressBlock = heading?.parentElement;
    if (cardMain && addressBlock) {
      cardMain.insertBefore(addressBlock, cardMain.firstElementChild);
      if (specsBlock) cardMain.append(specsBlock);
      if (financialBlock) cardMain.append(financialBlock);
    }
    const isTerrain = String(property.type || '').toLowerCase().includes('terreno');
    const bathroomItem = card.querySelector('[title="Ambientes"]');
    if (bathroomItem) {
      bathroomItem.title = 'Baños';
      bathroomItem.querySelector('.material-symbols-outlined').textContent = 'bathroom';
    }
    const specs = {
      'Superficie total': property.area ? `${property.area} m²` : '',
      Baños: isTerrain || !property.bathrooms ? '' : `${property.bathrooms}`,
      Dormitorios: isTerrain || !property.bedrooms ? '' : `${property.bedrooms}`,
      Cocheras: isTerrain || !property.parkingSpots ? '' : `${property.parkingSpots}`
    };
    Object.entries(specs).forEach(([label, value]) => {
      const item = card.querySelector(`[title="${label}"]`);
      if (!item) return;
      const text = item.querySelector('span:last-child');
      if (text && value) text.textContent = value;
      if (!value) item.remove();
    });
    const imageContainer = card.querySelector('.carousel-container');
    if (imageContainer && images.length) {
      const original = imageContainer.querySelector('.carousel-img');
      imageContainer.querySelectorAll('.carousel-img').forEach((image, index) => { if (index > 0) image.remove(); });
      const first = imageContainer.querySelector('.carousel-img');
      if (first) {
        first.src = images[0]; first.classList.remove('hidden'); first.classList.add('active');
        images.slice(1).forEach((src, index) => {
          const extra = original.cloneNode(true); extra.src = src; extra.classList.remove('active'); extra.classList.add('hidden'); imageContainer.append(extra);
        });
      }
      const counter = card.querySelector('.carousel-counter'); if (counter) counter.textContent = `1/${images.length}`;
    } else if (imageContainer) {
      imageContainer.querySelectorAll('.carousel-img').forEach((image, index) => { if (index > 0) image.remove(); });
      const image = imageContainer.querySelector('.carousel-img');
      if (image) image.src = 'https://placehold.co/900x560/E9E7E4/695B53?text=Sin+foto';
      const counter = card.querySelector('.carousel-counter'); if (counter) counter.textContent = '1/1';
    }
    card.querySelector('.am-sold-mark')?.remove();
    if (property.sold) {
      const mark = document.createElement('div');
      mark.className = 'am-sold-mark';
      mark.innerHTML = '<span>VENDIDA</span>';
      card.querySelector('.relative.w-full')?.append(mark);
    }
    card.querySelector('.am-finance-badge')?.remove();
    const financeLabels = [];
    const creditValue = String(property.aptaCredito ?? '').trim().toUpperCase();
    if (property.aptaCredito === true || ['SI', 'SÍ', 'YES', 'TRUE', 'APTA', 'APTO'].includes(creditValue)) financeLabels.push('Apto crédito');
    const financingValue = String(property.financing || '').trim().toUpperCase();
    if (financingValue && !['NO', 'NO SE FINANCIA'].includes(financingValue)) financeLabels.push('Se financia');
    if (financeLabels.length) {
      const financeBadge = document.createElement('div');
      financeBadge.className = 'am-finance-badge';
      financeBadge.textContent = financeLabels.join(' · ');
      card.querySelector('.relative.w-full')?.append(financeBadge);
    }
    if (session?.role === 'admin') {
      const editButton = document.createElement('button');
      editButton.className = 'am-button am-secondary am-small am-card-edit';
      editButton.type = 'button';
      editButton.textContent = 'Editar propiedad';
      editButton.dataset.editCard = id;
      card.querySelector('.p-4')?.append(editButton);
    }
    return card.outerHTML;
  }

  function openPropertyEditor(property = null) {
    if (session?.role !== 'admin') return;
    const editing = Boolean(property);
    const imagesPreview = property?.images?.length ? `<p class="am-muted">${property.images.length} foto(s) guardadas. Seleccioná nuevas para reemplazarlas.</p>` : '';
    openModal(`<h2 class="am-title" id="am-dialog-title">${editing ? 'Editar propiedad' : 'Publicar propiedad'}</h2><p class="am-muted">Completá los datos visibles en la publicación.</p><form id="am-property-form"><div class="am-field"><label for="am-property-title">Título</label><input id="am-property-title" required maxlength="90" value="${esc(property?.title || '')}"></div><div class="am-field"><label for="am-property-price">Precio</label><input id="am-property-price" required maxlength="50" placeholder="USD 180.000" value="${esc(property?.price || '')}"></div><div class="am-field"><label for="am-property-description">Descripción</label><textarea id="am-property-description" required maxlength="500">${esc(property?.description || '')}</textarea></div><div class="am-field"><label for="am-property-images">Fotos (podés elegir varias)</label><input id="am-property-images" type="file" accept="image/*" multiple><div class="am-drop">Las imágenes se guardan en este navegador. ${imagesPreview}</div></div><p class="am-error" id="am-property-error" role="alert"></p><div class="am-actions"><button class="am-button am-secondary" type="button" data-close>Cancelar</button><button class="am-button am-primary" type="submit">${editing ? 'Guardar cambios' : 'Publicar'}</button></div></form>`);
    content.querySelector('#am-property-description').required = false;
    const imageInput = content.querySelector('#am-property-images');
    const descriptionField = content.querySelector('#am-property-description').parentElement;
    descriptionField.insertAdjacentHTML('beforebegin', `<div class="am-field"><label>Ciudad</label><input id="am-property-city" value="${esc(property?.city || 'Bahía Blanca')}"></div><div class="am-field"><label>Barrio</label><input id="am-property-neighborhood" value="${esc(property?.neighborhood || '')}"></div><div class="am-field"><label>Tipo de propiedad</label><input id="am-property-type" value="${esc(property?.type || 'Casa')}"></div><div class="am-field"><label>Metros cuadrados</label><input id="am-property-area" type="number" min="0" value="${property?.area || ''}"></div><div class="am-field"><label>Habitaciones</label><input id="am-property-bedrooms" type="number" min="0" value="${property?.bedrooms || ''}"></div><div class="am-field"><label>Baños</label><input id="am-property-bathrooms" type="number" min="0" value="${property?.bathrooms || ''}"></div><div class="am-field"><label>Cocheras</label><input id="am-property-parking" type="number" min="0" value="${property?.parkingSpots || ''}"></div>`);
    if (property?.images?.length) {
      imageInput.insertAdjacentHTML('afterend', `<div class="am-photo-list">${property.images.map((image, index) => `<div class="am-photo-item"><img src="${esc(image)}" alt="Foto ${index + 1}"><label><input type="checkbox" data-existing-image value="${esc(image)}" checked> Conservar</label></div>`).join('')}</div>`);
    }
    const soldField = document.createElement('label');
    soldField.className = 'am-toggle-field';
    soldField.innerHTML = `<input class="am-toggle" id="am-property-sold" type="checkbox" ${property?.sold ? 'checked' : ''}><span>Marcar como vendida</span>`;
    content.querySelector('.am-actions').before(soldField);
    const creditField = document.createElement('label');
    creditField.className = 'am-toggle-field';
    creditField.innerHTML = `<input class="am-toggle" id="am-property-credit" type="checkbox" ${property?.aptaCredito ? 'checked' : ''}><span>Apto crédito</span>`;
    content.querySelector('.am-actions').before(creditField);
    const financingField = document.createElement('label');
    financingField.className = 'am-toggle-field';
    financingField.innerHTML = `<input class="am-toggle" id="am-property-financing" type="checkbox" ${property?.financing ? 'checked' : ''}><span>Se financia</span>`;
    content.querySelector('.am-actions').before(financingField);
    const featuredField = document.createElement('label');
    featuredField.className = 'am-toggle-field';
    featuredField.innerHTML = `<input class="am-toggle" id="am-property-featured" type="checkbox" ${property?.featured ? 'checked' : ''}><span>Mostrar en inicio (Relevancia)</span>`;
    content.querySelector('.am-actions').before(featuredField);
    content.querySelector('[data-close]').addEventListener('click', closeModal);
    content.querySelector('#am-property-form').addEventListener('submit', async event => {
      event.preventDefault();
      const submit = content.querySelector('button[type="submit"]'); submit.disabled = true; submit.textContent = 'Guardando…';
      try {
        const selected = [...content.querySelector('#am-property-images').files].slice(0, 8);
        const uploaded = await Promise.all(selected.map(compressImage));
        const kept = [...content.querySelectorAll('[data-existing-image]:checked')].map(input => input.value);
        const images = [...kept, ...uploaded];
        const payload = {
          title: content.querySelector('#am-property-title').value.trim(),
          price: content.querySelector('#am-property-price').value.trim(),
          description: content.querySelector('#am-property-description').value.trim(),
          city: content.querySelector('#am-property-city').value.trim(),
          neighborhood: content.querySelector('#am-property-neighborhood').value.trim(),
          type: content.querySelector('#am-property-type').value.trim(),
          area: content.querySelector('#am-property-area').value,
          bedrooms: content.querySelector('#am-property-bedrooms').value,
          bathrooms: content.querySelector('#am-property-bathrooms').value,
          parkingSpots: content.querySelector('#am-property-parking').value,
          images,
          published: true,
          sold: content.querySelector('#am-property-sold').checked,
          aptaCredito: content.querySelector('#am-property-credit').checked,
          financing: content.querySelector('#am-property-financing').checked ? 'Se financia' : '',
          featured: content.querySelector('#am-property-featured').checked
        };
        await api(property ? `/api/properties/${encodeURIComponent(property.id)}` : '/api/properties', {
          method: property ? 'PATCH' : 'POST', body: JSON.stringify(payload)
        });
        await refreshProperties(); closeModal();
      } catch (error) {
        content.querySelector('#am-property-error').textContent = error.message || 'No se pudo guardar. Probá con menos fotos.';
        submit.disabled = false; submit.textContent = editing ? 'Guardar cambios' : 'Publicar';
      }
    });
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const image = new Image();
        image.onerror = reject;
        image.onload = () => {
          const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function openAdmin() {
    if (session?.role !== 'admin') return;
    try { users = await api('/api/users'); }
    catch (error) { openModal(`<h2 class="am-title" id="am-dialog-title">Panel de administración</h2><p class="am-error">${esc(error.message)}</p>`); return; }
    const rows = properties.map(property => `<div class="am-admin-row"><div><strong>${esc(property.title)}</strong><span class="am-muted">${esc(property.price)} · ${property.sold ? 'Vendida' : (property.published ? 'Publicada' : 'Oculta')}</span></div><div class="am-inline-actions"><button class="am-button am-secondary am-small" data-edit="${esc(property.id)}" type="button">Editar</button><button class="am-button am-secondary am-small" data-sold="${esc(property.id)}" type="button">${property.sold ? 'Quitar vendida' : 'Marcar vendida'}</button><button class="am-button am-secondary am-small" data-toggle="${esc(property.id)}" type="button">${property.published ? 'Ocultar' : 'Publicar'}</button><button class="am-button am-secondary am-small" data-delete="${esc(property.id)}" type="button">Eliminar</button></div></div>`).join('');
    const userRows = users.map(user => `<div class="am-user-row"><div><strong>${esc(user.name)}</strong><span class="am-muted">${esc(user.email)} · ${user.role === 'admin' ? 'Admin' : 'Usuario'}</span></div>${user.role !== 'admin' ? `<button class="am-button am-secondary am-small" data-remove-user="${esc(user.id)}" type="button">Quitar</button>` : ''}</div>`).join('');
    openModal(`<h2 class="am-title" id="am-dialog-title">Panel de administración</h2><p class="am-muted">Gestioná las publicaciones y las cuentas de acceso.</p><div class="am-actions" style="justify-content:flex-start;margin:0 0 14px"><button class="am-button am-primary" data-new-property type="button">＋ Nueva propiedad</button><button class="am-button am-secondary" data-new-user type="button">＋ Crear usuario</button></div><h3>Propiedades</h3>${rows || '<p class="am-muted">Todavía no hay propiedades.</p>'}<h3 style="margin-top:24px">Usuarios</h3>${userRows}` , true);
    content.querySelector('[data-new-property]').addEventListener('click', () => openPropertyEditor());
    content.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => openPropertyEditor(properties.find(item => item.id === button.dataset.edit))));
    content.querySelectorAll('[data-edit-card]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); openPropertyEditor(properties.find(item => item.id === button.dataset.editCard)); }));
    content.querySelectorAll('[data-toggle]').forEach(button => button.addEventListener('click', async () => {
      const property = properties.find(item => item.id === button.dataset.toggle);
      try { await api(`/api/properties/${encodeURIComponent(property.id)}`, { method: 'PATCH', body: JSON.stringify({ published: !property.published }) }); await refreshProperties(); await openAdmin(); }
      catch (error) { alert(error.message); }
    }));
    content.querySelectorAll('[data-sold]').forEach(button => button.addEventListener('click', async () => {
      const property = properties.find(item => item.id === button.dataset.sold);
      try { await api(`/api/properties/${encodeURIComponent(property.id)}`, { method: 'PATCH', body: JSON.stringify({ sold: !property.sold }) }); await refreshProperties(); await openAdmin(); }
      catch (error) { alert(error.message); }
    }));
    content.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta propiedad?')) return;
      try { await api(`/api/properties/${encodeURIComponent(button.dataset.delete)}`, { method: 'DELETE' }); await refreshProperties(); await openAdmin(); }
      catch (error) { alert(error.message); }
    }));
    content.querySelector('[data-new-user]').addEventListener('click', openUserForm);
    content.querySelectorAll('[data-remove-user]').forEach(button => button.addEventListener('click', async () => {
      try { await api(`/api/users/${encodeURIComponent(button.dataset.removeUser)}`, { method: 'DELETE' }); users = await api('/api/users'); await openAdmin(); }
      catch (error) { alert(error.message); }
    }));
  }

  function openUserForm() {
    openModal(`<h2 class="am-title" id="am-dialog-title">Crear usuario</h2><p class="am-muted">La cuenta nueva podrá ingresar, pero no administrar propiedades.</p><form id="am-user-form"><div class="am-field"><label for="am-user-name">Nombre</label><input id="am-user-name" required maxlength="70"></div><div class="am-field"><label for="am-user-email">Correo electrónico</label><input id="am-user-email" type="email" required></div><div class="am-field"><label for="am-user-password">Contraseña</label><input id="am-user-password" type="password" required minlength="6"></div><p class="am-error" id="am-user-error" role="alert"></p><div class="am-actions"><button class="am-button am-secondary" data-close type="button">Cancelar</button><button class="am-button am-primary" type="submit">Crear usuario</button></div></form>`);
    content.querySelector('[data-close]').addEventListener('click', closeModal);
    content.querySelector('#am-user-form').addEventListener('submit', async event => {
      event.preventDefault();
      const email = content.querySelector('#am-user-email').value.trim();
      const submit = content.querySelector('button[type="submit"]'); submit.disabled = true;
      try {
        await api('/api/users', { method: 'POST', body: JSON.stringify({
          name: content.querySelector('#am-user-name').value.trim(), email,
          password: content.querySelector('#am-user-password').value
        }) });
        users = await api('/api/users'); await openAdmin();
      } catch (error) {
        content.querySelector('#am-user-error').textContent = error.message;
        submit.disabled = false;
      }
    });
  }

  async function initialize() {
    resetSearchFilters();
    renderProperties();
    updateHeader();
    try {
      const result = await api('/api/auth/session');
      session = result.user;
      if (session?.role === 'admin') users = await api('/api/users');
      await refreshProperties();
      updateHeader();
    } catch (error) {
      grid.innerHTML = `<div class="col-span-full rounded-xl bg-surface-container-lowest p-8 text-center text-secondary">No se pudo conectar con el servidor: ${esc(error.message)}</div>`;
    }
  }
  initialize();
})();
