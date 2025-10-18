'use client';

import { motion } from 'framer-motion';

interface HowToPlayProps {
  onStartGame: (aiMode?: boolean) => void;
}

export default function HowToPlay({ onStartGame }: HowToPlayProps) {
  return (
    <motion.div
      className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-4 border-amber-800"
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative header */}
      <div className="text-center mb-6">
        <div className="inline-block p-4 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full mb-4">
          <span className="text-6xl">♔</span>
        </div>
        <h1 className="text-4xl font-bold text-amber-900 mb-2">
          Chaturaji
        </h1>
        <p className="text-xl text-amber-700 italic">
          The Ancient Indian Game of Four Kings
        </p>
      </div>

      {/* Description */}
      <div className="mb-8 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
        <p className="text-gray-700 leading-relaxed text-center">
          An ancient Indian strategy game played by 4 players with dice. Each army has a King, Elephant, Horse, Boat, and 4 Pawns. The goal is to score the most points by capturing opponent pieces.
        </p>
      </div>

      {/* Rules */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-4 text-center">
          📜 Rules of the Game
        </h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">👥</span>
            <div>
              <h3 className="font-semibold text-gray-800">4 Players</h3>
              <p className="text-gray-600">Red, Green, Yellow, and Black armies compete for supremacy</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🎲</span>
            <div>
              <h3 className="font-semibold text-gray-800">Two Dice System</h3>
              <p className="text-gray-600">Roll two dice each turn, make up to two moves:</p>
              <ul className="text-sm text-gray-500 mt-1 ml-4">
                <li>1 & 5 = Pawn or King • 2 = Boat • 3 = Horse</li>
                <li>4 & 6 = Elephant • Same or different pieces can be moved</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="text-2xl">♟️</span>
            <div>
              <h3 className="font-semibold text-gray-800">Army Composition</h3>
              <p className="text-gray-600">Each player has: 1 King, 1 Elephant, 1 Horse, 1 Boat, 4 Pawns</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="font-semibold text-gray-800">Scoring System</h3>
              <p className="text-gray-600">Points for captured pieces:</p>
              <ul className="text-sm text-gray-500 mt-1 ml-4">
                <li>Pawn = 1 point • Horse = 3 points • Elephant = 4 points</li>
                <li>Boat = 2 points • King = 5 points</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-semibold text-gray-800">Victory Condition</h3>
              <p className="text-gray-600">Game ends when 3 kings are captured. Highest score wins!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Piece Movement Guide */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-3 text-center">🎯 How Pieces Move (Authentic Rules)</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xl">♟️</span>
            <span className="text-gray-600"><strong>Pawn:</strong> Forward 1 square only</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">♜</span>
            <span className="text-gray-600"><strong>Boat:</strong> Jumps 2 squares diagonally</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">♞</span>
            <span className="text-gray-600"><strong>Horse:</strong> L-shape (like chess knight)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">♝</span>
            <span className="text-gray-600"><strong>Elephant:</strong> Straight any distance (rook)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">♚</span>
            <span className="text-gray-600"><strong>King:</strong> 1 square any direction</span>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <span className="text-xl">⚡</span>
            <span className="text-gray-600"><strong>Boat Triumph:</strong> Form 2×2 boat square to capture all 3!</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          onClick={() => onStartGame(false)}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🎮 Start Multiplayer Game
        </motion.button>
        
        <motion.button
          onClick={() => onStartGame(true)}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🤖 Play vs AI
        </motion.button>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>🕉️ A game of strategy from ancient India 🕉️</p>
      </div>
    </motion.div>
  );
}