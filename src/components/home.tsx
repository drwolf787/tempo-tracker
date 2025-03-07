import React from "react";
import PredictorWidget from "./roulette-predictor/PredictorWidget";

function Home() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-950 to-black flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=1200&q=80')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div className="max-w-4xl w-full p-8 text-center relative z-10">
        <h1 className="text-5xl font-bold text-yellow-400 mb-4 tracking-wider uppercase">
          SMART ROULETTE TRACKER
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Header 1
          </h1>
        </h1>
        <p className="text-xl text-white/90 mb-8">
          Advanced AI-powered taskbar widget for predicting roulette outcomes
        </p>
        <div className="p-6 bg-black/60 border-2 border-yellow-500/30 rounded-lg text-white/90 text-left shadow-lg">
          <p className="mb-3 font-medium">
            This demo simulates the taskbar widget in the bottom-right corner of
            your screen.
          </p>
          <p className="font-medium">
            Click on the widget to expand it and explore all features.
          </p>
          <div className="mt-4 text-xs text-yellow-400/70 text-right">
            v1.3.7
          </div>
        </div>
      </div>
      {/* The predictor widget will appear in the bottom-right corner */}
      <PredictorWidget />
    </div>
  );
}

export default Home;
