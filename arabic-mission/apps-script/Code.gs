/**
 * ARABIC MISSION — Google Apps Script database API
 * Spreadsheet-bound script. Run setupDatabase() once before deploying as Web App.
 * Never put the API secret in frontend code or commit it to GitHub.
 */

const AM_SHEETS = {
  USERS: 'Users',
  PROGRESS: 'UserProgress',
  RESULTS: 'MissionResults',
  LOGS: 'ActivityLogs',
};

const AM_HEADERS = {
  Users: [
    'user_id', 'full_name', 'email', 'password_salt', 'password_hash',
    'role', 'status', 'created_at', 'updated_at', 'last_login'
  ],
  UserProgress: [
    'user_id', 'progress_json', 'total_xp', 'completed_missions', 'updated_at'
  ],
  MissionResults: [
    'result_id', 'user_id', 'mission_id', 'score', 'passed', 'xp_earned',
    'answers_json', 'completed_at'
  ],
  ActivityLogs: [
    'log_id', 'user_id', 'event_type', 'details_json', 'created_at'
  ],
};

/** Run manually from Apps Script editor after binding this script to the DB spreadsheet. */
function setupDatabase() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('Buka Apps Script melalui Extensions > Apps Script dari Google Sheets database.');
  }
  PropertiesService.getScriptProperties().setProperty('DATABASE_ID', spreadsheet.getId());

  Object.keys(AM_HEADERS).forEach(function (name) {
    let sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name);
    const headers = AM_HEADERS[name];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#173f35')
      .setFontColor('#ffffff');
    sheet.autoResizeColumns(1, headers.length);
  });

  Logger.log('Arabic Mission database siap: ' + spreadsheet.getUrl());
}

function doGet() {
  return jsonOutput_({ ok: true, service: 'Arabic Mission API', status: 'running' });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!authorized_(body.secret)) {
      return jsonOutput_({ ok: false, error: 'UNAUTHORIZED' });
    }

    const data = dispatch_(body.action, body);
    return jsonOutput_({ ok: true, data: data });
  } catch (error) {
    console.error(error);
    const message = error && error.message ? error.message : 'INTERNAL_ERROR';
    return jsonOutput_({ ok: false, error: message });
  }
}

function dispatch_(action, body) {
  switch (action) {
    case 'createUser': return createUser_(body);
    case 'getUserByEmail': return getUserByEmail_(body.email);
    case 'getUserById': return getUserById_(body.user_id);
    case 'touchLogin': return touchLogin_(body.user_id);
    case 'getProgress': return getProgress_(body.user_id);
    case 'saveProgress': return saveProgress_(body.user_id, body.progress);
    case 'logEvent': return logEvent_(body.user_id, body.event_type, body.details || {});
    default: throw new Error('UNKNOWN_ACTION');
  }
}

function createUser_(body) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = sheet_(AM_SHEETS.USERS);
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !body.user_id || !body.password_salt || !body.password_hash) {
      throw new Error('INVALID_USER_DATA');
    }
    if (findRow_(sheet, 3, email)) throw new Error('EMAIL_EXISTS');

    const now = new Date().toISOString();
    const row = [
      String(body.user_id), String(body.full_name || '').trim(), email,
      String(body.password_salt), String(body.password_hash), 'student', 'active',
      now, now, ''
    ];
    sheet.appendRow(row);
    logEvent_(String(body.user_id), 'register', { email: email });
    return userFromRow_(row);
  } finally {
    lock.releaseLock();
  }
}

function getUserByEmail_(email) {
  const sheet = sheet_(AM_SHEETS.USERS);
  const rowNumber = findRow_(sheet, 3, String(email || '').trim().toLowerCase());
  if (!rowNumber) return null;
  return userFromRow_(sheet.getRange(rowNumber, 1, 1, AM_HEADERS.Users.length).getValues()[0]);
}

function getUserById_(userId) {
  const sheet = sheet_(AM_SHEETS.USERS);
  const rowNumber = findRow_(sheet, 1, String(userId || ''));
  if (!rowNumber) return null;
  return userFromRow_(sheet.getRange(rowNumber, 1, 1, AM_HEADERS.Users.length).getValues()[0]);
}

function touchLogin_(userId) {
  const sheet = sheet_(AM_SHEETS.USERS);
  const rowNumber = findRow_(sheet, 1, String(userId || ''));
  if (!rowNumber) throw new Error('USER_NOT_FOUND');
  const now = new Date().toISOString();
  sheet.getRange(rowNumber, 9, 1, 2).setValues([[now, now]]);
  logEvent_(String(userId), 'login', {});
  return { updated: true };
}

function getProgress_(userId) {
  const sheet = sheet_(AM_SHEETS.PROGRESS);
  const rowNumber = findRow_(sheet, 1, String(userId || ''));
  if (!rowNumber) return null;
  const row = sheet.getRange(rowNumber, 1, 1, AM_HEADERS.UserProgress.length).getValues()[0];
  return { progress_json: String(row[1] || '') };
}

function saveProgress_(userId, progress) {
  if (!userId || !progress || typeof progress !== 'object') throw new Error('INVALID_PROGRESS');
  const progressJson = JSON.stringify(progress);
  if (progressJson.length > 45000) throw new Error('PROGRESS_TOO_LARGE');

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = sheet_(AM_SHEETS.PROGRESS);
    const rowNumber = findRow_(sheet, 1, String(userId));
    const xp = Number(progress.earned && progress.earned.length || 0) * 10 +
      (progress.completed || []).reduce(function (sum, id) {
        return sum + (id === 'final' ? 50 : 25);
      }, 0);
    const completed = JSON.stringify(progress.completed || []);
    const now = new Date().toISOString();
    const row = [String(userId), progressJson, xp, completed, now];
    if (rowNumber) sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);

    saveMissionResults_(String(userId), progress.results || {});
    logEvent_(String(userId), 'progress_saved', { total_xp: xp });
    return { saved: true, total_xp: xp };
  } finally {
    lock.releaseLock();
  }
}

function saveMissionResults_(userId, results) {
  const sheet = sheet_(AM_SHEETS.RESULTS);
  Object.keys(results).forEach(function (missionId) {
    const result = results[missionId] || {};
    const completedAt = String(result.date || new Date().toISOString());
    const resultId = [userId, missionId, completedAt].join('::');
    const row = [
      resultId, userId, missionId, Number(result.score || 0),
      Boolean(result.passed), Number(result.xp || 0),
      JSON.stringify(result.answers || {}), completedAt
    ];
    const rowNumber = findRow_(sheet, 1, resultId);
    if (rowNumber) sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);
  });
}

function logEvent_(userId, eventType, details) {
  const sheet = sheet_(AM_SHEETS.LOGS);
  sheet.appendRow([
    Utilities.getUuid(), String(userId || ''), String(eventType || 'event'),
    JSON.stringify(details || {}), new Date().toISOString()
  ]);
  return { logged: true };
}

function userFromRow_(row) {
  if (!row || !row[0]) return null;
  return {
    user_id: String(row[0]),
    full_name: String(row[1]),
    email: String(row[2]),
    password_salt: String(row[3]),
    password_hash: String(row[4]),
    role: String(row[5] || 'student'),
    status: String(row[6] || 'active'),
    created_at: String(row[7] || ''),
    updated_at: String(row[8] || ''),
    last_login: String(row[9] || '')
  };
}

function sheet_(name) {
  const id = PropertiesService.getScriptProperties().getProperty('DATABASE_ID');
  if (!id) throw new Error('DATABASE_NOT_INITIALIZED: jalankan setupDatabase() terlebih dahulu.');
  const spreadsheet = SpreadsheetApp.openById(id);
  const sheet = spreadsheet.getSheetByName(name);
  if (!sheet) throw new Error('SHEET_NOT_FOUND: ' + name + '. Jalankan setupDatabase().');
  return sheet;
}

function findRow_(sheet, column, value) {
  if (sheet.getLastRow() < 2) return 0;
  const values = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getDisplayValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(value)) return i + 2;
  }
  return 0;
}

function authorized_(provided) {
  const expected = PropertiesService.getScriptProperties().getProperty('API_SECRET') || '';
  const actual = String(provided || '');
  if (!expected || expected.length !== actual.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  return mismatch === 0;
}

function jsonOutput_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
