import { useState, useEffect } from 'react';
import { Shirt, MapPin, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { VoiceInput } from './components/VoiceInput';
import { WeatherDisplay } from './components/WeatherDisplay';
import { OutfitSuggestions } from './components/OutfitSuggestions';
import { ChatMessage } from './components/ChatMessage';

interface WeatherData {
  location: string;
  description: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [location, setLocation] = useState('Tokyo');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { isListening, transcript, isSupported, startListening, stopListening } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      handleVoiceInput(transcript);
    }
  }, [transcript]);

  const handleVoiceInput = async (voiceText: string) => {
    if (!voiceText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: voiceText,
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    setShowResults(false);

    try {
      const { data, error } = await supabase.functions.invoke('fashion-assistant', {
        body: {
          userQuery: voiceText,
          location: location,
        },
      });

      if (error) throw error;

      setWeatherData(data.weather);
      setSuggestions(data.suggestions);
      setShowResults(true);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '天気情報を取得して、あなたにぴったりのコーディネートを提案しました！',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'エラーが発生しました。もう一度お試しください。',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shirt className="w-12 h-12 text-indigo-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Fashion Weather Assistant
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            音声で質問して、天気に合わせたファッション提案を受け取ろう
          </p>
        </header>

        <div className="mb-8 flex justify-center gap-4 items-center">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="場所を入力"
              className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors w-64"
            />
          </div>
        </div>

        {messages.length === 0 && !isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                使い方
              </h2>
              <div className="space-y-4 text-left text-gray-600">
                <p>1. 場所を入力または確認してください</p>
                <p>2. マイクボタンをクリックして、日本語で質問してください</p>
                <p className="text-sm text-gray-500 pl-6">
                  例: 「今日のコーディネートを教えて」「デートに行くので素敵な服装を提案して」
                </p>
                <p>3. AIがあなたにぴったりのファッションを提案します</p>
              </div>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} role={message.role} content={message.content} />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <VoiceInput
            isListening={isListening}
            isSupported={isSupported}
            onStart={startListening}
            onStop={stopListening}
          />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <span className="ml-4 text-gray-600 text-lg">分析中...</span>
          </div>
        )}

        {showResults && weatherData && suggestions && !isLoading && (
          <div className="space-y-8">
            <WeatherDisplay weather={weatherData} />
            <OutfitSuggestions suggestions={suggestions} />
          </div>
        )}

        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>Powered by OpenWeather API & OpenAI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
