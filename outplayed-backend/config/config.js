export const FetchObject = (gameType) => {
    const objectFetch =
        gameType === "5vs5"
            ? {
                  path: "playerJoined.UserOrTeam",
                  select: { name: 1, joinedmembers: 1, country: 1 ,creator:1 },
                  populate: {
                      path: "joinedmembers",
                      select: {
                          username: 1,
                          useravatar: 1,
                          prestige: 1,
                          ispremium: 1,
                          ispremiumadvnaced: 1,
                      },
                  },
              }
            : {
                  path: "playerJoined.UserOrTeam",
                  select: {
                      username: 1,
                      prestige1vs1: 1,
                      useravatar: 1,
                      ispremium: 1,
                      ispremiumadvnaced: 1,
                  },
              };
    return objectFetch;
};

export const roomLevels = {
    "0": "roomsLevelOne",
    "1": "roomsLevelTwo",
    "2": "roomsLevelThree",
    "3": "roomsLevelFour",
    "4": "roomsLevelFive",
    "5": "roomsLevelSix",
};

export const LevelsArray = [
    "roomsLevelOne",
    "roomsLevelTwo",
    "roomsLevelThree",
    "roomsLevelFour",
    "roomsLevelFive",
    "roomsLevelSix",
];

export const ForChangeRoomLevel = {
    roomsLevelOne: "roomsLevelTwo",
    roomsLevelTwo: "roomsLevelThree",
    roomsLevelThree: "roomsLevelFour",
    roomsLevelFour: "roomsLevelFive",
    roomsLevelFive: "roomsLevelSix",
};
  

