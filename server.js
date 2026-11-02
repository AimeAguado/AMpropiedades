const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

try { process.loadEnvFile(path.join(__dirname, 'atlas-credentials.env')); } catch (error) { if (error.code !== 'ENOENT') throw error; }

const PORT = Number(process.env.PORT || 4173);
const DB_NAME = process.env.MONGODB_DB_NAME || 'inmotask';
const TENANT_NAME = process.env.AM_INMOBILIARIA_NAME || 'AM Propiedades';
const STATIC_ROOT = path.join(__dirname, 'public');
const SESSION_TTL = 12 * 60 * 60 * 1000;
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };

function mongoConnectionString() {
  const source = new URL(process.env.MONGODB_URI.replace(/^mongodb\+srv:/, 'mongodb:'));
  return `mongodb://${encodeURIComponent(decodeURIComponent(source.username))}:${encodeURIComponent(decodeURIComponent(source.password))}@${process.env.MONGODB_HOSTS}/?authSource=admin&replicaSet=${encodeURIComponent(process.env.MONGODB_REPLICA_SET)}&tls=true&retryWrites=true&w=majority`;
}

const client = new MongoClient(mongoConnectionString(), { serverSelectionTimeoutMS: 15000 });
let db;
let users;
let properties;
let tenants;
let portalSessions;
let ready;

function send(res, status, data, headers = {}) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }); res.end(JSON.stringify(data)); }
function cookie(res, token, maxAge) { res.setHeader('Set-Cookie', `am_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${process.env.VERCEL ? '; Secure' : ''}`); }
async function sessionOf(req) {
  const token = (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith('am_session='))?.slice(11);
  if (!token) return null;
  const session = await portalSessions.findOne({ _id: token });
  if (!session || session.expiresAt < new Date()) { if (session) await portalSessions.deleteOne({ _id: token }); return null; }
  await portalSessions.updateOne({ _id: token }, { $set: { expiresAt: new Date(Date.now() + SESSION_TTL) } });
  return { token, ...session };
}
async function body(req) {
  const chunks = []; let size = 0;
  for await (const chunk of req) { size += chunk.length; if (size > 12 * 1024 * 1024) throw Object.assign(new Error('El archivo enviado es demasiado grande.'), { status: 413 }); chunks.push(chunk); }
  if (!size) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString()); } catch { throw Object.assign(new Error('JSON inválido.'), { status: 400 }); }
}
function publicUser(user, tenantName = TENANT_NAME) { return { id: String(user._id), name: user.name, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, inmoviliariaId: String(user.inmoviliariaId), inmoviliaria: tenantName, phone: user.phone || '', license: user.license || '', avatar: user.avatar || '', active: user.active }; }
function priceValue(value) { const digits = String(value || '').replace(/[^0-9]/g, ''); return digits ? Number(digits) : 0; }
function localImageUrl(value) {
  const match = String(value || '').match(/[?&]id=([^&]+)/);
  return match ? `/api/media/${encodeURIComponent(match[1])}` : value;
}
function propertyView(property) {
  const published = Boolean(property.active) && property.status !== 'no_disponible';
  return { id: String(property._id), title: property.title, price: property.price ? `${property.currency === 'ARS' ? '$' : 'USD '}${property.price.toLocaleString('es-AR')}` : 'Consultar precio', priceValue: property.price || 0, description: property.description || '', images: (property.images || []).map(localImageUrl), published, sold: property.status === 'entregada', featured: Boolean(property.featured), createdAt: property.createdAt, operation: property.operation, type: property.type, city: property.city, neighborhood: property.neighborhood || '', bedrooms: property.bedrooms || 0, bathrooms: property.bathrooms || 0, parkingSpots: property.parkingSpots || 0, area: property.totalArea || property.coveredArea || 0, services: property.services || '', aptaCredito: property.aptaCredito, financing: property.financing || '' };
}
async function tenant() { return tenants.findOne({ name: TENANT_NAME, active: true }); }
async function adminSession(req, res) { const session = await sessionOf(req); if (!session) { send(res, 401, { error: 'Iniciá sesión para continuar.' }); return null; } if (session.role !== 'admin') { send(res, 403, { error: 'Acción reservada al administrador.' }); return null; } return session; }

async function api(req, res, url) {
  const { pathname, searchParams } = url;
  if (req.method === 'GET' && pathname === '/api/health') { send(res, 200, { status: 'ok', database: DB_NAME, tenant: TENANT_NAME }); return; }
  if (req.method === 'POST' && pathname === '/api/valuation-requests') {
    const input = await body(req);
    const firstName = String(input.firstName || '').trim();
    const lastName = String(input.lastName || '').trim();
    const phone = String(input.phone || '').trim();
    const description = String(input.description || '').trim();
    if (!firstName || !lastName || !phone || !description) { send(res, 400, { error: 'Completá todos los campos.' }); return; }
    const delivery = await fetch('https://formsubmit.co/ajax/propiedadesam26@gmail.com', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: `Nueva solicitud de tasación - ${firstName} ${lastName}`, _template: 'table', nombre: firstName, apellido: lastName, telefono: phone, descripcion: description })
    });
    if (!delivery.ok) { send(res, 502, { error: 'No se pudo enviar la consulta. Intentá nuevamente.' }); return; }
    send(res, 200, { ok: true }); return;
  }
  const mediaId = pathname.match(/^\/api\/media\/([^/]+)$/)?.[1];
  if (req.method === 'GET' && mediaId) {
    const response = await fetch(`https://drive.google.com/uc?export=download&id=${encodeURIComponent(mediaId)}`);
    if (!response.ok) { res.writeHead(response.status); res.end(); return; }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=3600' });
    res.end(Buffer.from(await response.arrayBuffer()));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    const input = await body(req); const user = await users.findOne({ email: String(input.email || '').trim().toLowerCase(), active: true });
    const valid = user && await bcrypt.compare(String(input.password || ''), user.passwordHash || '');
    if (!valid) { send(res, 401, { error: 'Correo o contraseña incorrectos.' }); return; }
    const company = await tenants.findOne({ _id: user.inmoviliariaId, active: true });
    if (!company || company.name !== TENANT_NAME) { send(res, 403, { error: 'La cuenta no pertenece a AM Propiedades.' }); return; }
    const token = randomBytes(32).toString('hex'); await portalSessions.insertOne({ _id: token, userId: String(user._id), tenantId: String(user.inmoviliariaId), role: user.role, name: user.name, email: user.email, expiresAt: new Date(Date.now() + SESSION_TTL) }); cookie(res, token, SESSION_TTL / 1000); send(res, 200, { user: publicUser(user, company.name) }); return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/logout') { const session = await sessionOf(req); if (session) await portalSessions.deleteOne({ _id: session.token }); cookie(res, '', 0); send(res, 200, { ok: true }); return; }
  if (req.method === 'GET' && pathname === '/api/auth/session') { const session = await sessionOf(req); const user = session && await users.findOne({ _id: new ObjectId(session.userId), active: true }); send(res, 200, { user: user ? publicUser(user) : null }); return; }

  const company = await tenant();
  if (!company) { send(res, 503, { error: 'AM Propiedades todavía no está configurada en InmoTask.' }); return; }
  const current = await sessionOf(req);
  const sameTenant = current && current.tenantId === String(company._id);

  if (pathname === '/api/properties' && req.method === 'GET') {
    const query = { inmoviliariaId: company._id, ...(current?.role === 'admin' && sameTenant && searchParams.get('all') === '1' ? {} : { active: true }) };
    const list = await properties.find(query).sort({ createdAt: -1 }).toArray(); send(res, 200, list.map(propertyView)); return;
  }
  if (pathname === '/api/properties' && req.method === 'POST') {
    if (!await adminSession(req, res)) return; const input = await body(req); const count = await properties.countDocuments({ inmoviliariaId: company._id });
  const doc = { inmoviliariaId: company._id, code: `AM-${String(count + 1).padStart(4, '0')}`, title: String(input.title || '').trim(), type: String(input.type || 'Casa'), operation: String(input.operation || 'Venta'), status: 'disponible', address: '', neighborhood: String(input.neighborhood || '').trim(), city: String(input.city || 'Bahía Blanca'), coveredArea: Number(input.area) || 0, totalArea: Number(input.area) || 0, bedrooms: Number(input.bedrooms) || 0, bathrooms: Number(input.bathrooms) || 0, parkingSpots: Number(input.parkingSpots) || 0, keysLocation: 'Oficina Central', signageStatus: 'Pendiente de Colocación', imageUrl: input.images?.[0] || '', images: input.images || [], description: String(input.description || '').trim(), price: priceValue(input.price), currency: String(input.price || '').includes('$') && !String(input.price || '').includes('USD') ? 'ARS' : 'USD', services: '', aptaCredito: Boolean(input.aptaCredito), financing: String(input.financing || '').trim(), active: true, source: 'portal-ampropiedades', featured: Boolean(input.featured), tags: [], assignedAgent: { name: current.name, avatar: '', role: 'Administrador', phone: '', email: current.email }, createdAt: new Date(), updatedAt: new Date() };
    if (!doc.title || !doc.description) { send(res, 400, { error: 'Completá título y descripción.' }); return; } const result = await properties.insertOne(doc); send(res, 201, propertyView({ ...doc, _id: result.insertedId })); return;
  }
  const propertyId = pathname.match(/^\/api\/properties\/([a-f\d]{24})$/i)?.[1];
  if (propertyId && ['PATCH', 'DELETE'].includes(req.method)) {
    if (!await adminSession(req, res)) return; const id = new ObjectId(propertyId); const existing = await properties.findOne({ _id: id, inmoviliariaId: company._id }); if (!existing) { send(res, 404, { error: 'Propiedad inexistente.' }); return; }
    if (req.method === 'DELETE') { await properties.deleteOne({ _id: id }); send(res, 200, { ok: true }); return; }
    const input = await body(req); const update = { updatedAt: new Date() }; if (input.title !== undefined) update.title = String(input.title).trim(); if (input.description !== undefined) update.description = String(input.description).trim(); if (input.price !== undefined) { update.price = priceValue(input.price); update.currency = String(input.price).includes('$') && !String(input.price).includes('USD') ? 'ARS' : 'USD'; } if (input.images !== undefined) { update.images = input.images; update.imageUrl = input.images[0] || ''; } if (input.neighborhood !== undefined) update.neighborhood = String(input.neighborhood).trim(); if (input.city !== undefined) update.city = String(input.city).trim(); if (input.type !== undefined) update.type = String(input.type).trim(); if (input.operation !== undefined) update.operation = String(input.operation).trim(); if (input.area !== undefined) update.coveredArea = update.totalArea = Number(input.area) || 0; if (input.bedrooms !== undefined) update.bedrooms = Number(input.bedrooms) || 0; if (input.bathrooms !== undefined) update.bathrooms = Number(input.bathrooms) || 0; if (input.parkingSpots !== undefined) update.parkingSpots = Number(input.parkingSpots) || 0; if (input.aptaCredito !== undefined) update.aptaCredito = Boolean(input.aptaCredito); if (input.financing !== undefined) update.financing = String(input.financing).trim(); if (input.featured !== undefined) update.featured = Boolean(input.featured); if (input.published !== undefined) update.active = Boolean(input.published); if (input.sold !== undefined) update.status = input.sold ? 'entregada' : 'disponible'; await properties.updateOne({ _id: id }, { $set: update }); send(res, 200, propertyView({ ...existing, ...update, _id: id })); return;
  }
  if (pathname === '/api/users' && req.method === 'GET') { if (!await adminSession(req, res)) return; const list = await users.find({ inmoviliariaId: company._id }, { projection: { passwordHash: 0 } }).toArray(); send(res, 200, list.map(user => publicUser(user, company.name))); return; }
  if (pathname === '/api/users' && req.method === 'POST') { if (!await adminSession(req, res)) return; const input = await body(req); const email = String(input.email || '').trim().toLowerCase(); if (!email || !input.name || !input.password) { send(res, 400, { error: 'Completá nombre, correo y contraseña.' }); return; } if (await users.findOne({ email })) { send(res, 409, { error: 'Ya existe una cuenta con ese correo.' }); return; } const user = { firstName: String(input.name).split(' ')[0], lastName: String(input.name).split(' ').slice(1).join(' ') || '-', name: String(input.name).trim(), email, passwordHash: await bcrypt.hash(String(input.password), 12), role: 'asesor', inmoviliariaId: company._id, active: true, phone: '', license: '', avatar: '', createdAt: new Date(), updatedAt: new Date() }; const result = await users.insertOne(user); send(res, 201, publicUser({ ...user, _id: result.insertedId }, company.name)); return; }
  const userId = pathname.match(/^\/api\/users\/([a-f\d]{24})$/i)?.[1]; if (userId && req.method === 'DELETE') { if (!await adminSession(req, res)) return; await users.deleteOne({ _id: new ObjectId(userId), inmoviliariaId: company._id, role: { $ne: 'admin' } }); send(res, 200, { ok: true }); return; }
  send(res, 404, { error: 'Ruta API inexistente.' });
}

async function staticFile(req, res, url) {
  let relative = decodeURIComponent(url.pathname.slice(1)); if (!relative || relative.endsWith('/')) relative += 'index.html'; const file = path.resolve(STATIC_ROOT, relative); if (!file.startsWith(STATIC_ROOT + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; } try { const content = await readFile(file); res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(content); } catch { res.writeHead(404); res.end('Not found'); }
}

async function init() {
  if (!ready) ready = (async () => {
    await client.connect(); db = client.db(DB_NAME); users = db.collection('appusers'); properties = db.collection('properties'); tenants = db.collection('inmobiliarias'); portalSessions = db.collection('portalSessions');
    await portalSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});
    console.log(`AM Propiedades conectado a ${DB_NAME}; tenant ${TENANT_NAME}`);
  })().catch(error => { ready = null; throw error; });
  return ready;
}

async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    await init();
    if (url.pathname.startsWith('/api/')) await api(req, res, url);
    else if (req.method === 'GET') await staticFile(req, res, url);
    else send(res, 405, { error: 'Método no permitido.' });
  } catch (error) {
    console.error(error.message);
    if (!res.headersSent) send(res, error.status || 500, { error: error.status ? error.message : 'Error interno.' });
  }
}

async function main() {
  await init();
  const server = createServer(handler);
  server.listen(PORT, '127.0.0.1', () => console.log(`AM Propiedades listo en http://localhost:${PORT}`));
  const stop = async () => { server.close(); await client.close(); process.exit(0); }; process.on('SIGINT', stop); process.on('SIGTERM', stop);
}

if (require.main === module) main().catch(error => { console.error('No se pudo iniciar:', error.message); process.exit(1); });
module.exports = { handler };
