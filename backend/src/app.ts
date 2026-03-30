import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { emergencyRouter } from './routes/emergency';
import { authRouter }      from './routes/auth';
import { contactsRouter }  from './routes/contacts';
import { historyRouter }   from './routes/history';
import { websocketSetup }  from './websocket/alertSocket';
import { logger }          from './utils/logger';

const app    = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

const emergencyLimit = rateLimit({ windowMs: 60_000, max: 30 });

app.use('/api/auth',      authRouter);
app.use('/api/emergency', emergencyLimit, emergencyRouter);
app.use('/api/contacts',  contactsRouter);
app.use('/api/history',   historyRouter);
app.use('/api/health',    (_: express.Request, res: express.Response) => res.json({ status: 'ok', ts: Date.now() }));

websocketSetup(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logger.info(`MeuProtetor API running on port ${PORT}`));
export { app, server };
