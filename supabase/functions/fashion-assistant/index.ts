import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestPayload {
  userQuery: string;
  location: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userQuery, location }: RequestPayload = await req.json();

    const weatherApiKey = Deno.env.get("OPENWEATHER_API_KEY");
    if (!weatherApiKey) {
      throw new Error("Weather API key not configured");
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${weatherApiKey}&units=metric&lang=ja`;
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = `あなたはファッションとスタイリングの専門家です。以下の天気情報とユーザーのリクエストに基づいて、3つのユニークで創造的な服装の提案をしてください。

天気情報:
- 場所: ${weatherData.name}
- 天気: ${weatherData.weather[0].description}
- 気温: ${weatherData.main.temp}°C
- 体感温度: ${weatherData.main.feels_like}°C
- 湿度: ${weatherData.main.humidity}%
- 風速: ${weatherData.wind.speed} m/s

ユーザーのリクエスト: ${userQuery}

各提案には以下を含めてください:
1. 服装の名前（クリエイティブなタイトル）
2. 具体的なアイテム（トップス、ボトムス、アウター、アクセサリーなど）
3. カラーとスタイルの提案
4. なぜこの天気に合うのか簡単な説明

ファッショナブルで、旅行者や流行に敏感な人にも魅力的な、楽しくスタイリッシュなトーンで回答してください。日本語で回答してください。`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1000,
          },
          systemInstruction: {
            parts: {
              text: "あなたは親しみやすく、創造的なファッションアドバイザーです。天気に合わせたスタイリッシュで実用的な服装を提案します。",
            },
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const aiData = await geminiResponse.json();
    const suggestions = aiData.candidates[0].content.parts[0].text;

    const responseData = {
      weather: {
        location: weatherData.name,
        description: weatherData.weather[0].description,
        temperature: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        icon: weatherData.weather[0].icon,
      },
      suggestions,
    };

    return new Response(JSON.stringify(responseData), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});