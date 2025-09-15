'use client'
import React, { useState, useEffect } from 'react';
import { usePetStore } from '../store/petStore';

const PetSidebar: React.FC = () => {
  const {
    name,
    type,
    age,
    hunger,
    health,
    happiness,
    energy,
    cleanliness,
    isSleeping,
    isPlaying,
    isSick,
    feed,
    play,
    clean,
    rest,
    train,
    heal,
    updateState,
    renamePet,
    actions
  } = usePetStore();

  const [newName, setNewName] = useState('');

  // 定期更新宠物状态
  useEffect(() => {
    const interval = setInterval(() => {
      updateState();
    }, 60000);

    return () => clearInterval(interval);
  }, [updateState]);

  // 获取宠物表情
  const getPetEmotion = () => {
    if (isSick) return '😷';
    if (isSleeping) return '😴';
    if (isPlaying) return '🐾';
    if (health < 30) return '🤒';
    if (hunger > 80) return '🥺';
    if (happiness > 70) return '😊';
    if (happiness > 30) return '😐';
    return '😢';
  };

  // 获取状态条颜色
  const getStatusColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 处理重命名
  const handleRename = () => {
    if (newName.trim()) {
      renamePet(newName);
      setNewName('');
    }
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      {/* 宠物信息 */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-6xl mb-2">{getPetEmotion()}</div>
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={name}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800"
              onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            />
            <button 
              onClick={handleRename} 
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              重命名
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {type} • {age}天
          </p>
        </div>
      </div>

      {/* 状态条 */}
      <div className="space-y-3 mb-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium">饱食度</span>
            <span className="text-xs">{Math.round(hunger)}</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className={`h-1.5 rounded-full ${getStatusColor(hunger)}`} 
              style={{ width: `${hunger}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium">健康值</span>
            <span className="text-xs">{Math.round(health)}</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className={`h-1.5 rounded-full ${getStatusColor(health)}`} 
              style={{ width: `${health}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium">心情值</span>
            <span className="text-xs">{Math.round(happiness)}</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className={`h-1.5 rounded-full ${getStatusColor(happiness)}`} 
              style={{ width: `${happiness}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium">能量值</span>
            <span className="text-xs">{Math.round(energy)}</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className={`h-1.5 rounded-full ${getStatusColor(energy)}`} 
              style={{ width: `${energy}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium">清洁度</span>
            <span className="text-xs">{Math.round(cleanliness)}</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className={`h-1.5 rounded-full ${getStatusColor(cleanliness)}`} 
              style={{ width: `${cleanliness}%` }}
            />
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button 
          onClick={feed} 
          disabled={isSleeping}
          className={`p-2 rounded-md border text-xs ${isSleeping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          🍖 喂食
        </button>
        <button 
          onClick={play} 
          disabled={energy < 20 || isSleeping}
          className={`p-2 rounded-md border text-xs ${(energy < 20 || isSleeping) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          🎾 玩耍
        </button>
        <button 
          onClick={clean} 
          disabled={isSleeping}
          className={`p-2 rounded-md border text-xs ${isSleeping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          🛁 清洁
        </button>
        <button 
          onClick={rest} 
          className="p-2 rounded-md border text-xs hover:bg-gray-100 dark:hover:bg-gray-800">
          😴 {isSleeping ? '唤醒' : '睡觉'}
        </button>
        <button 
          onClick={train} 
          disabled={energy < 30 || hunger > 70 || isSleeping}
          className={`p-2 rounded-md border text-xs ${(energy < 30 || hunger > 70 || isSleeping) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          🎓 训练
        </button>
        <button 
          onClick={heal} 
          disabled={!isSick}
          className={`p-2 rounded-md border text-xs ${!isSick ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          💊 治疗
        </button>
      </div>

      {/* 状态提示 */}
      <div className="mb-6">
        <h3 className="text-xs font-medium mb-2">宠物状态</h3>
        <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
          {isSick && <p className="text-red-500">⚠️ 宠物生病了！</p>}
          {isSleeping && <p className="text-blue-500">💤 宠物在睡觉</p>}
          {isPlaying && <p className="text-green-500">🎾 宠物在玩耍</p>}
          {hunger > 90 && <p className="text-orange-500">🥺 宠物很饿</p>}
          {health < 30 && <p className="text-red-500">🤒 宠物不健康</p>}
          {happiness < 30 && <p className="text-purple-500">😢 宠物不开心</p>}
        </div>
      </div>

      {/* 动作记录 */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 overflow-y-auto">
        <h3 className="text-xs font-medium mb-2">活动记录</h3>
        {actions.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">暂无活动</p>
        ) : (
          <ul className="space-y-1">
            {actions.slice().reverse().map((action, index) => (
              <li key={index} className="text-xs text-gray-600 dark:text-gray-300">
                {action.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PetSidebar;