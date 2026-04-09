import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Smile, Star } from 'lucide-react';

export default function RefreshView() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
       const [a, b, c] = lines[i];
       if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const handleClick = (i) => {
    if (board[i] || calculateWinner(board)) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);
  const status = winner ? `Winner: ${winner} 🎉` : isDraw ? "It's a Draw! 🤝" : `Next Player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
           <Smile size={36} /> Refresh Zone
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Take a tiny quick break. Recharge your mind! ☕</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', borderRadius: '20px' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', color: winner ? 'var(--success)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {winner && <Star fill="var(--success)" size={24}/>} {status}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '10px', background: 'var(--surface-border)', padding: '10px', borderRadius: '12px' }}>
          {board.map((square, i) => (
             <motion.button 
               key={i} 
               onClick={() => handleClick(i)}
               whileHover={{ scale: square ? 1 : 1.05 }}
               whileTap={{ scale: 0.95 }}
               style={{ width: '100px', height: '100px', background: 'white', border: 'none', borderRadius: '8px', fontSize: '3rem', fontWeight: 800, color: square === 'X' ? 'var(--primary)' : 'var(--danger)', cursor: square ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
             >
               {square}
             </motion.button>
          ))}
        </div>
        
        <button onClick={resetGame} className="btn-secondary" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', padding: '0.8rem 2rem', borderRadius: '30px' }}>
          <RefreshCcw size={18} /> Restart Game
        </button>
      </div>

    </motion.div>
  );
}
