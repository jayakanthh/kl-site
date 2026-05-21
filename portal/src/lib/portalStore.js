import crypto from 'node:crypto';
import { getDb, initDb } from './db.js';

let dbReady = false;
async function ensureDb() {
  if (!dbReady) { await initDb(); dbReady = true; }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function rowToRecord(row) {
  return {
    id: row.id,
    email: row.email || '',
    name: row.name || '',
    department: row.department || '',
    designation: row.designation || '',
    isPrincipal: !!row.is_principal,
    isHOD: !!row.is_hod,
    photoUrl: row.photo_url || '',
    title: row.title || '',
    linkedin: row.linkedin || '',
    xHandle: row.x_handle || '',
    googlePlus: row.google_plus || '',
    subjects: Array.isArray(row.subjects) ? row.subjects : [],
    rank: row.rank || '',
    lastUpdatedAt: row.last_updated_at,
    createdAt: row.created_at,
  };
}

// ─── Dept Order ──────────────────────────────────────────────────────────────

export async function getDeptOrder() {
  await ensureDb();
  const sql = getDb();
  const rows = await sql`SELECT orders FROM dept_order WHERE id = 1`;
  return rows[0]?.orders || [];
}

export async function setDeptOrder(order) {
  await ensureDb();
  const sql = getDb();
  const arr = Array.isArray(order) ? order.map(String) : [];
  await sql`UPDATE dept_order SET orders = ${arr} WHERE id = 1`;
  return arr;
}

// ─── Public faculty list ─────────────────────────────────────────────────────

export async function getPublicFacultyList() {
  await ensureDb();
  const sql = getDb();
  const rows = await sql`SELECT * FROM faculty ORDER BY created_at DESC`;
  const deptOrder = await getDeptOrder();
  const faculty = rows.map(rowToRecord);

  faculty.sort((a, b) => {
    if (a.isPrincipal !== b.isPrincipal) return a.isPrincipal ? -1 : 1;
    if (a.isPrincipal && b.isPrincipal) return 0;

    const deptA = a.department.trim(), deptB = b.department.trim();
    const idxA = deptOrder.indexOf(deptA), idxB = deptOrder.indexOf(deptB);

    if (idxA !== -1 && idxB !== -1) { if (idxA !== idxB) return idxA - idxB; }
    else if (idxA !== -1) return -1;
    else if (idxB !== -1) return 1;
    else { const cmp = deptA.localeCompare(deptB); if (cmp !== 0) return cmp; }

    if (a.isHOD !== b.isHOD) return a.isHOD ? -1 : 1;
    return 0;
  });

  return faculty;
}

// ─── Admin faculty list (all fields) ────────────────────────────────────────

export async function getAdminFacultyList() {
  await ensureDb();
  const sql = getDb();
  const rows = await sql`SELECT * FROM faculty ORDER BY created_at DESC`;
  return rows.map(rowToRecord);
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createFaculty(input) {
  await ensureDb();
  const sql = getDb();

  const id = crypto.randomUUID();
  // Email is optional — use a placeholder if not provided so the UNIQUE NOT NULL constraint is met
  const email = input.email ? normalizeEmail(input.email) : `${id}@noemail.klh`;
  const subjects = Array.isArray(input.subjects) ? input.subjects.map(String) : [];
  const rank = String(input.rank || '').trim();

  try {
    const rows = await sql`
      INSERT INTO faculty (
        id, email, name, department, designation,
        is_principal, is_hod, photo_url,
        title, linkedin, x_handle, google_plus, subjects, rank,
        password_hash
      ) VALUES (
        ${id}, ${email},
        ${String(input.name || '').trim()},
        ${String(input.department || '').trim()},
        ${String(input.designation || '').trim()},
        ${input.isPrincipal === true}, ${input.isHOD === true},
        ${String(input.photoUrl || '').trim()},
        ${String(input.title || '').trim()},
        ${String(input.linkedin || '').trim()},
        ${String(input.xHandle || '').trim()},
        ${String(input.googlePlus || '').trim()},
        ${JSON.stringify(subjects)}, ${rank},
        ''
      ) RETURNING *
    `;
    return rowToRecord(rows[0]);
  } catch (e) {
    if (e?.message?.includes('unique') || e?.code === '23505') {
      throw new Error('A profile with this email already exists');
    }
    throw e;
  }
}

// ─── Read by ID ──────────────────────────────────────────────────────────────

export async function getFacultyById(id) {
  await ensureDb();
  const sql = getDb();
  const rows = await sql`SELECT * FROM faculty WHERE id = ${id}`;
  if (!rows[0]) return null;
  return rowToRecord(rows[0]);
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateFacultyById(id, patch) {
  await ensureDb();
  const sql = getDb();
  const rows = await sql`SELECT * FROM faculty WHERE id = ${id}`;
  if (!rows[0]) return null;
  const cur = rows[0];

  const name        = patch.name        != null ? String(patch.name).trim()        : cur.name;
  const department  = patch.department  != null ? String(patch.department).trim()  : cur.department;
  const designation = patch.designation != null ? String(patch.designation).trim() : cur.designation;
  const isPrincipal = patch.isPrincipal != null ? !!patch.isPrincipal              : !!cur.is_principal;
  const isHOD       = patch.isHOD       != null ? !!patch.isHOD                    : !!cur.is_hod;
  const photoUrl    = patch.photoUrl    != null ? String(patch.photoUrl).trim()    : cur.photo_url;
  const title       = patch.title       != null ? String(patch.title).trim()       : (cur.title || '');
  const linkedin    = patch.linkedin    != null ? String(patch.linkedin).trim()    : (cur.linkedin || '');
  const xHandle     = patch.xHandle     != null ? String(patch.xHandle).trim()     : (cur.x_handle || '');
  const googlePlus  = patch.googlePlus  != null ? String(patch.googlePlus).trim()  : (cur.google_plus || '');
  const subjects    = patch.subjects    != null
    ? (Array.isArray(patch.subjects) ? patch.subjects.map(String) : [])
    : (Array.isArray(cur.subjects) ? cur.subjects : []);
  const rank        = patch.rank        != null ? String(patch.rank).trim()          : (cur.rank || '');

  // Email: update only if explicitly provided
  let email = cur.email;
  if (patch.email != null) {
    email = patch.email ? normalizeEmail(patch.email) : `${id}@noemail.klh`;
  }

  const updated = await sql`
    UPDATE faculty SET
      email = ${email},
      name = ${name}, department = ${department}, designation = ${designation},
      is_principal = ${isPrincipal}, is_hod = ${isHOD},
      photo_url = ${photoUrl}, title = ${title},
      linkedin = ${linkedin}, x_handle = ${xHandle},
      google_plus = ${googlePlus},
      subjects = ${JSON.stringify(subjects)},
      rank = ${rank},
      last_updated_at = NOW()
    WHERE id = ${id} RETURNING *
  `;
  return rowToRecord(updated[0]);
}

// ─── Events ──────────────────────────────────────────────────────────────────

function eventRowToRecord(row) {
  return {
    id:          row.id,
    title:       row.title || '',
    description: row.description || '',
    department:  row.department || '',
    eventDate:   row.event_date || null,
    imageUrl:    row.image_url || '',
    link:        row.link || '',
    createdAt:   row.created_at,
  };
}

export async function getEventList(dept) {
  await ensureDb();
  const sql = getDb();
  const rows = dept
    ? await sql`SELECT * FROM events WHERE department = ${dept} ORDER BY event_date DESC, created_at DESC`
    : await sql`SELECT * FROM events ORDER BY event_date DESC, created_at DESC`;
  return rows.map(eventRowToRecord);
}

export async function createEvent(input) {
  await ensureDb();
  const sql = getDb();
  const id = crypto.randomUUID();
  const rows = await sql`
    INSERT INTO events (id, title, description, department, event_date, image_url, link)
    VALUES (
      ${id},
      ${String(input.title || '').trim()},
      ${String(input.description || '').trim()},
      ${String(input.department || '').trim()},
      ${input.eventDate || null},
      ${String(input.imageUrl || '').trim()},
      ${String(input.link || '').trim()}
    ) RETURNING *
  `;
  return eventRowToRecord(rows[0]);
}

export async function updateEventById(id, patch) {
  await ensureDb();
  const sql = getDb();
  const rows = await sql`SELECT * FROM events WHERE id = ${id}`;
  if (!rows[0]) return null;
  const cur = rows[0];
  const title       = patch.title       != null ? String(patch.title).trim()       : cur.title;
  const description = patch.description != null ? String(patch.description).trim() : cur.description;
  const department  = patch.department  != null ? String(patch.department).trim()  : cur.department;
  const eventDate   = patch.eventDate   !== undefined ? (patch.eventDate || null)   : cur.event_date;
  const imageUrl    = patch.imageUrl    != null ? String(patch.imageUrl).trim()    : cur.image_url;
  const link        = patch.link        != null ? String(patch.link).trim()        : cur.link;
  const updated = await sql`
    UPDATE events SET
      title=${title}, description=${description}, department=${department},
      event_date=${eventDate}, image_url=${imageUrl}, link=${link}
    WHERE id=${id} RETURNING *
  `;
  return eventRowToRecord(updated[0]);
}

export async function deleteEventById(id) {
  await ensureDb();
  const sql = getDb();
  const result = await sql`DELETE FROM events WHERE id=${id} RETURNING id`;
  return result.length > 0;
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteFacultyById(id) {
  await ensureDb();
  const sql = getDb();
  const result = await sql`DELETE FROM faculty WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

export async function clearFaculty() {
  await ensureDb();
  const sql = getDb();
  await sql`TRUNCATE faculty`;
  return true;
}
