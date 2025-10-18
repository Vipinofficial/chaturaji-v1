'use client';

import { motion } from 'framer-motion';

type Player = 'red' | 'green' | 'yellow' | 'black';
type PieceType = 'king' | 'elephant' | 'horse' | 'boat' | 'pawn';
type Piece = {
  type: PieceType;
  player: Player;
  hasMoved?: boolean;
};

type Square = Piece | null;
type Board = Square[][];

type Scores = {
  [key in Player]: {
    score: number;
    capturedPieces: Piece[];
  };
};

interface BoardProps {
  board: Board;
  currentPlayer: Player;
  scores: Scores;
  diceValue: number[] | null;
  selectedPiece: {row: number, col: number} | null;
  validMoves: {row: number, col: number}[];
  onSquareClick: (row: number, col: number) => void;
  onRollDice: () => void;
  isAIThinking: boolean;
  playVsAI: boolean;
  movesRemaining: number;
}

export default function Board({
  board,
  currentPlayer,
  scores,
  diceValue,
  selectedPiece,
  validMoves,
  onSquareClick,
  onRollDice,
  isAIThinking,
  playVsAI,
  movesRemaining
}: BoardProps) {
  
  const getPieceSymbol = (piece: Piece): string => {
    const symbols = {
      king: '♔',
      elephant: '♗',
      horse: '♘',
      boat: '♖',
      pawn: '♙'
    };
    return symbols[piece.type];
  };

  const getPlayerColor = (player: Player): string => {
    const colors = {
      red: 'text-red-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      black: 'text-gray-900'
    };
    return colors[player];
  };

  const getPlayerBgColor = (player: Player): string => {
    const colors = {
      red: 'bg-red-100',
      green: 'bg-green-100',
      yellow: 'bg-yellow-100',
      black: 'bg-gray-200'
    };
    return colors[player];
  };

  const getSquareColor = (row: number, col: number): string => {
    const isLight = (row + col) % 2 === 0;
    return isLight ? 'bg-amber-100' : 'bg-amber-200';
  };

  const getDicePieceTypes = (dice: number[]): string[] => {
    const pieceTypes: string[] = [];
    
    dice.forEach(die => {
      switch (die) {
        case 1:
        case 5:
          pieceTypes.push('Pawn', 'King'); // 1 and 5 allow pawn or king
          break;
        case 2:
          pieceTypes.push('Boat');
          break;
        case 3:
          pieceTypes.push('Horse');
          break;
        case 4:
        case 6:
          pieceTypes.push('Elephant');
          break;
      }
    });
    
    return pieceTypes;
  };

  const isSelected = (row: number, col: number): boolean => {
    return selectedPiece?.row === row && selectedPiece?.col === col;
  };

  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const canMovePiece = (piece: Piece): boolean => {
    if (!diceValue) return false;
    const allowedPieceTypes = getDicePieceTypes(diceValue);
    return allowedPieceTypes.includes(piece.type.charAt(0).toUpperCase() + piece.type.slice(1));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Game Board */}
      <div className="flex flex-col items-center">
        {/* Current Player Indicator */}
        <div className="mb-4 p-3 bg-white rounded-lg shadow-md border-2 border-amber-300">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold text-gray-700">Current Turn:</span>
            <div className={`px-3 py-1 rounded-full font-bold ${getPlayerBgColor(currentPlayer)} ${getPlayerColor(currentPlayer)}`}>
              {currentPlayer.toUpperCase()}
              {isAIThinking && ' (AI Thinking...)'}
            </div>
          </div>
        </div>

        {/* Chess Board */}
        <div className="relative">
          <div className="grid grid-cols-8 gap-0 border-4 border-amber-800 rounded-lg overflow-hidden shadow-2xl">
            {board.map((row, rowIndex) =>
              row.map((square, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer
                    relative transition-all duration-200
                    ${getSquareColor(rowIndex, colIndex)}
                    ${isSelected(rowIndex, colIndex) ? 'ring-4 ring-blue-500 ring-inset' : ''}
                    ${isValidMove(rowIndex, colIndex) ? 'ring-4 ring-green-400 ring-inset' : ''}
                    hover:brightness-110
                  `}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Valid move indicator */}
                  {isValidMove(rowIndex, colIndex) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full opacity-70"></div>
                    </div>
                  )}
                  
                  {/* Piece */}
                  {square && (
                    <motion.div
                      className={`
                        text-3xl sm:text-4xl select-none
                        ${getPlayerColor(square.player)}
                        ${canMovePiece(square) ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                        ${isSelected(rowIndex, colIndex) ? 'animate-pulse' : ''}
                      `}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {getPieceSymbol(square)}
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Board Labels */}
          <div className="absolute -left-8 top-0 flex flex-col justify-around h-full text-sm font-semibold text-amber-700">
            {['8', '7', '6', '5', '4', '3', '2', '1'].map(label => (
              <div key={label} className="h-12 sm:h-16 flex items-center justify-center">
                {label}
              </div>
            ))}
          </div>
          <div className="absolute -bottom-8 left-0 flex justify-around w-full text-sm font-semibold text-amber-700">
            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(label => (
              <div key={label} className="w-12 sm:w-16 flex items-center justify-center">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Controls and Scores */}
      <div className="flex flex-col gap-6 w-full lg:w-80">
        {/* Dice Component */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-amber-300">
          <h3 className="text-xl font-bold text-center mb-4 text-amber-900">🎲 Dice Roll</h3>
          
          {!diceValue ? (
            <motion.button
              onClick={onRollDice}
              disabled={isAIThinking}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md"
              whileHover={{ scale: isAIThinking ? 1 : 1.02 }}
              whileTap={{ scale: isAIThinking ? 1 : 0.98 }}
            >
              {isAIThinking ? 'AI is thinking...' : 'Roll Dice'}
            </motion.button>
          ) : (
            <div className="text-center">
              <div className="flex justify-center space-x-4 mb-4">
                {diceValue.map((die, index) => (
                  <motion.div
                    key={index}
                    className="inline-block p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl border-2 border-amber-400 shadow-lg"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="text-3xl font-bold text-amber-900">{die}</div>
                  </motion.div>
                ))}
              </div>
              <div className="text-sm text-amber-700 mb-2">
                {getDicePieceTypes(diceValue).join(' / ')}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Moves remaining: {movesRemaining}
              </div>
              <p className="text-sm text-gray-600">
                Click on a highlighted piece to move
              </p>
            </div>
          )}
        </div>

        {/* Scoreboard */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-amber-300">
          <h3 className="text-xl font-bold text-center mb-4 text-amber-900">🏆 Scoreboard</h3>
          <div className="space-y-3">
            {(Object.keys(scores) as Player[]).map(player => (
              <div
                key={player}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${currentPlayer === player ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
                  ${getPlayerBgColor(player)}
                `}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${getPlayerColor(player)}`}>
                    {player.toUpperCase()}
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {scores[player].score} pts
                  </span>
                </div>
                {scores[player].capturedPieces.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    Captured: {scores[player].capturedPieces.map(p => p.type).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Game Mode Indicator */}
        {playVsAI && (
          <div className="bg-purple-100 rounded-lg p-4 border-2 border-purple-300">
            <div className="flex items-center space-x-2 text-purple-800">
              <span className="text-xl">🤖</span>
              <span className="font-semibold">AI Mode Active</span>
            </div>
            <p className="text-sm text-purple-600 mt-1">
              You are playing as RED against 3 AI opponents
            </p>
          </div>
        )}

        {/* Game Instructions */}
        <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
          <h4 className="font-semibold text-amber-900 mb-2">How to Play (Authentic Chaturaji):</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>1. Roll two dice to determine which pieces can move</li>
            <li>2. You have two moves per turn (one for each die)</li>
            <li>3. Click on highlighted pieces, then green squares to move</li>
            <li>4. Capture enemy pieces to score points</li>
            <li>5. Game ends when 3 kings are captured!</li>
            <li>6. Boats jump 2 squares diagonally, not like bishops!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}