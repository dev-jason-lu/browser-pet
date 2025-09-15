'use client'
import React, { useEffect } from 'react';
import { usePetStore } from '../store/petStore';
import type { PetState } from '../store/petStore';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (state: PetState) => boolean;
  isUnlocked: boolean;
  timestamp?: number;
}

const AchievementSystem: React.FC = () => {
  const { achievements, unlockAchievement, age, actions, name } = usePetStore();
  const [showModal, setShowModal] = React.useState(false);
  const [newAchievement, setNewAchievement] = React.useState<Achievement | null>(null);

  // 定义所有成就 - 使用useMemo优化，避免每次渲染都重新创建数组
  const allAchievements = React.useMemo<Achievement[]>(() => [
    {
      id: 'first-feed',
      title: '初次喂食',
      description: '第一次喂食你的宠物',
      icon: '🍖',
      condition: (state) => state.actions.some((a) => a.type === 'feed'),
      isUnlocked: achievements['first-feed'] || false
    },
    {
      id: 'first-play',
      title: '游戏伙伴',
      description: '第一次和你的宠物玩耍',
      icon: '🎾',
      condition: (state) => state.actions.some((a) => a.type === 'play'),
      isUnlocked: achievements['first-play'] || false
    },
    {
      id: 'first-clean',
      title: '清洁达人',
      description: '第一次为宠物清洁',
      icon: '🛁',
      condition: (state) => state.actions.some((a) => a.type === 'clean'),
      isUnlocked: achievements['first-clean'] || false
    },
    {
      id: 'pet-birthday',
      title: '一周年快乐',
      description: '宠物存活7天',
      icon: '🎂',
      condition: (state) => state.age >= 7,
      isUnlocked: achievements['pet-birthday'] || false
    },
    {
      id: 'healthy-living',
      title: '健康生活',
      description: '保持宠物健康值100超过24小时',
      icon: '💪',
      condition: (state) => {
        // 简化实现，实际项目中可能需要更复杂的检测
        return state.health === 100 && state.age >= 1;
      },
      isUnlocked: achievements['healthy-living'] || false
    },
    {
      id: 'super-happy',
      title: '快乐星球',
      description: '让宠物的心情值达到100',
      icon: '😊',
      condition: (state) => state.happiness === 100,
      isUnlocked: achievements['super-happy'] || false
    },
    {
      id: 'slept-well',
      title: '睡个好觉',
      description: '宠物累计睡眠超过8小时',
      icon: '😴',
      condition: (state) => {
        // 简化实现
        return state.age >= 1;
      },
      isUnlocked: achievements['slept-well'] || false
    },
    {
      id: 'pet-renamer',
      title: '名字大师',
      description: '为宠物改名',
      icon: '✏️',
      condition: (state) => state.name !== '小宠物',
      isUnlocked: achievements['pet-renamer'] || false
    }
  ], [achievements]);

  // 检查并解锁成就
  useEffect(() => {
    const currentState = usePetStore.getState();
    
    allAchievements.forEach(achievement => {
      if (!achievement.isUnlocked && achievement.condition(currentState)) {
        unlockAchievement(achievement.id);
        
        // 显示新成就通知
        setNewAchievement(achievement);
        setShowModal(true);
        
        // 5秒后自动关闭通知
        setTimeout(() => {
          setShowModal(false);
        }, 5000);
      }
    });
  }, [allAchievements, actions, age, name, achievements, unlockAchievement]);

  const unlockedAchievements = allAchievements.filter(a => a.isUnlocked);
  const lockedAchievements = allAchievements.filter(a => !a.isUnlocked);

  return (
    <>
      {/* 成就通知弹窗 */}
      {showModal && newAchievement && (
        <div className="fixed top-10 right-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-w-xs animate-slide-in-right">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{newAchievement.icon}</div>
            <div>
              <h3 className="font-bold text-lg">成就解锁！</h3>
              <h4 className="text-blue-500 font-medium">{newAchievement.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{newAchievement.description}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 成就面板 */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          🏆 成就系统
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({unlockedAchievements.length}/{allAchievements.length})</span>
        </h3>
        
        <div className="space-y-4">
          {/* 已解锁成就 */}
          {unlockedAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">已解锁成就</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unlockedAchievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className="p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 flex items-start gap-3"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-medium">{achievement.title}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                      <p className="text-xs text-green-500 mt-1">已解锁</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 未解锁成就 */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">未解锁成就</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lockedAchievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-start gap-3 opacity-70"
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-medium">?????</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">完成特定条件解锁</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AchievementSystem;