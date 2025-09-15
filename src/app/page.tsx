'use client'
import React, { useState, useEffect } from 'react';
import PetComponent from './components/PetComponent';
import FloatingPet from './components/FloatingPet';
import PetSidebar from './components/PetSidebar';
import { usePetStore } from './store/petStore';
import { LAppDelegate } from './components/live2d/lappdelegate';
import * as LAppDefine from './components/live2d/lappdefine';

const BrowserPetGame: React.FC = () => {
  const { initializePet } = usePetStore();
  const [showFloatingPet, setShowFloatingPet] = useState(false);
  const [showLive2DPet, setShowLive2DPet] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isGameInitialized, setIsGameInitialized] = useState(false);
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('小猫');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/Core/live2dcubismcore.js';
    script.onload = () => {
      LAppDelegate.getInstance().initialize();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 运行逻辑
  useEffect(() => {
    if (showLive2DPet && isGameInitialized) {
      LAppDelegate.getInstance().run();
    }
  }, [showLive2DPet, isGameInitialized]);

  // 开始游戏
  const startGame = () => {
    initializePet(petName, petType);
    setIsGameInitialized(true);
  };

  // 游戏界面
  const GameInterface = () => (
    <div className={`min-h-screen ${showSidebar ? 'flex' : 'p-8'}`}>
      {showSidebar && <PetSidebar />}
      <div className={`${showSidebar ? 'flex-1' : 'max-w-4xl mx-auto'}`}>
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-center flex-1">浏览器宠物</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              📊 {showSidebar ? '关闭侧边栏' : '打开侧边栏'}
            </button>
            <button 
              onClick={() => setShowFloatingPet(!showFloatingPet)}
              className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              🐾 {showFloatingPet ? '隐藏悬浮宠物' : '显示悬浮宠物'}
            </button>
            <button 
              onClick={() => setShowLive2DPet(!showLive2DPet)}
              className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              🎭 {showLive2DPet ? '隐藏Live2D宠物' : '显示Live2D宠物'}
            </button>
          </div>
        </header>
        
        <main>
          <PetComponent />
        </main>
      </div>
    </div>
  );

  // 开始界面
  const StartScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-8xl mb-6 animate-bounce">🐱</div>
      <h1 className="text-4xl font-bold mb-8 text-center">欢迎来到浏览器宠物!</h1>
      <div className="max-w-md w-full space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">宠物名字</label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="输入宠物名字"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">宠物类型</label>
          <select
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="小猫">小猫</option>
            <option value="小狗">小狗</option>
            <option value="小鸟">小鸟</option>
            <option value="小兔">小兔</option>
            <option value="小龙">小龙</option>
          </select>
        </div>
        <button 
          onClick={startGame}
          className="w-full py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
        >
          开始游戏
        </button>
      </div>
      <div className="mt-12 text-sm text-gray-500 dark:text-gray-400 max-w-md text-center">
        <p>照顾你的虚拟宠物，通过喂食、玩耍和清洁来保持它的健康和快乐！</p>
        <p className="mt-2">你可以通过悬浮窗或侧边栏随时查看和互动你的宠物。</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {isGameInitialized ? <GameInterface /> : <StartScreen />}
      {showFloatingPet && isGameInitialized && <FloatingPet />}
    </div>
  );
};

export default BrowserPetGame;
