import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import socket from 'socket.io';
import http from 'http';
import { mongoConnect } from './config/db';
import UserRoute from './routes-handler/userRoute';
import AdminRoute from './routes-handler/adminRoute';
import NewsRoute from './routes-handler/newsRoute';
import HubsRoute from './routes-handler/hubsRoute';
import MatchMakingRoute from './routes-handler/matchmaking';
import TournamentRoute from './routes-handler/tournamentRoute';
import LadderRoute from './routes-handler/ladder';
import { passportService } from './services/passport';
import { SocketConnection } from './socket';
import { returnCron } from './cronjobs/cron';
import Paypal from 'paypal-rest-sdk';
import { InitilizeWebHook } from './functions/webhooknotification';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socket(server);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
mongoConnect();
passportService();
SocketConnection(io);
returnCron(io);
// InitilizeWebHook();
app.use(
  cors({
    origin: [process.env.DEVELOPMENT_URL, process.env.LOCAL_URL],
    credentials: true,
  })
);
app.use('/api/user-route-handler', UserRoute(io));
app.use('/api/admin-route-handler', AdminRoute(io));
app.use('/api/news-route-handler', NewsRoute());
app.use('/api/hubs-route-handler', HubsRoute(io));
app.use('/api/matchmaking-route-handler', MatchMakingRoute(io));
app.use('/api/tournament-route-handler', TournamentRoute(io));
app.use('/api/ladder-route-handler', LadderRoute(io));
// app.use("/api/user-route-handler/getWebhookNotifications", InitilizeWebHook);

// app.post('/hook', (req, res) => {
//   console.log(req.body); // Call your action on the request here
//   res.status(200).end(); // Responding is important
// });

server.listen(process.env.PORT || 3001, () => {
  console.log(`Listning ${process.env.PORT}`);
});
