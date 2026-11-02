const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

process.loadEnvFile('atlas-credentials.env');

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1qYDYHlLFwXH4bqDXS4IpOXANkIbN-5_i3TflMlFbhS0/export?format=csv&gid=1168688175';
const DRIVE_ROOT = '1DfcyZCH8wI_eeiAiHabhm7bdLD66NY4x';
const TENANT_NAME = process.env.AM_INMOBILIARIA_NAME || 'AM Propiedades';
const ADMIN_EMAIL = 'propiedadesam26@gmail.com';
const ADMIN_PASSWORD = 'Mendoza50';

function mongoConnectionString() {
  const source = new URL(process.env.MONGODB_URI.replace(/^mongodb\+srv:/, 'mongodb:'));
  return `mongodb://${encodeURIComponent(decodeURIComponent(source.username))}:${encodeURIComponent(decodeURIComponent(source.password))}@${process.env.MONGODB_HOSTS}/?authSource=admin&replicaSet=${encodeURIComponent(process.env.MONGODB_REPLICA_SET)}&tls=true&retryWrites=true&w=majority`;
}

function normalize(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseCsv(text) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { field += '"'; i += 1; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (char === ',' && !quoted) { row.push(field); field = ''; continue; }
    if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field); field = '';
      if (row.some(value => value.trim())) rows.push(row);
      row = []; continue;
    }
    field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift().map(header => header.trim());
  return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, (values[index] || '').trim()])));
}

async function text(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`No se pudo leer Drive/Sheets: HTTP ${response.status}`);
  return response.text();
}

function folders(html) {
  const output = []; const regex = /data-id="([^"]+)"[\s\S]{0,500}?data-tooltip="([^"]+) Shared folder"/g; let match;
  while ((match = regex.exec(html))) output.push({ id: match[1], name: match[2] });
  return output;
}

function images(html) {
  const output = []; const regex = /aria-label="([^"]+) Image Shared"[\s\S]{0,450}?data-id="([^"]+)"/g; let match;
  while ((match = regex.exec(html))) output.push(`https://drive.google.com/uc?export=download&id=${match[2]}`);
  return output;
}

async function loadImages() {
  const root = folders(await text(`https://drive.google.com/drive/folders/${DRIVE_ROOT}?usp=sharing`));
  const result = new Map();
  for (const section of root) {
    const childFolders = folders(await text(`https://drive.google.com/drive/folders/${section.id}?usp=sharing`));
    for (const folder of childFolders) {
      result.set(normalize(folder.name), images(await text(`https://drive.google.com/drive/folders/${folder.id}?usp=sharing`)));
    }
  }
  return result;
}

function imagesFor(title, imageMap) {
  const key = normalize(title);
  if (imageMap.has(key)) return imageMap.get(key);
  for (const [folder, values] of imageMap) if (folder.includes(key) || key.includes(folder)) return values;
  return [];
}

function number(value) {
  const digits = String(value || '').replace(/[^0-9]/g, '');
  return digits ? Number(digits) : 0;
}

function propertyType(value) {
  const valueKey = normalize(value);
  if (valueKey.includes('casa ph')) return 'Casa PH';
  if (valueKey.includes('casa')) return 'Casa';
  if (valueKey.includes('departamento')) return 'Departamento';
  if (valueKey.includes('terreno')) return 'Terreno';
  if (valueKey.includes('galpon')) return 'Galpón';
  if (valueKey.includes('local')) return 'Local';
  if (valueKey.includes('quinta')) return 'Quinta';
  if (valueKey.includes('complejo')) return 'Complejo';
  if (valueKey.includes('fondo comercio')) return 'Fondo de Comercio';
  return 'Casa';
}

function operation(value) { return normalize(value).includes('alquiler') && !normalize(value).includes('venta') ? 'Alquiler' : 'Venta'; }
function parking(value) {
  const key = normalize(value);
  if (key === 'doble' || key === '2') return 2;
  if (key === 'si' || key === '1') return 1;
  return 0;
}

async function main() {
  const [csv, imageMap] = await Promise.all([text(SHEET_URL), loadImages()]);
  const rows = parseCsv(csv).filter(row => normalize(row['Activo/No Activo']) === 'activo');
  const client = new MongoClient(mongoConnectionString(), { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  try {
    const db = client.db(process.env.MONGODB_DB_NAME || 'inmotask');
    const tenantCollection = db.collection('inmobiliarias');
    const users = db.collection('appusers');
    const properties = db.collection('properties');
    const tenant = await tenantCollection.findOneAndUpdate(
      { name: TENANT_NAME },
      { $set: { phone: '+54 291 448 3222', email: '', logo: '/logo.jpeg', active: true }, $setOnInsert: { name: TENANT_NAME, legalName: '', taxId: 'MV 2009', createdAt: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );
    const tenantId = tenant._id;
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const admin = await users.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      { $set: { name: 'Administrador', firstName: 'Administrador', lastName: 'AM Propiedades', role: 'admin', inmoviliariaId: tenantId, active: true, passwordHash, phone: '+54 291 448 3222', license: 'MV 2009' }, $setOnInsert: { email: ADMIN_EMAIL, createdAt: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );
    await properties.deleteMany({ inmoviliariaId: tenantId, source: 'google-sheet-1168688175' });
    const docs = rows.map((row, index) => {
      const photoList = imagesFor(row.Propiedad, imageMap);
      const price = number(row.Precio);
      return {
        inmoviliariaId: tenantId,
        code: `AM-${String(index + 1).padStart(4, '0')}`,
        title: row.Propiedad,
        type: propertyType(row['Tipo de propiedad']),
        operation: operation(row['Venta/Alquiler']),
        status: 'disponible',
        address: row.Propiedad,
        neighborhood: '', city: row.Ciudad,
        coveredArea: number(row.Metros), totalArea: number(row.Metros),
        bedrooms: number(row.Dormitorios), bathrooms: number(row.Baños), parkingSpots: parking(row.Cochera),
        keysLocation: 'Oficina Central', signageStatus: 'Pendiente de Colocación',
        imageUrl: photoList[0] || '', images: photoList,
        description: row['Descripcion Permuta/Financiacion'] || '',
        price, currency: String(row.Precio).includes('$') && !String(row.Precio).includes('USD') ? 'ARS' : 'USD',
        services: row.Servicios, aptaCredito: normalize(row['Apto credito']) === 'aptacredito', financing: row['Permuta/Financia'], active: true,
        source: 'google-sheet-1168688175', signagePlaced: normalize(row.Placas) === 'si', featured: false, tags: [],
        assignedAgent: { name: admin.name, avatar: '', role: 'Administrador', phone: admin.phone || '', email: admin.email }, createdAt: new Date(), updatedAt: new Date(),
      };
    });
    if (docs.length) await properties.insertMany(docs);
    console.log(`AM Propiedades conectada a inmotask: ${docs.length} propiedades, ${docs.filter(doc => doc.images.length).length} con fotos.`);
  } finally { await client.close(); }
}

main().catch(error => { console.error(error.message); process.exit(1); });
