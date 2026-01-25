'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'sonner';
import useCreateCosmetic from '../hooks/useCreateCosmetic';

const COSMETIC_PRESETS = [
    { category: 'hat', name: 'Party Hat', emoji: '🎉', description: 'A festive party hat', rarity: 'common', cost: 50 },
    { category: 'hat', name: 'Santa Hat', emoji: '🎅', description: 'A jolly Santa hat', rarity: 'rare', cost: 100 },
    { category: 'hat', name: 'Crown', emoji: '👑', description: 'A majestic crown', rarity: 'legendary', cost: 200 },
    { category: 'glasses', name: 'Sunglasses', emoji: '😎', description: 'Cool shades', rarity: 'common', cost: 40 },
    { category: 'glasses', name: 'Monocle', emoji: '🧐', description: 'Distinguished monocle', rarity: 'rare', cost: 80 },
    { category: 'accessory', name: 'Bow Tie', emoji: '🎀', description: 'A fancy bow tie', rarity: 'rare', cost: 75 },
    { category: 'accessory', name: 'Necklace', emoji: '💎', description: 'Glittering necklace', rarity: 'legendary', cost: 150 },
    { category: 'shirt', name: 'T-Shirt', emoji: '👕', description: 'Casual t-shirt', rarity: 'common', cost: 60 },
    { category: 'shirt', name: 'Tuxedo', emoji: '🤵', description: 'Formal tuxedo', rarity: 'legendary', cost: 250 },
];

interface CreateCosmeticInitializerProps {
    onSuccess?: () => void;
    coins?: number;
    onSpendCoins?: (amount: number) => void;
}

export default function CreateCosmeticInitializer({ onSuccess, coins = 0, onSpendCoins }: CreateCosmeticInitializerProps) {
    const currentAccount = useCurrentAccount();
    const { mutate: createCosmetic, isPending, isError, error } = useCreateCosmetic({
        onError: (err) => toast.error(err.message),
    });
    const [selectedCosmetic, setSelectedCosmetic] = useState<typeof COSMETIC_PRESETS[0] | null>(null);
    const [customName, setCustomName] = useState('');

    const handleMint = (cosmetic: typeof COSMETIC_PRESETS[0]) => {
        if (!currentAccount) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (coins < cosmetic.cost) {
            toast.error(`Not enough coins! You need ${cosmetic.cost} 💰`);
            return;
        }

        createCosmetic({
            category: cosmetic.category,
            name: customName || cosmetic.name,
            description: cosmetic.description,
            rarity: cosmetic.rarity,
        }, {
            onSuccess: () => {
                onSpendCoins?.(cosmetic.cost);
                toast.success(`Successfully minted ${cosmetic.name}!`);
                onSuccess?.();
            },
            onError: (err: Error) => {
                toast.error(err.message || "Failed to mint cosmetic");
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-[3rem] border-8 border-gray-800 shadow-[0_20px_0_#2d2d2d] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col relative">

                    {/* Header */}
                    <div className="p-8 pb-4 border-b-4 border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-black uppercase text-gray-400 tracking-widest leading-none mb-1">NFT Boutique</span>
                            <h2 className="text-3xl font-game text-pink-500 tracking-tight">Style Factory</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-400 border-4 border-gray-800 rounded-full px-4 py-2 font-game text-xl shadow-[4px_4px_0px_#2d2d2d]">💰 {coins}</div>
                            <button
                                onClick={onSuccess}
                                className="text-2xl font-bold bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-800 hover:scale-110 active:scale-95 transition-transform"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 pt-6 overflow-y-auto custom-scrollbar flex-1">
                        {!currentAccount ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4 text-center">👛</div>
                                <p className="text-xl font-bold text-gray-800 mb-2 text-center">Wallet Disconnected</p>
                                <p className="text-gray-600 text-center">Please connect your Sui wallet to access the factory</p>
                            </div>
                        ) : (
                            <>
                                {/* Instructions Section */}
                                <div className="mb-8 p-5 rounded-[2rem] border-4 border-gray-800 bg-pink-50 shadow-[4px_4px_0px_#2d2d2d]">
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">✨</div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-lg text-gray-800">Choose your look!</h4>
                                            <p className="text-sm text-gray-400 font-medium">Select a preset to customize and mint</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cosmetic Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {COSMETIC_PRESETS.map((cosmetic, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedCosmetic(cosmetic)}
                                            className={`flex flex-col items-center justify-between border-4 border-gray-800 p-5 rounded-[2.5rem] transition-all cursor-pointer 
                                            hover:-translate-y-1 shadow-[6px_6px_0px_#2d2d2d] active:shadow-none active:translate-y-1 bg-white
                                            ${selectedCosmetic?.name === cosmetic.name ? 'ring-8 ring-pink-200 bg-pink-50' : ''}
                                            `}
                                        >
                                            <div className="text-5xl mb-3 transform hover:scale-110 transition-transform">{cosmetic.emoji}</div>
                                            <div className="w-full">
                                                <p className="text-center font-bold text-gray-800 mb-2 text-sm">{cosmetic.name}</p>
                                                <div className="flex gap-2">
                                                    <div className={`flex-1 text-[8px] font-black text-center py-1 rounded-xl border-2 border-gray-800 uppercase ${cosmetic.rarity === 'legendary' ? 'bg-yellow-300' :
                                                        cosmetic.rarity === 'rare' ? 'bg-purple-300' :
                                                            'bg-gray-300'
                                                        }`}>
                                                        {cosmetic.rarity}
                                                    </div>
                                                    <div className="bg-yellow-300 px-2 py-1 rounded-xl border-2 border-gray-800 text-[10px] font-black whitespace-nowrap">
                                                        {cosmetic.cost}💰
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Selected Cosmetic Details */}
                                {selectedCosmetic && (
                                    <div className="bg-indigo-50 p-6 rounded-[2.5rem] border-4 border-gray-800 mb-8 shadow-[4px_4px_0px_#2d2d2d]">
                                        <div className="flex items-start gap-6 mb-6 text-left">
                                            <div className="text-7xl transform hover:rotate-12 transition-transform">{selectedCosmetic.emoji}</div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-game text-gray-800 mb-1 leading-tight">{selectedCosmetic.name}</h3>
                                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 italic opacity-70 leading-none">{selectedCosmetic.description}</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    <div className={`px-3 py-1 rounded-full border-2 border-gray-800 text-[10px] font-black uppercase ${selectedCosmetic.rarity === 'legendary' ? 'bg-yellow-300' :
                                                        selectedCosmetic.rarity === 'rare' ? 'bg-purple-300' :
                                                            'bg-gray-300'
                                                        }`}>
                                                        {selectedCosmetic.rarity}
                                                    </div>
                                                    <div className="bg-pink-100 px-3 py-1 rounded-full border-2 border-gray-800 text-[10px] font-black uppercase">
                                                        {selectedCosmetic.category}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Custom Name Input */}


                                        {/* Insufficient Coins Warning */}
                                        {coins < selectedCosmetic.cost && (
                                            <div className="bg-orange-100 border-4 border-orange-500 p-5 rounded-3xl mb-6 flex items-center gap-3 animate-pulse">
                                                <span className="text-2xl">🚨</span>
                                                <p className="text-orange-700 font-black text-xs uppercase leading-tight">
                                                    Short on cash! Need {selectedCosmetic.cost - coins} more 💰
                                                </p>
                                            </div>
                                        )}

                                        {/* Error Message */}
                                        {isError && (
                                            <div className="bg-red-100 border-4 border-red-500 p-5 rounded-3xl mb-6">
                                                <p className="text-red-700 font-black text-xs uppercase">
                                                    {(error as Error)?.message || 'Something went wrong...'}
                                                </p>
                                            </div>
                                        )}

                                        {/* Mint Button */}
                                        <button
                                            onClick={() => handleMint(selectedCosmetic)}
                                            disabled={isPending || coins < selectedCosmetic.cost}
                                            className={`w-full py-5 rounded-[2rem] border-4 border-gray-800 font-game text-xl transition-all ${isPending
                                                ? 'bg-gray-400 opacity-60 cursor-not-allowed translate-y-2'
                                                : coins < selectedCosmetic.cost
                                                    ? 'bg-red-300 opacity-60 cursor-not-allowed translate-y-2'
                                                    : 'bg-gradient-to-r from-pink-400 to-purple-400 hover:-translate-y-1 active:translate-y-2 shadow-[0_8px_0_#2d2d2d] active:shadow-none mb-2'
                                                }`}
                                        >
                                            {isPending ? '⏳ MINTING...' : coins < selectedCosmetic.cost ? '❌ NO COINS' : `✨ GET FOR ${selectedCosmetic.cost}💰`}
                                        </button>
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-tighter mt-2">NFT Metadata will be stored on Sui blockchain</p>
                                    </div>
                                )}

                                {!selectedCosmetic && (
                                    <div className="text-center py-12 mt-4 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200">
                                        <div className="text-6xl mb-4 animate-bounce">🎨</div>
                                        <p className="text-lg font-game text-gray-400">Pick a design above!</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
