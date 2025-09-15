'use client'
import React, { useEffect, useState } from 'react';
import { usePetStore } from '../store/petStore';
import AchievementSystem from './AchievementSystem';
import SkillTrainer from './SkillTrainer';

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
    actions,
    level,
    experience
  } = usePetStore();

  const [activeTab, setActiveTab] = useState<'main' | 'achievements' | 'skills'>('main');

  // 获取当前升级所需经验值
  const getExperienceToNextLevel = () => {
    return level * 100;
  };

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
    <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* 宠物信息和选项卡 */}
      <div className="w-full mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-7xl animate-bounce">{getPetEmotion()}</div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{name}</h2>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm px-2 py-0.5 rounded-full font-medium">
                  {level}级
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">{type} • {age}天</p>
            </div>
          </div>
          
          {/* 经验条 */}
          <div className="w-full sm:w-auto flex-1 max-w-sm">
            <div className="flex justify-between text-xs mb-1">
              <span>经验值</span>
              <span>{Math.round(experience)}/{getExperienceToNextLevel()}</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${(experience / getExperienceToNextLevel()) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* 选项卡 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'main' 
              ? 'border-b-2 border-blue-500 text-blue-500' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
            `}
          >
            🐾 宠物主页
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'achievements' 
              ? 'border-b-2 border-blue-500 text-blue-500' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
            `}
          >
            🏆 成就系统
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'skills' 
              ? 'border-b-2 border-blue-500 text-blue-500' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
            `}
          >
            🎯 技能训练
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      {activeTab === 'main' && (
        <div className="space-y-6">
          {/* 状态条 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="md:col-span-2">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button 
              onClick={feed} 
              disabled={isSleeping}
              className={`p-3 rounded-lg border flex flex-col items-center ${isSleeping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <div className="text-xl mb-1">🍖</div>
              <span className="text-sm">喂食</span>
            </button>
            <button 
              onClick={play} 
              disabled={energy < 20 || isSleeping}
              className={`p-3 rounded-lg border flex flex-col items-center ${(energy < 20 || isSleeping) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <div className="text-xl mb-1">🎾</div>
              <span className="text-sm">玩耍</span>
            </button>
            <button 
              onClick={clean} 
              disabled={isSleeping}
              className={`p-3 rounded-lg border flex flex-col items-center ${isSleeping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <div className="text-xl mb-1">🛁</div>
              <span className="text-sm">清洁</span>
            </button>
            <button 
              onClick={rest} 
              className="p-3 rounded-lg border flex flex-col items-center hover:bg-gray-100 dark:hover:bg-gray-800">
              <div className="text-xl mb-1">😴</div>
              <span className="text-sm">{isSleeping ? '唤醒' : '睡觉'}</span>
            </button>
            <button 
              onClick={train} 
              disabled={energy < 30 || hunger > 70 || isSleeping}
              className={`p-3 rounded-lg border flex flex-col items-center ${(energy < 30 || hunger > 70 || isSleeping) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <div className="text-xl mb-1">🎓</div>
              <span className="text-sm">训练</span>
            </button>
            <button 
              onClick={heal} 
              disabled={!isSick}
              className={`p-3 rounded-lg border flex flex-col items-center ${!isSick ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <div className="text-xl mb-1">💊</div>
              <span className="text-sm">治疗</span>
            </button>
          </div>

          {/* 动作记录 */}
          <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-48 overflow-y-auto">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <span>📝 最近活动</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({actions.length})</span>
            </h3>
            {actions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">暂无活动记录</p>
            ) : (
              <ul className="space-y-2">
                {actions.map((action, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 p-2 rounded">
                    {action.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      
      {/* 成就系统 */}
      {activeTab === 'achievements' && <AchievementSystem />}
      
      {/* 技能训练 */}
      {activeTab === 'skills' && <SkillTrainer />}
    </div>
  );
};

export default PetComponent;