import dotenv from 'dotenv';
dotenv.config();
export const server =
  process.env.NODE_ENV === 'development'
    ? 'http://15.188.166.158:3001'
    : 'http://localhost:3001';
export const client =
  process.env.NODE_ENV === 'development'
    ? 'http://15.188.166.158:3000'
    : 'http://localhost:3000';

export const PORT = process.env.PORT || 3001;

export const userJwtKey =
  'xml#!@%gjvm!1246545214!vNlq;4..24t5/T%$Q#7jJDvm,TRY342Tgdf*&Q$_=2354=hsfjv@#%$';

export const adminJwtKey =
  "!$erh%^*3hnmvnmKO%345625qGfytEU#^'rpup2']uk[3y./@1564633";

export const cryptoKey =
  '>C34%63:kl[oLlu9785=6@fvXBN682!`#$#@%^hnDGU$uJ6rrrg4@';

export const cookieSecret = 'A@#$6db@%4*^qfbdb4545@dvdDFvbETH32%nDFDxcv#546';

// {
//     "providerURL": "http://steamcommunity.com/openid",
//     "stateless": true,
//     "returnURL": "http://15.188.166.158:3001/api/user-route-handler/auth/steam/return",
//     "realm": "http://15.188.166.158:3001"
//   }

// {
//   "providerURL": "http://steamcommunity.com/openid",
//   "stateless": true,
//   "returnURL": "http://localhost:3001/api/user-route-handler/auth/steam/return",
//   "realm": "http://localhost:3001"
// }
