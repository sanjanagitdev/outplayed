import openSocket from 'socket.io-client';
import { server } from '../config/keys';
const socket = openSocket(server, {
  transports: ['websocket'],
  rejectUnauthorized: false,
  query: `token=${localStorage.getItem('webtoken')}`,
});
socket.on('connect', () => {
  console.log('connected');
});
socket.on('reconnect', () => {
  const isLogin = localStorage.getItem('webtoken');
  const userid = localStorage.getItem('userid');
  if (isLogin && userid) {
    console.log('Reconnecting called');
    socket.emit('join', userid);
  }
});

const GetCreatedHubs = (cb) => {
  socket.on('GetCreatedHubs', (data) => {
    cb(data);
  });
};

const GetHubsChat = (cb) => {
  socket.on('GetHubsChat', (data) => {
    cb(data);
  });
};
const PlayerJoinInHub = (cb) => {
  socket.on('PlayerJoinInHub', (data) => {
    cb(data);
  });
};
const PlayerJoinHubFull = (cb) => {
  socket.on('PlayerJoinHubFull', (data) => {
    cb(data);
  });
};
const PlayerPickTimer = (cb) => {
  socket.on('PlayerPickTimer', (data) => {
    cb(data);
  });
};

const HubGameCancelled = (cb) => {
  socket.on('HubGameCancelled', (data) => {
    cb(data);
  });
};

const RefreshHubList = (cb) => {
  socket.on('RefreshHubList', (data) => {
    cb(data);
  });
};

const PickPlayerEvent = (cb) => {
  socket.on('PickPlayerEvent', (data) => {
    cb(data);
  });
};

const PickMapEvent = (cb) => {
  socket.on('PickMapEvent', (data) => {
    cb(data);
  });
};

const SetHubsIP = (cb) => {
  socket.on('SetHubsIP', (data) => {
    cb(data);
  });
};

const ExitFromHub = (cb) => {
  socket.on('ExitFromHub', (data) => {
    cb(data);
  });
};
const GetNotifications = (cb) => {
  socket.on('GetNotifications', (data) => {
    cb(data);
  });
};

const GetNotifiyQueueFind = (cb) => {
  socket.on('GetNotifiyQueueFind', (data) => {
    cb(data);
  });
};

const CheckJoinedStatus = (cb) => {
  socket.on('CheckJoinedStatus', (data) => {
    cb(data);
  });
};

const CheckJoinedStatus1vs1 = (cb) => {
  socket.on('CheckJoinedStatus1vs1', (data) => {
    cb(data);
  });
};
const ResetRoom = (cb) => {
  socket.on('ResetRoom', (data) => {
    cb(data);
  });
};

const LeaveGroup = (cb) => {
  socket.on('LeaveGroup', (data) => {
    cb(data);
  });
};

/** ------------- Tournament events start here -------------- */

const GetTournaments = (cb) => {
  socket.on('GetTournaments', (data) => {
    cb(data);
  });
};

const GetNotifyEventTournament = (cb) => {
  socket.on('GetNotifyEventTournament', (data) => {
    cb(data);
  });
};

const TournamentEvents = (cb) => {
  socket.on('TournamentEvents', (data) => {
    cb(data);
  });
};
const GetMapVotingStart = (cb) => {
  socket.on('GetMapVotingStart', (data) => {
    cb(data);
  });
};
/** --------------- End here ---------------------------------- */

// Scouting area real time Events --

const refreshScoutingList = (cb) => {
  socket.on('refreshScoutingList', (data) => {
    cb(data);
  });
};

const ScoutingAriaChat = (cb) => {
  socket.on('ScoutingAriaChat', (data) => {
    cb(data);
  });
};
const GetCreateTournament = (cb) => {
  socket.on('GetCreateTournament', (data) => {
    cb(data);
    console.log(data);
  });
};

const GetCommentData = (cb) => {
  socket.on('GetCommentData', (data) => {
    cb(data);
  });
};

const GetCommentDataOff = (cb) => {
  socket.off('GetCommentData', (data) => {
    cb(data);
  });
};

export {
  socket,
  GetCreatedHubs,
  GetHubsChat,
  PlayerJoinInHub,
  PlayerJoinHubFull,
  PlayerPickTimer,
  HubGameCancelled,
  RefreshHubList,
  PickPlayerEvent,
  PickMapEvent,
  SetHubsIP,
  ExitFromHub,
  GetNotifications,
  GetNotifiyQueueFind,
  CheckJoinedStatus,
  ResetRoom,
  CheckJoinedStatus1vs1,
  LeaveGroup,
  GetTournaments,
  GetNotifyEventTournament,
  TournamentEvents,
  GetMapVotingStart,
  refreshScoutingList,
  ScoutingAriaChat,
  GetCreateTournament,
  GetCommentData,
  GetCommentDataOff,
};
