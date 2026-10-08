import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { advisoryRouter } from './routes/advisories.js';
import { poiRouter } from './routes/pois.js';
import { checklistRouter } from './routes/checklists.js';
import { hotlineRouter } from './routes/hotlines.js';
import { syncRouter } from './routes/sync.js';
import { sosRouter } from './routes/sos.js';
import { telemetryRouter } from './routes/telemetry.js';
import { getDb } from './db/sqlite.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const dbFilePath = path.resolve(process.cwd(), 'emergency_backup.sqlite');

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Health & Node Diagnostic endpoint
app.get('/api/health', async (_req, res) => {
  let dbSizeBytes = 0;
  if (fs.existsSync(dbFilePath)) {
    try {
      dbSizeBytes = fs.statSync(dbFilePath).size;
    } catch {
      // ignore
    }
  }

  let tableCounts = { advisories: 0, pois: 0, checklists: 0, hotlines: 0, backups: 0, sosDispatches: 0 };
  try {
    const db = await getDb();
    tableCounts.advisories = db.exec("SELECT COUNT(*) FROM advisories")[0]?.values[0]?.[0] as number || 0;
    tableCounts.pois = db.exec("SELECT COUNT(*) FROM pois")[0]?.values[0]?.[0] as number || 0;
    tableCounts.checklists = db.exec("SELECT COUNT(*) FROM checklists")[0]?.values[0]?.[0] as number || 0;
    tableCounts.hotlines = db.exec("SELECT COUNT(*) FROM hotlines")[0]?.values[0]?.[0] as number || 0;
    tableCounts.backups = db.exec("SELECT COUNT(*) FROM sync_backups")[0]?.values[0]?.[0] as number || 0;
    tableCounts.sosDispatches = db.exec("SELECT COUNT(*) FROM sos_dispatches")[0]?.values[0]?.[0] as number || 0;
  } catch {
    // ignore
  }

  res.json({
    status: 'ONLINE',
    service: 'BLACKOUT-RELAY-NODE',
    nodeRole: 'MUNICIPAL_CRISIS_RELAY',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    database: {
      engine: 'SQLite (sql.js WASM)',
      fileSizeBytes: dbSizeBytes,
      fileSizeKb: (dbSizeBytes / 1024).toFixed(1),
      tableCounts,
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
  });
});

// Mounted Routes
app.use('/api/advisories', advisoryRouter);
app.use('/api/pois', poiRouter);
app.use('/api/checklists', checklistRouter);
app.use('/api/hotlines', hotlineRouter);
app.use('/api/sync', syncRouter);
app.use('/api/sos', sosRouter);
app.use('/api/telemetry', telemetryRouter);

async function startServer() {
  try {
    await getDb();
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`[BLACKOUT] Relay Node server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[BLACKOUT] Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
