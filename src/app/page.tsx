'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HowToPlay from '@/components/HowToPlay';
import Board from '@/components/Board';
import Winner from '@/components/Winner';

// Game state types
type Player = 'red' | 'green' | 'yellow' | 'black';
type PieceType = 'king' | 'elephant' | 'horse' | 'boat' | 'pawn';
type Piece = {
  type: PieceType;
  player: Player;
  hasMoved?: boolean;
};

type Square = Piece | null;
type Board = Square[][];
type GameState = 'menu' | 'playing' | 'winner';

type Scores = {
  [key in Player]: {
    score: number;
    capturedPieces: Piece[];
  };
};

const initialScores: Scores = {
  red: { score: 0, capturedPieces: [] },
  green: { score: 0, capturedPieces: [] },
  yellow: { score: 0, capturedPieces: [] },
  black: { score: 0, capturedPieces: [] },
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red');
  const [board, setBoard] = useState<Board>([]);
  const [scores, setScores] = useState<Scores>(initialScores);
  const [diceValue, setDiceValue] = useState<number[] | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [validMoves, setValidMoves] = useState<{row: number, col: number}[]>([]);
  const [capturedKings, setCapturedKings] = useState<Player[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [playVsAI, setPlayVsAI] = useState(false);
  const [movesRemaining, setMovesRemaining] = useState<number>(0);

  // Initialize board
  const initializeBoard = () => {
    const newBoard: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Authentic Chaturaji opening setup based on historical sources
    // Black (left side - a-file)
    newBoard[7][0] = { type: 'boat', player: 'black' };     // a8
    newBoard[6][0] = { type: 'horse', player: 'black' };    // a7
    newBoard[5][0] = { type: 'elephant', player: 'black' }; // a6
    newBoard[4][0] = { type: 'king', player: 'black' };     // a5
    newBoard[7][1] = { type: 'pawn', player: 'black' };     // b8
    newBoard[6][1] = { type: 'pawn', player: 'black' };     // b7
    newBoard[5][1] = { type: 'pawn', player: 'black' };     // b6
    newBoard[4][1] = { type: 'pawn', player: 'black' };     // b5
    
    // Red (bottom - ranks 7-8, files e-h)
    newBoard[7][7] = { type: 'boat', player: 'red' };       // h8
    newBoard[7][6] = { type: 'horse', player: 'red' };      // g8
    newBoard[7][5] = { type: 'elephant', player: 'red' };   // f8
    newBoard[7][4] = { type: 'king', player: 'red' };       // e8
    newBoard[6][4] = { type: 'pawn', player: 'red' };       // e7
    newBoard[6][5] = { type: 'pawn', player: 'red' };       // f7
    newBoard[6][6] = { type: 'pawn', player: 'red' };       // g7
    newBoard[6][7] = { type: 'pawn', player: 'red' };       // h7
    
    // Green (right side - h-file)
    newBoard[0][7] = { type: 'boat', player: 'green' };     // h1
    newBoard[1][7] = { type: 'horse', player: 'green' };    // h2
    newBoard[2][7] = { type: 'elephant', player: 'green' }; // h3
    newBoard[3][7] = { type: 'king', player: 'green' };     // h4
    newBoard[0][6] = { type: 'pawn', player: 'green' };     // g1
    newBoard[1][6] = { type: 'pawn', player: 'green' };     // g2
    newBoard[2][6] = { type: 'pawn', player: 'green' };     // g3
    newBoard[3][6] = { type: 'pawn', player: 'green' };     // g4
    
    // Yellow (top - ranks 1-2, files a-d)
    newBoard[0][0] = { type: 'boat', player: 'yellow' };    // a1
    newBoard[0][1] = { type: 'horse', player: 'yellow' };   // b1
    newBoard[0][2] = { type: 'elephant', player: 'yellow' }; // c1
    newBoard[0][3] = { type: 'king', player: 'yellow' };    // d1
    newBoard[1][0] = { type: 'pawn', player: 'yellow' };    // a2
    newBoard[1][1] = { type: 'pawn', player: 'yellow' };    // b2
    newBoard[1][2] = { type: 'pawn', player: 'yellow' };    // c2
    newBoard[1][3] = { type: 'pawn', player: 'yellow' };    // d2
    
    return newBoard;
  };

  const startGame = (aiMode: boolean = false) => {
    setPlayVsAI(aiMode);
    setBoard(initializeBoard());
    setScores(initialScores);
    setCurrentPlayer('red');
    setDiceValue(null);
    setSelectedPiece(null);
    setValidMoves([]);
    setCapturedKings([]);
    setMovesRemaining(0);
    setGameState('playing');
  };

  const getPieceValue = (pieceType: PieceType): number => {
    switch (pieceType) {
      case 'pawn': return 1;
      case 'horse': return 3;
      case 'elephant': return 4;
      case 'king': return 5;
      case 'boat': return 2;
      default: return 0;
    }
  };

  const getDicePieceTypes = (dice: number[]): PieceType[] => {
    const pieceTypes: PieceType[] = [];
    
    dice.forEach(die => {
      switch (die) {
        case 1:
        case 5:
          pieceTypes.push('pawn', 'king'); // 1 and 5 allow pawn or king
          break;
        case 2:
          pieceTypes.push('boat');
          break;
        case 3:
          pieceTypes.push('horse');
          break;
        case 4:
        case 6:
          pieceTypes.push('elephant');
          break;
      }
    });
    
    return pieceTypes;
  };

  const getValidMoves = (piece: Piece, row: number, col: number): {row: number, col: number}[] => {
    const moves: {row: number, col: number}[] = [];
    
    switch (piece.type) {
      case 'pawn':
        // Pawns move forward one square (no initial double move)
        // Direction depends on player's starting position
        let pawnDir = {row: 0, col: 0};
        if (piece.player === 'red') pawnDir = {row: -1, col: 0}; // red moves up
        else if (piece.player === 'yellow') pawnDir = {row: 1, col: 0}; // yellow moves down
        else if (piece.player === 'green') pawnDir = {row: 0, col: -1}; // green moves left
        else if (piece.player === 'black') pawnDir = {row: 0, col: 1}; // black moves right
        
        const newRow = row + pawnDir.row;
        const newCol = col + pawnDir.col;
        
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const target = board[newRow][newCol];
          if (!target || target.player !== piece.player) {
            moves.push({row: newRow, col: newCol});
          }
        }
        break;
        
      case 'boat':
        // Boats jump exactly 2 squares diagonally
        const boatDirs = [[-2,-2], [-2,2], [2,-2], [2,2]];
        for (const [dr, dc] of boatDirs) {
          const newRow = row + dr;
          const newCol = col + dc;
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = board[newRow][newCol];
            if (!target || target.player !== piece.player) {
              moves.push({row: newRow, col: newCol});
            }
          }
        }
        break;
        
      case 'horse':
        // Horses move in L-shape (like chess knight)
        const horseMoves = [
          [-2,-1], [-2,1], [-1,-2], [-1,2],
          [1,-2], [1,2], [2,-1], [2,1]
        ];
        for (const [dr, dc] of horseMoves) {
          const newRow = row + dr;
          const newCol = col + dc;
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = board[newRow][newCol];
            if (!target || target.player !== piece.player) {
              moves.push({row: newRow, col: newCol});
            }
          }
        }
        break;
        
      case 'elephant':
        // Elephants move straight any distance (like chess rook)
        const elephantDirs = [[-1,0], [1,0], [0,-1], [0,1]];
        for (const [dr, dc] of elephantDirs) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i;
            const newCol = col + dc * i;
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            const target = board[newRow][newCol];
            if (!target) {
              moves.push({row: newRow, col: newCol});
            } else {
              if (target.player !== piece.player) {
                moves.push({row: newRow, col: newCol});
              }
              break;
            }
          }
        }
        break;
        
      case 'king':
        // Kings move one square in any direction (like chess king)
        const kingMoves = [
          [-1,-1], [-1,0], [-1,1],
          [0,-1], [0,1],
          [1,-1], [1,0], [1,1]
        ];
        for (const [dr, dc] of kingMoves) {
          const newRow = row + dr;
          const newCol = col + dc;
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = board[newRow][newCol];
            if (!target || target.player !== piece.player) {
              moves.push({row: newRow, col: newCol});
            }
          }
        }
        break;
    }
    
    return moves;
  };

  const handleSquareClick = (row: number, col: number) => {
    if (gameState !== 'playing' || !diceValue || movesRemaining === 0 || isAIThinking) return;
    
    const piece = board[row][col];
    
    // If clicking on a valid move, make the move
    if (selectedPiece && validMoves.some(m => m.row === row && m.col === col)) {
      makeMove(selectedPiece.row, selectedPiece.col, row, col);
      return;
    }
    
    // If clicking on a piece that matches one of the dice values
    if (piece && piece.player === currentPlayer) {
      const allowedPieceTypes = getDicePieceTypes(diceValue);
      if (allowedPieceTypes.includes(piece.type)) {
        setSelectedPiece({row, col});
        setValidMoves(getValidMoves(piece, row, col));
      }
    }
  };

  const checkBoatTriumph = (board: Board, row: number, col: number, currentPlayer: Player): {piece: Piece, position: {row: number, col: number}}[] => {
    const captures: {piece: Piece, position: {row: number, col: number}}[] = [];
    
    // Check all possible 2x2 squares that include the current position
    const positions = [
      {r: row-1, c: col-1}, {r: row-1, c: col},
      {r: row, c: col-1},   {r: row, c: col}
    ];
    
    // Check if this forms a 2x2 square of boats
    if (isBoatSquare(board, positions)) {
      // Find all enemy boats in this square to capture
      positions.forEach(pos => {
        if (pos.r >= 0 && pos.r < 8 && pos.c >= 0 && pos.c < 8) {
          const piece = board[pos.r][pos.c];
          if (piece && piece.type === 'boat' && piece.player !== currentPlayer) {
            captures.push({piece, position: pos});
          }
        }
      });
    }
    
    return captures;
  };

  const isBoatSquare = (board: Board, positions: {r: number, c: number}[]): boolean => {
    let boatCount = 0;
    let players = new Set<Player>();
    
    positions.forEach(pos => {
      if (pos.r >= 0 && pos.r < 8 && pos.c >= 0 && pos.c < 8) {
        const piece = board[pos.r][pos.c];
        if (piece && piece.type === 'boat') {
          boatCount++;
          players.add(piece.player);
        }
      }
    });
    
    // Need exactly 4 boats from 4 different players
    return boatCount === 4 && players.size === 4;
  };

  const makeMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const newBoard = [...board.map(row => [...row])];
    const piece = newBoard[fromRow][fromCol]!;
    const capturedPiece = newBoard[toRow][toCol];
    
    // Handle capture
    if (capturedPiece) {
      const newScores = {...scores};
      newScores[currentPlayer].score += getPieceValue(capturedPiece.type);
      newScores[currentPlayer].capturedPieces.push(capturedPiece);
      setScores(newScores);
      
      // Check if king was captured
      if (capturedPiece.type === 'king') {
        setCapturedKings([...capturedKings, capturedPiece.player]);
        if (capturedKings.length + 1 >= 3) {
          setGameState('winner');
          return;
        }
      }
    }
    
    // Move piece
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    piece.hasMoved = true;
    
    // Check for Boat Triumph (2x2 square of boats)
    if (piece.type === 'boat') {
      const triumphCaptures = checkBoatTriumph(newBoard, toRow, toCol, currentPlayer);
      if (triumphCaptures.length > 0) {
        // Handle the additional captures from boat triumph
        const newScores = {...scores};
        triumphCaptures.forEach(captured => {
          newScores[currentPlayer].score += getPieceValue(captured.type);
          newScores[currentPlayer].capturedPieces.push(captured);
          newBoard[captured.position.row][captured.position.col] = null;
          
          // Check if king was captured in triumph
          if (captured.type === 'king') {
            setCapturedKings(prev => [...prev, captured.player]);
            if (capturedKings.length + 1 >= 3) {
              setGameState('winner');
              return;
            }
          }
        });
        setScores(newScores);
      }
    }
    
    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);
    
    // Update moves remaining
    const newMovesRemaining = movesRemaining - 1;
    setMovesRemaining(newMovesRemaining);
    
    // If no moves remaining, next turn
    if (newMovesRemaining === 0) {
      setDiceValue(null);
      nextTurn();
    }
  };

  const nextTurn = () => {
    const players: Player[] = ['red', 'green', 'yellow', 'black'];
    const currentIndex = players.indexOf(currentPlayer);
    let nextIndex = (currentIndex + 1) % 4;
    
    // Skip players whose king has been captured
    while (capturedKings.includes(players[nextIndex])) {
      nextIndex = (nextIndex + 1) % 4;
    }
    
    setCurrentPlayer(players[nextIndex]);
    setMovesRemaining(0);
  };

  const rollDice = () => {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    setDiceValue([die1, die2]);
    setSelectedPiece(null);
    setValidMoves([]);
    setMovesRemaining(2); // Two moves per turn in Chaturaji
  };

  // AI move logic
  useEffect(() => {
    if (playVsAI && currentPlayer !== 'red' && gameState === 'playing' && diceValue && movesRemaining > 0 && !isAIThinking) {
      setIsAIThinking(true);
      
      setTimeout(() => {
        const allowedPieceTypes = getDicePieceTypes(diceValue);
        const movablePieces: {row: number, col: number, moves: {row: number, col: number}[]}[] = [];
        
        // Find all pieces that can move
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.player === currentPlayer && allowedPieceTypes.includes(piece.type)) {
              const moves = getValidMoves(piece, row, col);
              if (moves.length > 0) {
                movablePieces.push({row, col, moves});
              }
            }
          }
        }
        
        if (movablePieces.length > 0) {
          // Choose a random piece and random valid move
          const piece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
          const move = piece.moves[Math.floor(Math.random() * piece.moves.length)];
          makeMove(piece.row, piece.col, move.row, move.col);
        } else {
          // No valid moves, skip this move
          const newMovesRemaining = movesRemaining - 1;
          setMovesRemaining(newMovesRemaining);
          
          if (newMovesRemaining === 0) {
            setDiceValue(null);
            nextTurn();
          }
        }
        
        setIsAIThinking(false);
      }, 1000);
    }
  }, [currentPlayer, diceValue, movesRemaining, playVsAI, gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <HowToPlay onStartGame={startGame} />
          </motion.div>
        )}
        
        {gameState === 'playing' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Board
              board={board}
              currentPlayer={currentPlayer}
              scores={scores}
              diceValue={diceValue}
              selectedPiece={selectedPiece}
              validMoves={validMoves}
              onSquareClick={handleSquareClick}
              onRollDice={rollDice}
              isAIThinking={isAIThinking}
              playVsAI={playVsAI}
              movesRemaining={movesRemaining}
            />
          </motion.div>
        )}
        
        {gameState === 'winner' && (
          <motion.div
            key="winner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Winner scores={scores} onPlayAgain={() => setGameState('menu')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}