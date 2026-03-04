/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Hand as HandIcon, 
  Cpu, 
  Info,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { CardData, GameStatus, Turn, Suit } from './types';
import { createDeck, SUIT_SYMBOLS, SUIT_COLORS, SUITS, SUIT_NAMES_ZH } from './constants';

// --- Components ---

// --- Components ---

const PlayerAvatar = ({ 
  type, 
  playedCount, 
  remainingCount, 
  isTurn 
}: { 
  type: 'player' | 'ai'; 
  playedCount: number; 
  remainingCount: number;
  isTurn: boolean;
}) => {
  const isAI = type === 'ai';
  
  return (
    <div className={`relative flex flex-col items-center group ${isTurn ? 'scale-110' : 'opacity-80'} transition-all duration-300`}>
      {/* Card Back Background */}
      <div className={`
        w-16 h-24 sm:w-20 sm:h-28 rounded-xl border-2 card-shadow overflow-hidden relative flex flex-col items-center justify-center
        ${isAI ? 'bg-rose-900 border-rose-400/50' : 'bg-blue-900 border-blue-400/50'}
        ${isTurn ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-emerald-900' : ''}
      `}>
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="absolute inset-2 border border-white/10 rounded-lg flex items-center justify-center">
          <div className="text-white/5 text-4xl font-bold select-none">GG</div>
        </div>

        {/* Avatar Icon */}
        <div className={`mb-1 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-inner`}>
          {isAI ? <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-rose-300" /> : <HandIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />}
        </div>

        {/* Stats Overlay */}
        <div className="flex flex-col items-center text-white">
          <div className="flex flex-col items-center leading-tight">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-tighter opacity-70">已出</span>
            <span className="text-sm sm:text-lg font-black">{playedCount}</span>
          </div>
          <div className="w-8 h-px bg-white/20 my-1" />
          <div className="flex flex-col items-center leading-tight">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-tighter opacity-70">剩余</span>
            <span className="text-sm sm:text-lg font-black">{remainingCount}</span>
          </div>
        </div>
      </div>
      
      {/* Label */}
      <div className={`mt-2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm
        ${isAI ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}
      `}>
        {isAI ? '对家 (AI)' : '我 (玩家)'}
      </div>

      {/* Turn Indicator Dot */}
      {isTurn && (
        <motion.div 
          layoutId="turn-indicator"
          className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-900"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-2 h-2 bg-emerald-900 rounded-full" />
        </motion.div>
      )}
    </div>
  );
};

interface CardProps {
  card?: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  key?: React.Key;
}

const Card = ({ 
  card, 
  isFaceUp = true, 
  onClick, 
  isPlayable = false,
  className = "",
  style = {}
}: CardProps) => {
  if (!isFaceUp || !card) {
    return (
      <motion.div
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={style}
        className={`w-16 h-24 sm:w-24 sm:h-36 bg-blue-800 rounded-lg border-2 border-white/20 flex items-center justify-center card-shadow relative overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="w-10 h-16 sm:w-16 sm:h-24 border border-white/10 rounded flex items-center justify-center">
          <div className="text-white/20 text-4xl font-bold">GG</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      style={style}
      className={`
        w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-lg border border-slate-200 flex flex-col p-1 sm:p-2 card-shadow relative cursor-default overflow-hidden
        ${isPlayable ? 'cursor-pointer ring-2 ring-yellow-400 ring-offset-2 ring-offset-emerald-900' : ''}
        ${className}
      `}
    >
      {/* Nezha Image Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=300&q=80" 
          alt="Nezha" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className={`text-xs sm:text-lg font-bold leading-none z-10 ${SUIT_COLORS[card.suit]}`}>
        {card.rank}
      </div>
      <div className={`text-xs sm:text-lg leading-none z-10 ${SUIT_COLORS[card.suit]}`}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      
      <div className={`absolute inset-0 flex items-center justify-center text-2xl sm:text-5xl opacity-40 z-0 ${SUIT_COLORS[card.suit]}`}>
        {SUIT_SYMBOLS[card.suit]}
      </div>

      <div className={`absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-xs sm:text-lg font-bold leading-none rotate-180 z-10 ${SUIT_COLORS[card.suit]}`}>
        <div className="flex flex-col items-end">
          <span>{card.rank}</span>
          <span>{SUIT_SYMBOLS[card.suit]}</span>
        </div>
      </div>
    </motion.div>
  );
};

const SuitPicker = ({ onSelect }: { onSelect: (suit: Suit) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-slate-900 p-8 rounded-3xl border border-white/10 shadow-2xl max-w-sm w-full">
        <h2 className="text-2xl font-display font-bold text-center mb-6 text-white">选择花色</h2>
        <div className="grid grid-cols-2 gap-4">
          {SUITS.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            >
              <span className={`text-5xl mb-2 group-hover:scale-110 transition-transform ${SUIT_COLORS[suit]}`}>
                {SUIT_SYMBOLS[suit]}
              </span>
              <span className="text-xs uppercase tracking-widest text-white/60">{SUIT_NAMES_ZH[suit]}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [aiHand, setAiHand] = useState<CardData[]>([]);
  const [discardPile, setDiscardPile] = useState<CardData[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Turn>('player');
  const [activeSuit, setActiveSuit] = useState<Suit | null>(null);
  const [status, setStatus] = useState<GameStatus>('waiting');
  const [showSuitPicker, setShowSuitPicker] = useState(false);
  const [pendingCard, setPendingCard] = useState<CardData | null>(null);
  const [message, setMessage] = useState("欢迎来到 GG 疯狂 8 点！");
  const [playerPlayCount, setPlayerPlayCount] = useState(0);
  const [aiPlayCount, setAiPlayCount] = useState(0);

  const initGame = () => {
    const newDeck = createDeck();
    const pHand = newDeck.splice(0, 8);
    const aHand = newDeck.splice(0, 8);
    
    // Find a non-8 card for the start
    let firstCardIndex = 0;
    while (newDeck[firstCardIndex].rank === '8') {
      firstCardIndex++;
    }
    const firstCard = newDeck.splice(firstCardIndex, 1)[0];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstCard]);
    setActiveSuit(firstCard.suit);
    setCurrentTurn('player');
    setStatus('playing');
    setMessage("轮到你了！匹配花色或点数。");
    setPlayerPlayCount(0);
    setAiPlayCount(0);
  };

  const isPlayable = (card: CardData) => {
    if (status !== 'playing') return false;
    const topCard = discardPile[discardPile.length - 1];
    if (card.rank === '8') return true;
    return card.suit === activeSuit || card.rank === topCard.rank;
  };

  const playCard = (card: CardData, isPlayer: boolean) => {
    const newHand = isPlayer 
      ? playerHand.filter(c => c.id !== card.id)
      : aiHand.filter(c => c.id !== card.id);

    if (isPlayer) {
      setPlayerHand(newHand);
      setPlayerPlayCount(prev => prev + 1);
    } else {
      setAiHand(newHand);
      setAiPlayCount(prev => prev + 1);
    }

    setDiscardPile(prev => [...prev, card]);
    
    if (card.rank === '8') {
      if (isPlayer) {
        setPendingCard(card);
        setShowSuitPicker(true);
        setMessage("万能 8！请选择一个新花色。");
      } else {
        // AI picks most frequent suit in hand
        const suitsInHand = newHand.map(c => c.suit);
        const mostFrequentSuit = SUITS.reduce((a, b) => 
          suitsInHand.filter(s => s === a).length >= suitsInHand.filter(s => s === b).length ? a : b
        );
        setActiveSuit(mostFrequentSuit);
        setMessage(`AI 打出了 8 并选择了 ${SUIT_NAMES_ZH[mostFrequentSuit]}！`);
        checkWin(newHand, false);
        setCurrentTurn('player');
      }
    } else {
      setActiveSuit(card.suit);
      checkWin(newHand, isPlayer);
      if (status === 'playing') {
        setCurrentTurn(isPlayer ? 'ai' : 'player');
        setMessage(isPlayer ? "AI 正在思考..." : "轮到你了！");
      }
    }
  };

  const checkWin = (hand: CardData[], isPlayer: boolean) => {
    if (hand.length === 0) {
      setStatus(isPlayer ? 'player_won' : 'ai_won');
      setMessage(isPlayer ? "恭喜！你赢了！" : "AI 赢了！下次好运。");
    }
  };

  const drawCard = (isPlayer: boolean) => {
    if (deck.length === 0) {
      setMessage("摸牌堆已空！跳过回合。");
      setCurrentTurn(isPlayer ? 'ai' : 'player');
      return;
    }

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setDeck(newDeck);

    if (isPlayer) {
      setPlayerHand(prev => [...prev, card]);
      setMessage("你摸了一张牌。");
      // In Crazy 8s, usually drawing ends your turn if you can't play it, 
      // or you can play it immediately. Let's make it end the turn for simplicity.
      setCurrentTurn('ai');
    } else {
      setAiHand(prev => [...prev, card]);
      setMessage("AI 摸了一张牌。");
      setCurrentTurn('player');
    }
  };

  const handleSuitSelect = (suit: Suit) => {
    setActiveSuit(suit);
    setShowSuitPicker(false);
    setPendingCard(null);
    checkWin(playerHand, true);
    if (status === 'playing') {
      setCurrentTurn('ai');
      setMessage(`你选择了 ${SUIT_NAMES_ZH[suit]}。轮到 AI 了...`);
    }
  };

  // AI Logic
  useEffect(() => {
    if (currentTurn === 'ai' && status === 'playing') {
      const timer = setTimeout(() => {
        const playableCards = aiHand.filter(isPlayable);
        if (playableCards.length > 0) {
          // AI Strategy: Play non-8s first, then 8s
          const nonEight = playableCards.find(c => c.rank !== '8');
          playCard(nonEight || playableCards[0], false);
        } else {
          drawCard(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, status, aiHand]);

  const topCard = discardPile[discardPile.length - 1];

  return (
    <div className="h-screen w-full flex flex-col felt-texture font-sans">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Trophy className="text-emerald-900 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight text-white">GG 疯狂 8 点</h1>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">标准规则 • 万能 8 点</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={initGame}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-white/60 hover:text-white group"
            title="重新开始"
          >
            <RotateCcw className="w-6 h-6 group-hover:rotate-[-180deg] transition-transform duration-500" />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 relative flex flex-col items-center justify-between p-4 sm:p-8">
        {status === 'waiting' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md"
            >
              <div className="mb-8 inline-flex p-4 bg-yellow-500/10 rounded-3xl border border-yellow-500/20">
                <Trophy className="w-16 h-16 text-yellow-500" />
              </div>
              <h2 className="text-5xl font-display font-bold text-white mb-4">准备好开始了吗？</h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                匹配弃牌堆顶牌的花色或点数。记住，8 是万能牌，可以随时打出！
              </p>
              <button 
                onClick={initGame}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-emerald-950 font-bold rounded-2xl shadow-xl shadow-yellow-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
              >
                开始新游戏 <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* AI Hand Section with Avatars on sides */}
            <div className="w-full flex items-center justify-center gap-4 sm:gap-12 lg:gap-24">
              <PlayerAvatar 
                type="ai" 
                playedCount={aiPlayCount} 
                remainingCount={aiHand.length} 
                isTurn={currentTurn === 'ai'} 
              />
              
              <div className="flex -space-x-8 sm:-space-x-12">
                {aiHand.map((_, i) => (
                  <Card key={`ai-${i}`} isFaceUp={false} className="rotate-180" />
                ))}
              </div>

              <PlayerAvatar 
                type="player" 
                playedCount={playerPlayCount} 
                remainingCount={playerHand.length} 
                isTurn={currentTurn === 'player'} 
              />
            </div>

            {/* Center Area */}
            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16 my-4">
              {/* Draw Pile */}
              <div className="flex flex-col items-center gap-2">
                <div 
                  onClick={() => currentTurn === 'player' && drawCard(true)}
                  className={`relative group ${currentTurn === 'player' ? 'cursor-pointer' : 'opacity-50'}`}
                >
                  <Card isFaceUp={false} className="group-hover:translate-y-[-4px] transition-transform" />
                  <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {deck.length}
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">摸牌堆</span>
              </div>

              {/* Discard Pile */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {discardPile.slice(-3).map((card, i) => (
                    <Card 
                      key={card.id} 
                      card={card} 
                      className={`absolute inset-0 ${i === 2 ? 'relative' : ''}`}
                      style={{ 
                        transform: `rotate(${(i - 1) * 5}deg) translate(${(i - 1) * 4}px, ${(i - 1) * 4}px)`,
                        zIndex: i 
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">弃牌堆</span>
                  {activeSuit && (
                    <div className={`flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded border border-white/10 ${SUIT_COLORS[activeSuit]}`}>
                      <span className="text-xs">{SUIT_SYMBOLS[activeSuit]}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Player Hand */}
            <div className="w-full max-w-5xl flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                <AnimatePresence>
                  {playerHand.map((card) => (
                    <Card 
                      key={card.id} 
                      card={card} 
                      isPlayable={currentTurn === 'player' && isPlayable(card)}
                      onClick={() => playCard(card, true)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="p-4 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/80">
          {status === 'playing' ? (
            currentTurn === 'player' ? <HandIcon className="w-5 h-5 text-blue-400 animate-pulse" /> : <Cpu className="w-5 h-5 text-red-400 animate-pulse" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          )}
          <span className="text-sm font-medium tracking-wide">{message}</span>
        </div>
      </footer>

      {/* Modals */}
      {showSuitPicker && <SuitPicker onSelect={handleSuitSelect} />}
      
      {(status === 'player_won' || status === 'ai_won') && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <div className="bg-slate-900 p-12 rounded-[40px] border border-white/10 shadow-2xl max-w-md w-full text-center">
            <div className={`mb-8 inline-flex p-6 rounded-full ${status === 'player_won' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
              <Trophy className="w-20 h-20" />
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              {status === 'player_won' ? '胜利！' : '失败！'}
            </h2>
            <p className="text-white/60 mb-10 text-lg">
              {status === 'player_won' 
                ? '你率先清空了所有手牌。打得太棒了！' 
                : '这次 AI 更快一步。想再来一局吗？'}
            </p>
            <button 
              onClick={initGame}
              className="w-full py-5 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-slate-100 transition-all active:scale-95 text-lg"
            >
              再玩一次
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
