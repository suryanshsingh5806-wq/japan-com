import { Sparkles } from 'lucide-react';

interface OutfitSuggestionsProps {
  suggestions: string;
}

export const OutfitSuggestions = ({ suggestions }: OutfitSuggestionsProps) => {
  const outfits = suggestions.split(/\n\n+/).filter(section => section.trim().length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <Sparkles className="w-5 h-5 text-pink-500" />
        <h3 className="text-xl font-bold">おすすめコーディネート</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {outfits.map((outfit, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pink-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="h-1 flex-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded"></div>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {outfit.trim()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {outfits.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>提案を生成しています...</p>
        </div>
      )}
    </div>
  );
};
