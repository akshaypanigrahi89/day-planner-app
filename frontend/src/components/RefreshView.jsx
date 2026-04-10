import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export default function RefreshView() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "Tic-Tac-Toe", id: 0 },
    { title: "Breathing Zone", id: 1 },
    { title: "Rock Paper Scissors", id: 2 },
    { title: "Reaction Test", id: 3 },
    { title: "Memory Match", id: 4 },
    { title: "Chess", id: 5 },
    { title: "Card Game", id: 6 },
    { title: "Sudoku", id: 7 },
    { title: "Quick Ludo", id: 8 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', background: 'transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>Refresh <span style={{ color: 'var(--primary)' }}>Zone</span></h2>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          {tabs.map((tab, i) => (
             <button key={i} onClick={() => setActiveTab(i)} style={{ border: 'none', background: activeTab === i ? 'var(--primary)' : 'transparent', color: activeTab === i ? 'white' : 'var(--text-muted)', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>{tab.title}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <AnimatePresence mode="wait">
             <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} style={{ width: '100%', maxWidth: '700px' }}>
                {activeTab === 0 && <TicTacToeGame />}
                {activeTab === 1 && <BreathingZone />}
                {activeTab === 2 && <RPSGame />}
                {activeTab === 3 && <ReactionTest />}
                {activeTab === 4 && <MemoryMatch />}
                {activeTab === 5 && <ChessGame />}
                {activeTab === 6 && <LuckyCardsGame />}
                {activeTab === 7 && <SudokuGame />}
                {activeTab === 8 && <QuickLudoGame />}
             </motion.div>
          </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// 1. TIC-TAC-TOE
// ---------------------------------------------------------
function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
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

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner}` : board.every(Boolean) ? 'Draw!' : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>{status}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gridTemplateRows: 'repeat(3, 100px)', gap: '10px' }}>
        {board.map((cell, i) => (
          <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleClick(i)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: 800, background: 'rgba(255,255,255,0.8)', borderRadius: '15px', color: cell === 'X' ? 'var(--primary)' : 'var(--danger)', cursor: 'pointer', border: '2px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            {cell}
          </motion.div>
        ))}
      </div>
      <button className="btn-secondary" onClick={() => { setBoard(Array(9).fill(null)); setXIsNext(true); }}>Reset Game</button>
    </div>
  );
}

// ---------------------------------------------------------
// 2. BREATHING ZONE
// ---------------------------------------------------------
function BreathingZone() {
    const [phase, setPhase] = useState('Inhale');
    const [active, setActive] = useState(false);

    useEffect(() => {
        let timer;
        if(active) {
            if(phase === 'Inhale') timer = setTimeout(() => setPhase('Hold'), 4000);
            else if(phase === 'Hold') timer = setTimeout(() => setPhase('Exhale'), 2000);
            else if(phase === 'Exhale') timer = setTimeout(() => setPhase('Inhale'), 4000);
        } else {
            setPhase('Inhale');
        }
        return () => clearTimeout(timer);
    }, [active, phase]);

    return (
        <div className="glass-panel" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Focus on the circle. Follow its rhythm.</h3>
            <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ scale: active ? (phase === 'Inhale' || phase === 'Hold' ? 1.5 : 1) : 1, opacity: active ? (phase === 'Hold' ? 0.9 : 0.6) : 0.3 }} transition={{ duration: phase==='Hold'? 2 : 4, ease: 'easeInOut' }} style={{ position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)' }} />
                <span style={{ position: 'relative', zIndex: 1, color: active ? 'white' : 'var(--text-muted)', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '2px' }}>{active ? phase : 'READY'}</span>
            </div>
            <button className="btn-primary" onClick={() => setActive(!active)} style={{ padding: '0.8rem 2rem', borderRadius: '30px' }}>{active ? 'Stop Breathing' : 'Start Zen Mode'}</button>
        </div>
    );
}

// ---------------------------------------------------------
// 3. ROCK PAPER SCISSORS
// ---------------------------------------------------------
function RPSGame() {
    const [result, setResult] = useState('Make your move!');
    const [scores, setScores] = useState({ p: 0, c: 0 });
    const choices = ['👊', '✋', '✌️'];

    const play = (pIndex) => {
        const cIndex = Math.floor(Math.random() * 3);
        const pChoice = choices[pIndex];
        const cChoice = choices[cIndex];

        if(pIndex === cIndex) setResult(`Tie! Both chose ${pChoice}`);
        else if (
            (pIndex === 0 && cIndex === 2) ||
            (pIndex === 1 && cIndex === 0) ||
            (pIndex === 2 && cIndex === 1)
        ) {
            setResult(`You won! ${pChoice} beats ${cChoice}`);
            setScores(s => ({ ...s, p: s.p + 1 }));
        } else {
            setResult(`You lost! ${cChoice} beats ${pChoice}`);
            setScores(s => ({ ...s, c: s.c + 1 }));
        }
    }

    return (
        <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '3rem', width: '100%', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{scores.p}</div><div>You</div></div>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '2rem', fontWeight: 200 }}>-</div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>{scores.c}</div><div>AI</div></div>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', minHeight: '30px' }}>{result}</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
                {choices.map((emoji, i) => (
                    <motion.button key={i} whileHover={{ scale: 1.1, translateY: -5 }} whileTap={{ scale: 0.9 }} onClick={() => play(i)} style={{ border: 'none', background: 'rgba(255,255,255,0.7)', fontSize: '3rem', padding: '1.5rem', borderRadius: '20px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>{emoji}</motion.button>
                ))}
            </div>
            <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={() => { setScores({p:0, c:0}); setResult('Make your move!'); }}>Reset Score</button>
        </div>
    );
}

// ---------------------------------------------------------
// 4. REACTION TEST
// ---------------------------------------------------------
function ReactionTest() {
    const [state, setState] = useState('waiting'); // waiting, ready, active, done
    const [startTime, setStartTime] = useState(0);
    const [resultMs, setResultMs] = useState(null);
    const timeoutRef = useRef(null);

    const handleClick = () => {
        if(state === 'waiting' || state === 'done') {
            setState('ready');
            setResultMs(null);
            timeoutRef.current = setTimeout(() => {
                setState('active');
                setStartTime(Date.now());
            }, 1000 + Math.random() * 3000);
        } else if (state === 'ready') {
            clearTimeout(timeoutRef.current);
            setState('waiting');
            setResultMs('Too early! Wait for Green.');
        } else if (state === 'active') {
            setResultMs(`${Date.now() - startTime}ms`);
            setState('done');
        }
    };

    const getBg = () => {
        if(state === 'ready') return 'var(--danger)'; // Red implies wait
        if(state === 'active') return 'var(--success)';
        return 'var(--primary)';
    };

    return (
        <motion.div className="glass-panel" onClick={handleClick} style={{ padding: '6rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: getBg(), color: 'white', cursor: 'pointer', borderRadius: '20px', transition: 'background 0.1s', minHeight: '300px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                {state === 'waiting' ? 'Click to Start' : state === 'ready' ? 'Wait for Green...' : state === 'active' ? 'CLICK!!' : 'Reaction Time'}
            </h2>
            {resultMs && <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{resultMs}</div>}
            {state === 'waiting' || state === 'done' ? <p style={{ opacity: 0.8, marginTop: '2rem' }}>Click anywhere to try again.</p> : null}
        </motion.div>
    );
}

// ---------------------------------------------------------
// 5. MEMORY MATCH
// ---------------------------------------------------------
function MemoryMatch() {
    const emojis = ['🐶','🐱','🐭','🐹','🦊','🐻','🐼','🐨'];
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState(new Set());
    
    useEffect(() => { init(); }, []);

    const init = () => {
        const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
        setCards(deck);
        setFlipped([]);
        setMatched(new Set());
    };

    const handleFlip = (i) => {
        if(flipped.includes(i) || matched.has(i) || flipped.length >= 2) return;
        const newFlipped = [...flipped, i];
        setFlipped(newFlipped);
        if(newFlipped.length === 2) {
            setTimeout(() => {
                if(cards[newFlipped[0]] === cards[newFlipped[1]]) {
                    const newMatched = new Set(matched);
                    newMatched.add(newFlipped[0]);
                    newMatched.add(newFlipped[1]);
                    setMatched(newMatched);
                }
                setFlipped([]);
            }, 800);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '350px' }}>
               <h3 style={{ color: 'var(--primary)' }}>Pairs: {matched.size / 2} / 8</h3>
               <button onClick={init} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>Restart</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', width: '100%', maxWidth: '400px' }}>
                {cards.map((card, i) => {
                    const isVisible = flipped.includes(i) || matched.has(i);
                    return (
                        <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleFlip(i)} style={{ background: isVisible ? 'white' : 'var(--primary)', height: '80px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            {isVisible ? card : ''}
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// 6. CHESS GAME
// ---------------------------------------------------------
function ChessGame() {
    const [game, setGame] = useState(new Chess());
    const [difficulty, setDifficulty] = useState('easy');

    const makeRandomMove = useCallback(() => {
        const possibleMoves = game.moves();
        if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        const g = new Chess(game.fen());
        g.move(possibleMoves[randomIndex]);
        setGame(g);
    }, [game]);

    const onDrop = (sourceSquare, targetSquare) => {
        try {
            const g = new Chess(game.fen());
            const move = g.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q', // always promote to queen for simplicity
            });

            if (move === null) return false;
            setGame(g);
            setTimeout(makeRandomMove, 300);
            return true;
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>You vs Bot</h3>
                <button className="btn-secondary" onClick={() => setGame(new Chess())}>Restart Match</button>
            </div>
            
            {game.isGameOver() && (
                <div style={{ color: 'var(--danger)', fontWeight: 'bold' }}>
                    Game Over! {game.isDraw() ? 'Draw' : game.turn() === 'w' ? 'Black Wins' : 'White Wins'}
                </div>
            )}
            
            <div style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={400} />
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// 7. LUCKY CARDS (Higher / Lower)
// ---------------------------------------------------------
function LuckyCardsGame() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    const getRandomCard = () => {
        const v = Math.floor(Math.random() * values.length);
        const s = Math.floor(Math.random() * suits.length);
        return { valStr: values[v], valNum: v, suit: suits[s], color: (suits[s] === '♥' || suits[s] === '♦') ? 'red' : 'black' };
    };

    const [currentCard, setCurrentCard] = useState(getRandomCard());
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState('Will the next card be higher or lower?');
    const [gameOver, setGameOver] = useState(false);

    const guess = (isHigher) => {
        if(gameOver) return;
        const nextCard = getRandomCard();
        
        if(nextCard.valNum === currentCard.valNum) {
            setStatus(`It's a tie (${nextCard.valStr}${nextCard.suit})! You survive.`);
        } else if ((isHigher && nextCard.valNum > currentCard.valNum) || (!isHigher && nextCard.valNum < currentCard.valNum)) {
            setScore(s => s + 1);
            setStatus(`Correct! It was ${nextCard.valStr}${nextCard.suit}`);
        } else {
            setStatus(`Wrong! It was ${nextCard.valStr}${nextCard.suit}. Game Over!`);
            setGameOver(true);
        }
        setCurrentCard(nextCard);
    };

    return (
        <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Streak: <span style={{ color: 'var(--primary)' }}>{score}</span></h2>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{status}</div>
            
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} key={currentCard.valStr+currentCard.suit} style={{ width: '150px', height: '220px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '1.5rem', color: currentCard.color, alignSelf: 'flex-start', fontWeight: 'bold' }}>{currentCard.valStr}</div>
                <div style={{ fontSize: '4rem', color: currentCard.color, alignSelf: 'center' }}>{currentCard.suit}</div>
                <div style={{ fontSize: '1.5rem', color: currentCard.color, alignSelf: 'flex-end', fontWeight: 'bold' }}>{currentCard.valStr}</div>
            </motion.div>

            {gameOver ? (
                <button className="btn-primary" onClick={() => { setGameOver(false); setScore(0); setCurrentCard(getRandomCard()); setStatus('Will the next card be higher or lower?'); }}>Play Again</button>
            ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={() => guess(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem' }}>▼ Lower</button>
                    <button className="btn-primary" onClick={() => guess(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem' }}>▲ Higher</button>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------
// 8. SUDOKU GAME
// ---------------------------------------------------------
function SudokuGame() {
    const [board, setBoard] = useState(Array(81).fill(''));
    
    useEffect(() => {
        const b = Array(81).fill('');
        // generate some dummy puzzle details for visual flair
        for(let i=0; i<25; i++) b[Math.floor(Math.random()*81)] = Math.floor(Math.random()*9)+1;
        setBoard(b);
    }, []);

    return (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>Sudoku Challenge</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, minmax(30px, 40px))', gap: '2px', background: 'var(--primary)', padding: '3px', borderRadius: '4px', border: '3px solid var(--primary)' }}>
                {board.map((val, i) => {
                    const isThickRight = (i % 9) === 2 || (i % 9) === 5;
                    const isThickBottom = Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5;
                    return (
                        <input key={i} maxLength={1} defaultValue={val} style={{ 
                            width: '100%', height: '40px', textAlign: 'center', fontSize: '1.2rem', 
                            border: 'none', borderRadius: 0, margin: 0, backgroundColor: ((Math.floor((i%9)/3) + Math.floor((i/27))) % 2 === 0) ? '#ffffff' : '#f8fafc',
                            fontWeight: val ? 'bold' : 'normal', color: val ? 'var(--primary)' : 'var(--text-main)',
                            borderRight: isThickRight ? '2px solid var(--primary)' : 'none',
                            borderBottom: isThickBottom ? '2px solid var(--primary)' : 'none',
                            padding: 0
                        }} />
                    )
                })}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill the 9x9 grid so every row, column, and 3x3 box contains digits 1-9.</p>
        </div>
    );
}

// ---------------------------------------------------------
// 9. QUICK LUDO GAME
// ---------------------------------------------------------
function QuickLudoGame() {
    const [positions, setPositions] = useState([0, 0, 0, 0]); // Red, Green, Yellow, Blue
    const [turn, setTurn] = useState(0);
    const [dice, setDice] = useState(1);
    const colors = ['#ef4444', '#10b981', '#eab308', '#3b82f6'];
    const names = ['You (Red)', 'Bot (Green)', 'Bot (Yellow)', 'Bot (Blue)'];
    const [winner, setWinner] = useState(null);

    const rollDice = () => {
        if (winner !== null || turn !== 0) return;
        const d = Math.floor(Math.random() * 6) + 1;
        setDice(d);
        movePlayer(0, d);
    };

    const movePlayer = (playerIndex, steps) => {
        setPositions(prev => {
            const newPos = [...prev];
            newPos[playerIndex] += steps;
            if (newPos[playerIndex] >= 20) {
                setWinner(playerIndex);
                newPos[playerIndex] = 20;
            }
            return newPos;
        });
        if (playerIndex === 0) {
           setTimeout(() => botTurn(1), 800);
        }
    };

    const botTurn = (index) => {
        if (winner !== null) return;
        setTurn(index);
        const d = Math.floor(Math.random() * 6) + 1;
        setDice(d);
        setPositions(prev => {
            const newPos = [...prev];
            newPos[index] += d;
            if (newPos[index] >= 20) {
                setWinner(index);
                newPos[index] = 20;
            }
            return newPos;
        });
        
        // if no winner yet, continue bots or return to user
        setWinner(prevWinner => {
            if (prevWinner === null) {
                if (index < 3) setTimeout(() => botTurn(index + 1), 800);
                else setTimeout(() => setTurn(0), 800);
            }
            return prevWinner;
        });
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>Quick Ludo Race</h3>
            <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'space-between', marginTop: '1rem' }}>
                {positions.map((pos, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: colors[i] }}>{names[i]}</span>
                        <div style={{ height: '180px', width: '40px', background: 'rgba(0,0,0,0.05)', borderRadius: '20px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.1)' }}>
                            <motion.div initial={{ height: 0 }} animate={{ height: `${Math.min(100, (pos/20)*100)}%` }} transition={{ type: 'spring', stiffness: 100 }} style={{ position: 'absolute', bottom: 0, width: '100%', background: `linear-gradient(to top, ${colors[i]}, white)`, borderRadius: '15px 15px 0 0' }} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)' }}>{pos}/20</span>
                    </div>
                ))}
            </div>
            
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {winner !== null ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: colors[winner], fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>{names[winner]} Wins!</motion.div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '2px solid var(--primary)' }}>{dice}</div>
                        <button className={turn === 0 ? "btn-primary" : "btn-secondary"} onClick={rollDice} disabled={turn !== 0} style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>{turn === 0 ? "Roll Dice!" : "Bot Thinking..."}</button>
                    </div>
                )}
                {winner !== null && <button className="btn-secondary" onClick={() => {setPositions([0,0,0,0]); setWinner(null); setTurn(0);}} style={{ padding: '0.8rem 2rem' }}>Play Again</button>}
            </div>
        </div>
    );
}

export { TicTacToeGame, BreathingZone, RPSGame, ReactionTest, MemoryMatch, ChessGame, LuckyCardsGame, SudokuGame, QuickLudoGame };
