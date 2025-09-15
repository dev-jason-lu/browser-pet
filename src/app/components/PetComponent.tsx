'use client'
import React, { useEffect } from 'react';
import { usePetStore } from '../store/petStore';

const PetComponent: React.FC = () => {
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
    actions
  } = usePetStore();

  // 定期更新宠物状态
  useEffect(() => {
    // 每分钟更新一次状态
    const interval = setInterval(() => {
      updateState();
    }, 60000);

    return () => clearInterval(interval);
  }, [updateState]);

  // 获取宠物表情或状态图标
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

  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-md mx-auto">
      {/* 宠物信息 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-7xl">{getPetEmotion()}</div>
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{type} • {age}天</p>
        </div>
      </div>

      {/* 状态条 */}
      <div className="w-full space-y-3 mb-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">饱食度</span>
            <span className="text-sm">{Math.round(hunger)}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className={`h-2 rounded-full ${getStatusColor(hunger)}`} 
              style={{ width: `${hunger}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">健康值</span>
            <span className="text-sm">{Math.round(health)}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className={`h-2 rounded-full ${getStatusColor(health)}`} 
              style={{ width: `${health}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">心情值</span>
            <span className="text-sm">{Math.round(happiness)}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className={`h-2 rounded-full ${getStatusColor(happiness)}`} 
              style={{ width: `${happiness}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">能量值</span>
            <span className="text-sm">{Math.round(energy)}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className={`h-2 rounded-full ${getStatusColor(energy)}`} 
              style={{ width: `${energy}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">清洁度</span>
            <span className="text-sm">{Math.round(cleanliness)}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div 
              className={`h-2 rounded-full ${getStatusColor(cleanliness)}`} 
              style={{ width: `${cleanliness}%` }}
            />
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-3 gap-3 w-full mb-6">
        <button 
          onClick={feed} 
          disabled={isSleeping}
          className={`p-3 rounded-lg border ${isSleeping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          🍖 喂食
        </button>
        <button 
          onClick={play} 
          disabled={energy < 20 || isSleeping}
          className={`p-3 rounded-lg border ${(energy < 20 || isSleeping) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          🎾 玩耍
        </button>
        <button 
          onClick={clean} 
          disabled={isSleeping}
          className={`p-3 rounded-lg border ${isSleeping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          🛁 清洁
        </button>
        <button 
          onClick={rest} 
          className="p-3 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800">
          😴 {isSleeping ? '唤醒' : '睡觉'}
        </button>
        <button 
          onClick={train} 
          disabled={energy < 30 || hunger > 70 || isSleeping}
          className={`p-3 rounded-lg border ${(energy < 30 || hunger > 70 || isSleeping) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          🎓 训练
        </button>
        <button 
          onClick={heal} 
          disabled={!isSick}
          className={`p-3 rounded-lg border ${!isSick ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          💊 治疗
        </button>
      </div>

      {/* 动作记录 */}
      <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg p-3 max-h-40 overflow-y-auto">
        <h3 className="text-sm font-medium mb-2">最近活动</h3>
        {actions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">暂无活动记录</p>
        ) : (
          <ul className="space-y-1">
            {actions.map((action, index) => (
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

export default PetComponent;