import React, { useState, useEffect } from "react";
import { FiSun, FiMoon, FiUser, FiArrowRight } from "react-icons/fi";

function App() {
  // Steps: "setup" (choose number of players and game type), "names" (enter names), "game" (score tracker)
  const [step, setStep] = useState("setup");
  const [numPlayers, setNumPlayers] = useState(2);
  const [gameType, setGameType] = useState("");
  const [playerNames, setPlayerNames] = useState([]);

  // Game data state
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [scoreInput, setScoreInput] = useState("");

  // Dark mode state
  const [darkMode, setDarkMode] = useState(true);

  // Load game and dark mode settings from localStorage on mount
  useEffect(() => {
    const savedGame = localStorage.getItem("gameData");
    if (savedGame) {
      const gameData = JSON.parse(savedGame);
      setPlayers(gameData.players);
      setCurrentPlayerIndex(gameData.currentPlayerIndex);
      setStep("game");
    }
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save game data on update
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(
        "gameData",
        JSON.stringify({ players, currentPlayerIndex })
      );
    }
  }, [players, currentPlayerIndex]);

  // Save dark mode setting and update HTML class
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Step 1: Handle initial setup form submission
  const handleSetupSubmit = (e) => {
    e.preventDefault();
    if (!gameType) {
      alert("Please select a game type.");
      return;
    }
    // Initialize empty player names array based on the number selected
    setPlayerNames(Array(numPlayers).fill(""));
    setStep("names");
  };

  // Step 2: Handle player names submission
  const handleNamesSubmit = (e) => {
    e.preventDefault();
    if (playerNames.some((name) => name.trim() === "")) {
      alert("Please enter all player names.");
      return;
    }
    const playersArray = playerNames.map((name) => ({
      name: name.trim(),
      score: 0,
    }));
    setPlayers(playersArray);
    setCurrentPlayerIndex(0);
    setStep("game");
  };

  // Update a specific player's name in the names array
  const handleNameChange = (e, index) => {
    const newNames = [...playerNames];
    newNames[index] = e.target.value;
    setPlayerNames(newNames);
  };

  // Game: Add score to the current player and update turn
  const addScore = () => {
    const score = parseInt(scoreInput, 10);
    if (isNaN(score)) return;
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].score += score;
    setPlayers(updatedPlayers);
    setScoreInput("");
    setCurrentPlayerIndex((currentPlayerIndex + 1) % updatedPlayers.length);
  };

  // Reset game to initial setup
  const resetGame = () => {
    localStorage.removeItem("gameData");
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setPlayerNames([]);
    setStep("setup");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
        {/* Header with title and dark mode toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-pressstart text-gray-800 dark:text-gray-100">
            {step === "game" ? "Score Tracker" : "Game Setup"}
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {step === "setup" && (
          <form onSubmit={handleSetupSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Players
              </label>
              <select
                value={numPlayers}
                onChange={(e) => setNumPlayers(parseInt(e.target.value, 10))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Game Type
              </label>
              <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="" disabled>
                  Select game type
                </option>
                <option value="Poker">Poker</option>
                <option value="Bridge">Bridge</option>
                <option value="Hearts">Hearts</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
              Next <FiArrowRight className="ml-2" />
            </button>
          </form>
        )}

        {step === "names" && (
          <form onSubmit={handleNamesSubmit} className="space-y-4">
            <h2 className="text-lg font-pressstart text-gray-800 dark:text-gray-100">
              Enter Player Names
            </h2>
            {playerNames.map((name, index) => (
              <div key={index} className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FiUser size={18} />
                </span>
                <input
                  type="text"
                  placeholder={`Player ${index + 1} Name`}
                  value={name}
                  onChange={(e) => handleNameChange(e, index)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
              Start Game <FiArrowRight className="ml-2" />
            </button>
          </form>
        )}

        {step === "game" && (
          <div className="space-y-4">
            <h2 className="text-lg font-pressstart text-gray-800 dark:text-gray-100">
              {gameType} Score Tracker
            </h2>
            <p className="text-md text-gray-700 dark:text-gray-300">
              Current Player:{" "}
              <span className="font-semibold">
                {players[currentPlayerIndex].name}
              </span>
            </p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                Score
              </span>
              <input
                type="number"
                placeholder="Enter Score"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                className="w-full pl-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
            <button
              onClick={addScore}
              className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
            >
              Add Score
            </button>
            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">
                Current Scores
              </h3>
              <ul className="mt-2 space-y-1">
                {players.map((player, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    {player.name}: {player.score}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={resetGame}
              className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
            >
              New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
