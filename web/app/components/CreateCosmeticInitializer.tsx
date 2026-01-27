'use client';

interface CreateCosmeticInitializerProps {
    onSuccess?: () => void;
    coins?: number;
    onSpendCoins?: (amount: number) => void;
}

export default function CreateCosmeticInitializer({ onSuccess }: CreateCosmeticInitializerProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
            <div className="bg-white rounded-3xl border-8 border-gray-800 p-8 max-w-md w-full space-y-6 shadow-[0_20px_0_#2d2d2d]">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full">
                        <span className="text-5xl">✨</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Cosmetics</h2>
                    <p className="text-gray-600">
                        Cosmetic NFTs are created by the contract owner
                    </p>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border-4 border-blue-200 rounded-2xl p-6 space-y-3">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">ℹ️</span>
                        <div className="flex-1">
                            <h3 className="font-bold text-blue-900 mb-2">Admin-Only Feature</h3>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                In the Base (EVM) version, only the contract owner can create new cosmetic templates.
                                Once created by the admin, all users can equip them to their Pandas!
                            </p>
                        </div>
                    </div>
                </div>

                {/* How it works */}
                <div className="space-y-3">
                    <h4 className="font-bold text-gray-700">How Cosmetics Work:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Admin creates cosmetic templates (hat, shirt, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>All users can equip any cosmetic to their Panda</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>No need to buy/mint individual cosmetics</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>Gas-efficient: only updates mapping</span>
                        </li>
                    </ul>
                </div>

                {/* Note */}
                <div className="bg-yellow-50 border-4 border-yellow-200 rounded-2xl p-4">
                    <p className="text-sm text-yellow-900">
                        <strong>Note:</strong> This is different from the Sui version where each cosmetic is a unique NFT owned by users.
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={onSuccess}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 transition-transform active:scale-95"
                >
                    Got it!
                </button>
            </div>
        </div>
    );
}
