import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import useCreatePanda from "../hooks/useCreatePanda";

interface CreatePandaInitializerProps {
    onSuccess: () => void;
    onCancel?: () => void;
}

const CreatePandaInitializer: React.FC<CreatePandaInitializerProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [pandaName, setPandaName] = useState("");
    const currentAccount = useCurrentAccount();

    console.log("Current Account:", currentAccount?.address);
    const { mutate: createPanda, isPending: isCreatingPanda } = useCreatePanda({
        onSuccess: () => {
            toast.success("🐼 Congratulations! Your first Panda is born! 🎉");
            setPandaName("");
            onSuccess();
        },
        onError: (e) => {
            toast.error(`Error creating Panda: ${e.message}`);
        },
    });

    const handleCreatePanda = () => {
        if (!pandaName.trim()) {
            toast.error("Please give your Panda a name!");
            return;
        }

        if (!currentAccount?.address) {
            toast.error("Please connect your wallet first");
            return;
        }

        createPanda({ name: pandaName });
    };

    const suggestedNames = [
        "Fluffy",
        "Bamboo",
        "Snowy",
        "Lucky",
        "Shadow",
        "Mocha",
        "Pollen",
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-6 border-4 border-purple-200">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
                        <span className="text-5xl">🐼</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome to Yeru!</h1>
                    <p className="text-gray-600">
                        Create your first Panda NFT and start your adventure
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Panda Name
                        </label>
                        <input
                            type="text"
                            value={pandaName}
                            onChange={(e) => setPandaName(e.target.value)}
                            placeholder="Choose a name for your Panda..."
                            disabled={isCreatingPanda}
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && !isCreatingPanda) {
                                    handleCreatePanda();
                                }
                            }}
                            className="w-full h-12 px-4 text-base border-2 border-purple-300 rounded-lg focus:border-purple-600 focus:outline-none disabled:opacity-50"
                        />
                    </div>

                    {/* Suggested Names */}
                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-medium">
                            Quick names (click to use):
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {suggestedNames.map((name) => (
                                <button
                                    key={name}
                                    onClick={() => setPandaName(name)}
                                    disabled={isCreatingPanda}
                                    className="px-3 py-2 text-sm rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition disabled:opacity-50"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={handleCreatePanda}
                        disabled={isCreatingPanda || !pandaName.trim()}
                        className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg border-4 border-gray-800 shadow-[4px_4px_0px_#2d2d2d] disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:shadow-none flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        {isCreatingPanda ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Your Panda...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" />
                                Create Panda NFT
                            </>
                        )}
                    </button>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 space-y-2">
                    <div className="flex items-start gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-blue-900">
                                About Your Panda
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                Your Panda is an NFT stored on the Sui blockchain. You&apos;ll own it completely and can equip cosmetic items to customize it.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase">
                        What you can do:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                            <span className="text-purple-500">✓</span> Own your Panda as an NFT
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-purple-500">✓</span> Equip cosmetics
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-purple-500">✓</span> Manage multiple Pandas
                        </li>
                    </ul>
                </div>

                {/* Wallet Info */}
                {currentAccount?.address && (
                    <div className="text-xs text-gray-500 text-center">
                        <p>Connected: {currentAccount.address.slice(0, 10)}...</p>
                    </div>
                )}

                {/* Cancel Button */}
                {onCancel && (
                    <button
                        onClick={onCancel}
                        disabled={isCreatingPanda}
                        className="w-full h-10 text-gray-600 border-4 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default CreatePandaInitializer;
