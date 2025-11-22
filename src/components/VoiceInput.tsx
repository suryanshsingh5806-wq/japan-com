import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const VoiceInput = ({
  isListening,
  isSupported,
  onStart,
  onStop,
}: VoiceInputProps) => {
  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">
          お使いのブラウザは音声入力に対応していません。
          Chrome、Edge、またはSafariをお試しください。
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={isListening ? onStop : onStart}
      className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
        isListening
          ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse scale-110'
          : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-105'
      }`}
    >
      {isListening ? (
        <MicOff className="w-8 h-8 text-white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}

      {isListening && (
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 whitespace-nowrap">
          聞いています...
        </span>
      )}
    </button>
  );
};
