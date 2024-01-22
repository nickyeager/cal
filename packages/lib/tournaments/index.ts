export const shuffledPlayers = (players: Array) => {
  return [...players].sort(() => 0.5 - Math.random());
};

export const createDoublesPairs = (players) => {
  const pairs = [];
  const totalRounds = players.length - 1;
  const playersPerRound = Math.floor(players.length / 2);

  for (let round = 0; round < totalRounds; round++) {
    for (let match = 0; match < playersPerRound; match++) {
      const player1 = players[(round + match) % players.length];
      const player2 = players[(round - match + players.length) % players.length];

      // Avoid pairing a player with themselves (happens in case of odd number)
      if (player1 !== player2) {
        pairs.push([player1, player2]);
      }
    }
  }

  return pairs;
};
export const roundRobinDoubles = (pairs) => {
  if (pairs.length % 2 === 1) {
    pairs.push(null); // Add a "bye" if there's an odd number of pairs
  }

  const numRounds = pairs.length - 1;
  const halfSize = pairs.length / 2;

  let teams = pairs.slice();
  const schedule = [];

  for (let round = 0; round < numRounds; round++) {
    const roundMatches = [];

    for (let i = 0; i < halfSize; i++) {
      const home = teams[i];
      const away = teams[pairs.length - 1 - i];
      if (home && away) {
        // Ensure no "bye"
        roundMatches.push({ home, away });
      }
    }

    teams = [teams[0], ...teams.slice(2), teams[1]];
    schedule.push(roundMatches);
  }

  return schedule;
};

export const generateAllPairs = (players) => {
  const pairs = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      pairs.push([players[i], players[j]]);
    }
  }
  return pairs;
};

export const isValidRound = (pairs, round) => {
  const players = new Set();
  for (const pair of round) {
    if (players.has(pair[0]) || players.has(pair[1])) {
      return false;
    }
    players.add(pair[0]);
    players.add(pair[1]);
  }
  return true;
};

export const generateRoundRobinSchedule = (players) => {
  if (players.length % 2 !== 0) {
    players.push("Bye"); // Add a "bye" if odd number of players
  }

  const numRounds = players.length - 1;
  const numMatchesPerRound = players.length / 2;
  const schedule = [];

  for (let round = 0; round < numRounds; round++) {
    const roundMatches = [];

    for (let match = 0; match < numMatchesPerRound; match++) {
      const home = players[match];
      const away = players[players.length - match - 1];

      roundMatches.push({ home, away });
    }
    // Rotate players for the next round
    players.splice(1, 0, players.pop());
    schedule.push(roundMatches);
  }

  return schedule;
};

export const generateMatches = (players) => {
  if (players.length % 2 !== 0) {
    players.push("Bye"); // Add a "bye" if odd number of players
  }

  const numRounds = players.length - 1;
  const numMatchesPerRound = players.length / 2;
  const schedule = [];

  for (let round = 0; round < numRounds; round++) {
    const roundMatches = [];

    for (let match = 0; match < numMatchesPerRound; match++) {
      const home = players[match];
      const away = players[players.length - match - 1];

      roundMatches.push({ home, away });
    }
    // Rotate players for the next round
    players.splice(1, 0, players.pop());
    schedule.push(roundMatches);
  }

  return schedule;
};

export const sortMatchesIntoRounds = (matches) => {
  // Group matches by round
  const rounds = matches.reduce((acc, match) => {
    acc[match.round] = acc[match.round] || [];
    acc[match.round].push(match);
    return acc;
  }, {});

  // Sort each round and format matches
  const sortedRounds = Object.values(rounds).map((roundMatches) => {
    // Assuming 'home' and 'away' player details are in 'scores' array
    return roundMatches
      .sort((a, b) => a.matchNumber - b.matchNumber)
      .map((match) => {
        // Example: { home: match.scores[0], away: match.scores[1] }
        // Adjust according to actual data structure
        console.log(match);
        return {
          home: match.players.length > 0 ? match.players[0].user : "TBD",
          away: match.players.length > 1 ? match.players[1].user : "TBD",
        };
      });
  });

  return sortedRounds;
};
