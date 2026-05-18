import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// On Vercel, process.cwd() is read-only. Use /tmp for writes.
// Reads fall back to the bundled data/portal.json (committed to git as initial seed).
const IS_VERCEL = !!process.env.VERCEL;
const WRITE_FILE = IS_VERCEL ? '/tmp/portal.json' : path.join(process.cwd(), 'data', 'portal.json');
const SEED_FILE = path.join(process.cwd(), 'data', 'portal.json');

async function readJsonFile() {
  // On Vercel: prefer /tmp (live writes), fall back to bundled seed
  const candidates = IS_VERCEL ? [WRITE_FILE, SEED_FILE] : [WRITE_FILE];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    try {
      const raw = await readFile(file, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.faculty)) {
        return parsed;
      }
    } catch {
      // corrupt file, try next
    }
  }
  return { faculty: [] };
}

async function writeJsonFile(data) {
  const dir = path.dirname(WRITE_FILE);
  await mkdir(dir, { recursive: true });
  const json = JSON.stringify(data, null, 2);
  await writeFile(WRITE_FILE, json, 'utf8');
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function safePublicFacultyRecord(f) {
  const {
    id,
    email,
    name,
    department,
    designation,
    photoUrl,
    bio,
    researchInterests,
    phone,
    office,
    linkedin,
    googleScholar,
    publications,
    lastUpdatedAt,
  } = f;
  return {
    id,
    email,
    name,
    department,
    designation,
    photoUrl,
    bio,
    researchInterests,
    phone,
    office,
    linkedin,
    googleScholar,
    publications,
    lastUpdatedAt,
  };
}

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(password), salt, 64);
  return `${salt.toString('base64')}:${hash.toString('base64')}`;
}

function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;
  const [saltB64, hashB64] = stored.split(':');
  if (!saltB64 || !hashB64) return false;
  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');
  const actual = crypto.scryptSync(String(password), salt, expected.length);
  return timingSafeEqual(actual, expected);
}

export async function getPublicFacultyList() {
  const data = await readJsonFile();
  return data.faculty.map(safePublicFacultyRecord);
}

export async function getAdminFacultyList() {
  const data = await readJsonFile();
  return data.faculty.map((f) => ({
    id: f.id,
    email: f.email,
    name: f.name,
    department: f.department,
    designation: f.designation,
    lastUpdatedAt: f.lastUpdatedAt,
    createdAt: f.createdAt,
  }));
}

export async function createFaculty(input) {
  const data = await readJsonFile();
  const email = normalizeEmail(input.email);
  if (!email) {
    throw new Error('Email is required');
  }
  const existing = data.faculty.find((f) => normalizeEmail(f.email) === email);
  if (existing) {
    throw new Error('Faculty already exists');
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const password = String(input.password || '').trim();
  if (!password) {
    throw new Error('Password is required');
  }

  const record = {
    id,
    email,
    name: String(input.name || '').trim(),
    department: String(input.department || '').trim(),
    designation: String(input.designation || '').trim(),
    photoUrl: String(input.photoUrl || '').trim(),
    bio: String(input.bio || '').trim(),
    researchInterests: String(input.researchInterests || '').trim(),
    phone: String(input.phone || '').trim(),
    office: String(input.office || '').trim(),
    linkedin: String(input.linkedin || '').trim(),
    googleScholar: String(input.googleScholar || '').trim(),
    publications: Array.isArray(input.publications) ? input.publications.map((p) => String(p)) : [],
    passwordHash: hashPassword(password),
    createdAt: now,
    lastUpdatedAt: now,
  };

  data.faculty.unshift(record);
  await writeJsonFile(data);

  return safePublicFacultyRecord(record);
}

export async function validateFacultyCredentials(emailInput, passwordInput) {
  const email = normalizeEmail(emailInput);
  const password = String(passwordInput || '');
  const data = await readJsonFile();
  const faculty = data.faculty.find((f) => normalizeEmail(f.email) === email);
  if (!faculty) return null;
  if (!verifyPassword(password, faculty.passwordHash)) return null;
  return safePublicFacultyRecord(faculty);
}

export async function getFacultyById(id) {
  const data = await readJsonFile();
  const faculty = data.faculty.find((f) => f.id === id);
  if (!faculty) return null;
  return safePublicFacultyRecord(faculty);
}

export async function updateFacultyById(id, patch) {
  const data = await readJsonFile();
  const idx = data.faculty.findIndex((f) => f.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const current = data.faculty[idx];

  const next = {
    ...current,
    name: patch.name != null ? String(patch.name).trim() : current.name,
    department: patch.department != null ? String(patch.department).trim() : current.department,
    designation: patch.designation != null ? String(patch.designation).trim() : current.designation,
    photoUrl: patch.photoUrl != null ? String(patch.photoUrl).trim() : current.photoUrl,
    bio: patch.bio != null ? String(patch.bio).trim() : current.bio,
    researchInterests: patch.researchInterests != null ? String(patch.researchInterests).trim() : current.researchInterests,
    phone: patch.phone != null ? String(patch.phone).trim() : current.phone,
    office: patch.office != null ? String(patch.office).trim() : current.office,
    linkedin: patch.linkedin != null ? String(patch.linkedin).trim() : current.linkedin,
    googleScholar: patch.googleScholar != null ? String(patch.googleScholar).trim() : current.googleScholar,
    publications: patch.publications != null
      ? (Array.isArray(patch.publications) ? patch.publications.map((p) => String(p)) : [])
      : current.publications,
    lastUpdatedAt: now,
  };

  if (patch.password != null) {
    const newPassword = String(patch.password || '').trim();
    if (newPassword) {
      next.passwordHash = hashPassword(newPassword);
    }
  }

  data.faculty[idx] = next;
  await writeJsonFile(data);
  return safePublicFacultyRecord(next);
}

export async function deleteFacultyById(id) {
  const data = await readJsonFile();
  const idx = data.faculty.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  data.faculty.splice(idx, 1);
  await writeJsonFile(data);
  return true;
}

export async function clearFaculty() {
  const data = await readJsonFile();
  if (!data.faculty.length) return false;
  data.faculty = [];
  await writeJsonFile(data);
  return true;
}
