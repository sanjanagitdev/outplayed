import dotenv from 'dotenv';
dotenv.config();
// export const server = 'http://localhost:3001';
// export const client = 'http://localhost:3000';
export const server =
  process.env.NODE_ENV === 'development'
    ? 'http://15.188.166.158:3001'
    : 'localhost:3001';
export const client =
  process.env.NODE_ENV === 'development'
    ? 'http://15.188.166.158:5000'
    : 'localhost:3000';
export const STEAM_URL =
  'http://15.188.166.158:3001/api/user-route-handler/auth/steam';
export const API_URL = 'http://15.188.166.158:3001/api/user-route-handler';
export const ADMIN_API_URL =
  'http://15.188.166.158:3001/api/admin-route-handler';
export const NEWS_API_URL = 'http://15.188.166.158:3001/api/news-route-handler';
export const HUBS_API_URL = 'http://15.188.166.158:3001/api/hubs-route-handler';
export const MATCHMAKING_API_URL =
  'http://15.188.166.158:3001/api/matchmaking-route-handler';
export const TOURNAMENT_API_URL =
  'http://15.188.166.158:3001/api/tournament-route-handler';
export const LADDER_API_URL =
  'http://15.188.166.158:3001/api/ladder-route-handler';

// export const STEAM_URL =
//   'http://localhost:3001/api/user-route-handler/auth/steam';
// export const API_URL = 'http://localhost:3001/api/user-route-handler';
// export const ADMIN_API_URL = 'http://localhost:3001/api/admin-route-handler';
// export const NEWS_API_URL = 'http://localhost:3001/api/news-route-handler';
// export const HUBS_API_URL = 'http://localhost:3001/api/hubs-route-handler';
// export const MATCHMAKING_API_URL =
//   'http://localhost:3001/api/matchmaking-route-handler';
// export const TOURNAMENT_API_URL =
//   'http://localhost:3001/api/tournament-route-handler';
// export const LADDER_API_URL = 'http://localhost:3001/api/ladder-route-handler';
