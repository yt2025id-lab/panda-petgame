"use client"
import React, { useState, useEffect, useCallback } from 'react';
// Hooks
import useWallet from './hooks/useWallet';
import useGameState from './hooks/useGameState';
import useQueryPandasEvm from './hooks/evm/useQueryPandasEvm';
import useQueryCosmeticsEvm from './hooks/evm/useQueryCosmeticsEvm';
import useEquipCosmeticEvm from './hooks/evm/useEquipCosmeticEvm';
import useUnequipCosmeticEvm from './hooks/evm/useUnequipCosmeticEvm';
import useIDRXBalance from './hooks/evm/useIDRXBalance';
import useIDRXFaucet from './hooks/evm/useIDRXFaucet';
import useLeaderboard from './hooks/evm/useLeaderboard';
import useAchievements from './hooks/evm/useAchievements';
import useBaseName from './hooks/evm/useBaseName';
// Components
import { FoodItem, ToyItem } from './components/type';
import { FOOD_ITEMS } from './components/constant';
import LandingPage from './components/LandingPage';
import ConnectWallet from './components/ConnectWallet';
import GameHeader from './components/GameHeader';
import BottomNav, { MenuType } from './components/BottomNav';
import ProfileModal from './components/ProfileModal';
import LeaderboardModal from './components/LeaderboardModal';
import AchievementsModal from './components/AchievementsModal';
import IDRXWallet from './components/IDRXWallet';
import SocialModal from './components/SocialModal';
import Panda from './components/Panda';
import CreatePandaInitializer from './components/CreatePandaInitializer';
import CreateCosmeticInitializer from './components/CreateCosmeticInitializer';
import BallShooter from './components/minigames/BallShooter';
import BambooCatcher from './components/minigames/BambooCatcher';
import DinoJump from './components/minigames/DinoJump';
import MemoryMatch from './components/minigames/MemoryMatch';
import BambooSlice from './components/minigames/BambooSlice';

type MinigameType = 'NONE' | 'BALLSHOOTER' | 'BAMBOOCATCHER' | 'DINOJUMP' | 'MEMORYMATCH' | 'BAMBOOSLICE';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const { evmAccount, isConnecting, connectWallet, disconnect } = useWallet();
  const gameState = useGameState();

  // Blockchain state
  const [hasCreatedPanda, setHasCreatedPanda] = useState(false);
  const [pandaName, setPandaName] = useState<string | null>(null);
  const [showCosmeticMinter, setShowCosmeticMinter] = useState(false);

  // EVM hooks
  const { pandas: ownedPandas, isLoading: isLoadingPandas } = useQueryPandasEvm(evmAccount);
  const { cosmetics: ownedCosmetics } = useQueryCosmeticsEvm(evmAccount);
  const { equipCosmetic } = useEquipCosmeticEvm();
  const { unequipCosmetic } = useUnequipCosmeticEvm();
  const [isEquipping, setIsEquipping] = useState(false);
  const [isUnequipping, setIsUnequipping] = useState(false);

  // New feature hooks
  const { balance: idrxBalance, canClaim: canClaimFaucet, refetch: refetchIDRX } = useIDRXBalance(evmAccount);
  const { claimFaucet, isClaiming: isClaimingFaucet } = useIDRXFaucet();
  const { topPlayers, playerStats, isLoading: isLoadingLeaderboard, submitScore } = useLeaderboard(evmAccount);
  const { achievements, isLoading: isLoadingAchievements, isClaiming: isClaimingAchievement, claimAchievement } = useAchievements(evmAccount);
  const { baseName } = useBaseName(evmAccount);

  // UI state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [draggedFood, setDraggedFood] = useState<FoodItem | null>(null);
  const [draggedToy, setDraggedToy] = useState<ToyItem | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuType>('NONE');
  const [equippedCosmeticId, setEquippedCosmeticId] = useState<string | null>(null);
  const [activeMinigame, setActiveMinigame] = useState<MinigameType>('NONE');

  // Check if user has created a Panda
  useEffect(() => {
    if (!isLoadingPandas && ownedPandas.length > 0) {
      setHasCreatedPanda(true);
      if (!pandaName && ownedPandas[0]) {
        setPandaName(ownedPandas[0].fields.name);
      }
    }
  }, [ownedPandas, isLoadingPandas, pandaName]);

  // Follow cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEquipCosmetic = useCallback(async (cosmeticId: string) => {
    if (!ownedPandas || ownedPandas.length === 0) {
      gameState.handlePandaTalk("You need a panda first!");
      return;
    }

    if (equippedCosmeticId === cosmeticId) {
      try {
        const cosmeticToRemove = ownedCosmetics.find(c => c.objectId === cosmeticId);
        if (!cosmeticToRemove || !evmAccount) return;
        setIsUnequipping(true);
        await unequipCosmetic({
          pandaId: ownedPandas[0].objectId,
          category: cosmeticToRemove.fields.category,
          recipient: evmAccount,
        });
        setEquippedCosmeticId(null);
        gameState.handlePandaTalk("I took off my cosmetic.");
        setIsUnequipping(false);
      } catch (error) {
        console.error("Error unequipping cosmetic:", error);
        setIsUnequipping(false);
      }
      return;
    }

    try {
      setIsEquipping(true);
      await equipCosmetic({ pandaId: ownedPandas[0].objectId, cosmeticId });
      setEquippedCosmeticId(cosmeticId);
      gameState.handlePandaTalk("I love my new cosmetic! ✨");
      setIsEquipping(false);
    } catch (error) {
      console.error("Error equipping cosmetic:", error);
      setIsEquipping(false);
    }
  }, [equippedCosmeticId, ownedPandas, ownedCosmetics, evmAccount, equipCosmetic, unequipCosmetic, gameState]);

  const handleMinigameEnd = useCallback((score: number, xpEarned: number, coinsEarned: number) => {
    gameState.addXP(xpEarned);
    gameState.setCoins(prev => prev + coinsEarned);
    setActiveMinigame('NONE');
    gameState.handlePandaTalk(`Awesome game! Earned ${xpEarned} XP and ${coinsEarned} coins! 🎉`);
    gameState.updateMissionProgress('play', score);
    // Submit score to leaderboard
    if (score > 0) {
      submitScore(score);
    }
  }, [gameState, submitScore]);

  const handleClaimFaucet = useCallback(async () => {
    try {
      await claimFaucet();
      refetchIDRX();
      gameState.handlePandaTalk("Got 10,000 IDRX from the faucet! 💎");
    } catch (error) {
      console.error("Faucet error:", error);
      gameState.handlePandaTalk("Failed to claim IDRX...");
    }
  }, [claimFaucet, refetchIDRX, gameState]);

  const handleClaimAchievement = useCallback(async (achievementId: number) => {
    try {
      await claimAchievement(achievementId);
      gameState.handlePandaTalk("Achievement unlocked! 🏅");
    } catch (error) {
      console.error("Achievement error:", error);
      gameState.handlePandaTalk("Failed to claim achievement...");
    }
  }, [claimAchievement, gameState]);

  const handleDropItem = () => {
    if (draggedFood) gameState.feedPet(draggedFood);
    else if (draggedToy) gameState.playWithToy(draggedToy);
  };

  // ==========================================
  // LANDING PAGE
  // ==========================================
  if (showLanding && !evmAccount) {
    return <LandingPage onPlayNow={() => setShowLanding(false)} />;
  }

  // ==========================================
  // CONNECT WALLET SCREEN
  // ==========================================
  if (!evmAccount) {
    return (
      <ConnectWallet
        isConnecting={isConnecting}
        onConnect={connectWallet}
        onBack={() => setShowLanding(true)}
      />
    );
  }

  return (
    <>
      <div className={`fixed inset-0 transition-colors duration-1000 ${gameState.isSleeping ? 'bg-[#0f0c29]' : 'bg-[#e0f7fa]'} flex flex-col overflow-hidden select-none`}>

        {/* Cosmetic Minter Modal */}
        {showCosmeticMinter && (
          <CreateCosmeticInitializer
            onSuccess={() => setShowCosmeticMinter(false)}
            coins={gameState.coins}
            onSpendCoins={(amount) => gameState.setCoins(prev => Math.max(0, prev - amount))}
          />
        )}

        {/* Minigame Modals */}
        {activeMinigame === 'BALLSHOOTER' && (
          <BallShooter onClose={() => setActiveMinigame('NONE')} onGameEnd={handleMinigameEnd} />
        )}
        {activeMinigame === 'BAMBOOCATCHER' && (
          <BambooCatcher onClose={() => setActiveMinigame('NONE')} onGameEnd={handleMinigameEnd} />
        )}
        {activeMinigame === 'DINOJUMP' && (
          <DinoJump onClose={() => setActiveMinigame('NONE')} onGameEnd={handleMinigameEnd} />
        )}
        {activeMinigame === 'MEMORYMATCH' && (
          <MemoryMatch onClose={() => setActiveMinigame('NONE')} onGameEnd={handleMinigameEnd} />
        )}
        {activeMinigame === 'BAMBOOSLICE' && (
          <BambooSlice onClose={() => setActiveMinigame('NONE')} onGameEnd={handleMinigameEnd} />
        )}

        {/* Panda Initialization Screen */}
        {!hasCreatedPanda && !isLoadingPandas && (
          <CreatePandaInitializer onSuccess={() => setHasCreatedPanda(true)} evmAccount={evmAccount} />
        )}

        {/* Loading Screen */}
        {isLoadingPandas && !hasCreatedPanda && (
          <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center z-50">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🐼</div>
              <p className="text-2xl font-bold text-gray-800">Loading your Panda...</p>
            </div>
          </div>
        )}

        {/* Game Content */}
        {hasCreatedPanda && (
          <>
            <GameHeader
              stats={gameState.stats}
              coins={gameState.coins}
              evmAccount={evmAccount}
              idrxBalance={Number(idrxBalance) > 0 ? Number(idrxBalance).toLocaleString() : undefined}
              baseName={baseName}
              onCoinsClick={() => setActiveMenu(activeMenu === 'COINS' ? 'NONE' : 'COINS')}
              onDisconnect={disconnect}
            />

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
              {gameState.messages.length > 0 && activeMenu === 'NONE' && (
                <div className="absolute top-20 bg-white border-4 border-gray-800 p-4 rounded-3xl max-w-xs shadow-xl animate-in fade-in slide-in-from-bottom-4 z-20">
                  <p className="font-bold text-gray-800">{gameState.messages[0].text}</p>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-gray-800" />
                </div>
              )}

              <div className="transition-opacity">
                <Panda
                  stats={gameState.stats}
                  isSleeping={gameState.isSleeping}
                  isEating={gameState.isEating}
                  isWashing={gameState.isWashing}
                  mousePos={mousePos}
                  equippedCosmeticId={equippedCosmeticId}
                  equippedCosmetic={ownedCosmetics.find(c => c.objectId === equippedCosmeticId)}
                  onClick={() => !gameState.isSleeping && gameState.handlePandaTalk("Ouch! That tickles!")}
                  onPet={gameState.handlePetting}
                  onDropItem={handleDropItem}
                />
              </div>

              {/* Kitchen Tray Overlay */}
              {activeMenu === 'KITCHEN' && !gameState.isSleeping && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-full duration-300 z-30 w-full max-w-sm px-4">
                  <div className="text-[10px] font-black bg-orange-500 text-white px-4 py-1 rounded-full uppercase tracking-tighter shadow-lg mb-[-10px] z-10 border-2 border-white">
                    Drag food to panda!
                  </div>
                  <div className="flex gap-4 p-5 bg-white border-8 border-gray-800 rounded-[2.5rem] shadow-[0_12px_0_#2d2d2d] overflow-x-auto w-full no-scrollbar">
                    {FOOD_ITEMS.map(food => (
                      <div
                        key={food.id}
                        draggable
                        onDragStart={() => { setDraggedFood(food); setDraggedToy(null); }}
                        onDragEnd={() => setDraggedFood(null)}
                        onClick={() => gameState.feedPet(food)}
                        className="flex-shrink-0 bg-orange-50 border-4 border-gray-800 p-3 rounded-2xl hover:bg-orange-100 transition-all cursor-grab active:cursor-grabbing hover:-translate-y-2 active:scale-95 shadow-[4px_4px_0px_#2d2d2d] flex flex-col items-center"
                      >
                        <div className="text-4xl">{food.emoji}</div>
                        <div className="text-xs font-black mt-2 text-gray-800">${food.cost}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Play Menu - Minigames */}
              {activeMenu === 'PLAY' && !gameState.isSleeping && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-full duration-300 z-30 w-full max-w-sm px-4">
                  <div className="text-[10px] font-black bg-blue-500 text-white px-4 py-1 rounded-full uppercase tracking-tighter shadow-lg mb-[-10px] z-10 border-2 border-white">
                    Choose a minigame!
                  </div>
                  <div className="flex gap-3 p-5 bg-white border-8 border-gray-800 rounded-[2.5rem] shadow-[0_12px_0_#2d2d2d] overflow-x-auto w-full no-scrollbar">
                    {[
                      { id: 'BALLSHOOTER' as MinigameType, emoji: '⚽', name: 'Ball Shooter', bg: 'bg-blue-50 hover:bg-blue-100' },
                      { id: 'BAMBOOCATCHER' as MinigameType, emoji: '🎋', name: 'Bamboo Catcher', bg: 'bg-green-50 hover:bg-green-100' },
                      { id: 'DINOJUMP' as MinigameType, emoji: '🦖', name: 'Dino Jump', bg: 'bg-lime-50 hover:bg-lime-100' },
                      { id: 'MEMORYMATCH' as MinigameType, emoji: '🃏', name: 'Memory', bg: 'bg-purple-50 hover:bg-purple-100' },
                      { id: 'BAMBOOSLICE' as MinigameType, emoji: '🔪', name: 'Bamboo Slice', bg: 'bg-red-50 hover:bg-red-100' },
                    ].map(game => (
                      <div
                        key={game.id}
                        onClick={() => setActiveMinigame(game.id)}
                        className={`flex-shrink-0 ${game.bg} border-4 border-gray-800 p-3 rounded-2xl transition-all cursor-pointer hover:-translate-y-2 active:scale-95 shadow-[4px_4px_0px_#2d2d2d] flex flex-col items-center min-w-[70px]`}
                      >
                        <div className="text-3xl">{game.emoji}</div>
                        <div className="text-[10px] font-black mt-1 text-gray-800 text-center">{game.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cosmetic Tray Overlay */}
              {activeMenu === 'COSMETIC' && !gameState.isSleeping && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-full duration-300 z-30 w-full max-w-sm px-4">
                  <div className="text-[10px] font-black bg-pink-500 text-white px-4 py-1 rounded-full uppercase tracking-tighter shadow-lg mb-[-10px] z-10 border-2 border-white">
                    Tap to wear!
                  </div>
                  <div className="flex gap-4 p-5 bg-white border-8 border-gray-800 rounded-[2.5rem] shadow-[0_12px_0_#2d2d2d] overflow-x-auto w-full no-scrollbar min-h-[120px] items-center">
                    {ownedCosmetics.length > 0 ? (
                      ownedCosmetics.map(cosmetic => {
                        const isEquipped = equippedCosmeticId === cosmetic.objectId;
                        const isLoading = isEquipping || isUnequipping;
                        return (
                          <div
                            key={cosmetic.objectId}
                            onClick={() => handleEquipCosmetic(cosmetic.objectId)}
                            className={`flex-shrink-0 p-3 rounded-2xl border-4 border-gray-800 transition-all cursor-pointer hover:-translate-y-2 active:scale-95 shadow-[4px_4px_0px_#2d2d2d] flex flex-col items-center ${isEquipped ? 'bg-green-100' : 'bg-pink-50'} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                          >
                            <div className="text-4xl mb-1">✨</div>
                            <div className="text-[9px] font-black text-center text-gray-800 mb-1 max-w-[60px] line-clamp-2">{cosmetic.fields.name}</div>
                            <div className={`text-[8px] font-black px-1 py-0.5 rounded border-2 border-gray-800 uppercase ${isEquipped ? 'bg-green-400' : 'bg-pink-400 text-white'}`}>
                              {isLoading ? 'LOADING...' : isEquipped ? 'ON' : 'OFF'}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div onClick={() => setShowCosmeticMinter(true)} className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-4 border-dashed border-pink-400 cursor-pointer hover:bg-gradient-to-r hover:from-pink-200 hover:to-purple-200 transition-colors w-full justify-center">
                        <span className="text-3xl">✨</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-600 uppercase leading-none">No cosmetics</span>
                          <span className="text-xs font-black text-purple-600 uppercase">Mint one!</span>
                        </div>
                      </div>
                    )}
                    <div onClick={() => setShowCosmeticMinter(true)} className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-4 border-dashed border-pink-400 cursor-pointer hover:bg-gradient-to-r hover:from-pink-200 hover:to-purple-200 transition-colors w-full justify-center">
                      <span className="text-3xl">✨</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-purple-600 uppercase">Mint one!</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile / Missions Modal */}
              {activeMenu === 'COINS' && !gameState.isSleeping && (
                <ProfileModal
                  coins={gameState.coins}
                  username="PandaKeeper"
                  missionStatuses={gameState.missionStatuses}
                  ownedCosmetics={ownedCosmetics}
                  equippedCosmeticId={equippedCosmeticId}
                  isEquipping={isEquipping}
                  isUnequipping={isUnequipping}
                  onClose={() => setActiveMenu('NONE')}
                  onClaimMission={gameState.claimMission}
                  onEquipCosmetic={handleEquipCosmetic}
                  onMintCosmetic={() => {
                    setActiveMenu('NONE');
                    setShowCosmeticMinter(true);
                  }}
                />
              )}

              {/* Leaderboard Modal */}
              {activeMenu === 'LEADERBOARD' && (
                <LeaderboardModal
                  topPlayers={topPlayers}
                  playerStats={playerStats}
                  evmAccount={evmAccount}
                  isLoading={isLoadingLeaderboard}
                  onClose={() => setActiveMenu('NONE')}
                />
              )}

              {/* Achievements Modal */}
              {activeMenu === 'ACHIEVEMENTS' && (
                <AchievementsModal
                  achievements={achievements}
                  isLoading={isLoadingAchievements}
                  isClaiming={isClaimingAchievement}
                  onClaim={handleClaimAchievement}
                  onClose={() => setActiveMenu('NONE')}
                />
              )}

              {/* IDRX Wallet Modal */}
              {activeMenu === 'IDRX' && (
                <IDRXWallet
                  balance={idrxBalance}
                  canClaim={canClaimFaucet}
                  isClaiming={isClaimingFaucet}
                  onClaimFaucet={handleClaimFaucet}
                  onClose={() => setActiveMenu('NONE')}
                />
              )}

              {/* Social Modal */}
              {activeMenu === 'SOCIAL' && (
                <SocialModal
                  evmAccount={evmAccount}
                  onClose={() => setActiveMenu('NONE')}
                />
              )}

              {gameState.isWashing && (
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center z-50 overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="text-6xl animate-bounce absolute" style={{ left: `${Math.random() * 80 + 10}%`, top: `${Math.random() * 80 + 10}%`, animationDelay: `${i * 0.1}s`, opacity: 0.6 }}>🫧</div>
                  ))}
                </div>
              )}
            </div>

            <BottomNav
              activeMenu={activeMenu}
              isSleeping={gameState.isSleeping}
              isWashing={gameState.isWashing}
              onMenuChange={setActiveMenu}
              onWash={() => { gameState.washPet(); setActiveMenu('NONE'); }}
              onToggleSleep={gameState.toggleSleep}
            />

            {gameState.isThinking && <div className="absolute bottom-32 right-12 text-5xl animate-pulse z-30">🐼💭</div>}
          </>
        )}
      </div>
    </>
  );
};

export default App;
