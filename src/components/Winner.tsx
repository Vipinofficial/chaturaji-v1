'use client';

import { motion } from 'framer-motion';

type Player = 'red' | 'green' | 'yellow' | 'black';
type PieceType = 'king' | 'elephant' | 'horse' | 'boat' | 'pawn';
type Piece = {
  type: PieceType;
  player: Player;
  hasMoved?: boolean;
};

type Scores = {
  [key in Player]: {
    score: number;
    capturedPieces: Piece[];
  };
};

interface WinnerProps {
  scores: Scores;
  onPlayAgain: () => void;
}

export default function Winner({ scores, onPlayAgain }: WinnerProps) {
  // Find the winner
  const sortedPlayers = (Object.keys(scores) as Player[]).sort((a, b) => scores[b].score - scores[a].score);
  const winner = sortedPlayers[0];
  const isTie = scores[winner].score === scores[sortedPlayers[1]]?.score;

  const getPlayerColor = (player: Player): string => {
    const colors = {
      red: 'text-red-600 bg-red-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      black: 'text-gray-900 bg-gray-200'
    };
    return colors[player];
  };

  const getPlayerEmoji = (player: Player): string => {
    const emojis = {
      red: '🔴',
      green: '🟢',
      yellow: '🟡',
      black: '⚫'
    };
    return emojis[player];
  };

  const getPieceSymbol = (pieceType: PieceType): string => {
    const symbols = {
      king: '♔',
      elephant: '♗',
      horse: '♘',
      boat: '♖',
      pawn: '♙'
    };
    return symbols[pieceType];
  };

  return (
    <motion.div
      className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-4 border-amber-800"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Winner Announcement */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <div className="inline-block p-6 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full mb-4 shadow-lg">
          <span className="text-6xl">🏆</span>
        </div>
        
        <h1 className="text-4xl font-bold text-amber-900 mb-2">
          {isTie ? "It's a Tie!" : `${winner.toUpperCase()} Wins!`}
        </h1>
        
        {!isTie && (
          <div className={`inline-block px-6 py-3 rounded-full font-bold text-lg ${getPlayerColor(winner)}`}>
            {getPlayerEmoji(winner)} {winner.toUpperCase()} - {scores[winner].score} points
          </div>
        )}
      </motion.div>

      {/* Final Scores */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-center text-amber-900 mb-4">
          📊 Final Scores
        </h2>
        
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <motion.div
              key={player}
              className={`
                p-4 rounded-lg border-2 flex items-center justify-between
                ${index === 0 && !isTie ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'}
                ${getPlayerColor(player)}
              `}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold">
                  {index === 0 && !isTie ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                </div>
                <div>
                  <div className="font-bold text-lg">
                    {getPlayerEmoji(player)} {player.toUpperCase()}
                  </div>
                  <div className="text-sm opacity-75">
                    {scores[player].capturedPieces.length} pieces captured
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {scores[player].score}
                </div>
                <div className="text-sm opacity-75">points</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Captured Pieces Details */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-bold text-center text-amber-900 mb-4">
          🎯 Captured Pieces
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {(Object.keys(scores) as Player[]).map(player => (
            <div key={player} className={`p-3 rounded-lg ${getPlayerColor(player)}`}>
              <div className="font-semibold mb-2">{getPlayerEmoji(player)} {player.toUpperCase()}</div>
              {scores[player].capturedPieces.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {scores[player].capturedPieces.map((piece, idx) => (
                    <span
                      key={idx}
                      className="text-2xl"
                      title={`${piece.type} from ${piece.player}`}
                    >
                      {getPieceSymbol(piece.type)}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm opacity-75">No pieces captured</div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        className="mb-8 p-4 bg-amber-50 rounded-lg border-2 border-amber-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="font-bold text-amber-900 mb-2">📈 Game Statistics</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Total Pieces Captured:</span>
            <div className="text-lg">
              {Object.values(scores).reduce((sum, player) => sum + player.capturedPieces.length, 0)}
            </div>
          </div>
          <div>
            <span className="font-semibold">Total Points Scored:</span>
            <div className="text-lg">
              {Object.values(scores).reduce((sum, player) => sum + player.score, 0)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="space-y-3"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          onClick={onPlayAgain}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🎮 Play Again
        </motion.button>
        
        <div className="text-center text-sm text-gray-500">
          <p>🕉️ Thank you for playing Chaturaji! 🕉️</p>
        </div>
      </motion.div>
    </motion.div>
  );
}