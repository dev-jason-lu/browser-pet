'use client'
import React from 'react';
import { usePetStore } from '../store/petStore';

const SkillTrainer: React.FC = () => {
  const { 
    skills, 
    energy, 
    hunger, 
    trainSkill, 
    level, 
    experience 
  } = usePetStore();

  // 技能配置
  const skillConfig = {
    intelligence: {
      name: '智力',
      description: '提高宠物的学习能力和解决问题的能力',
      icon: '🧠',
      effect: '降低训练消耗的能量'
    },
    agility: {
      name: '敏捷',
      description: '提高宠物的反应速度和灵活性',
      icon: '⚡',
      effect: '增加玩耍获得的快乐值'
    },
    strength: {
      name: '力量',
      description: '提高宠物的体力和耐力',
      icon: '💪',
      effect: '增加喂食的饱食度恢复'
    },
    charm: {
      name: '魅力',
      description: '提高宠物的吸引力和亲和力',
      icon: '✨',
      effect: '增加心情值的自然恢复'
    }
  };

  // 获取技能进度条颜色
  const getSkillProgressColor = (value: number) => {
    if (value >= 80) return 'bg-purple-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-green-500';
    if (value >= 20) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  // 获取当前升级所需经验值
  const getExperienceToNextLevel = () => {
    return level * 100;
  };

  // 检查是否可以训练技能
  const canTrainSkill = () => {
    return energy >= 40 && hunger <= 60;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
      {/* 等级和经验信息 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold flex items-center gap-2">
            📊 宠物状态
          </h3>
          <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            <span className="text-blue-600 dark:text-blue-400 font-medium">{level}级</span>
          </div>
        </div>
        
        {/* 经验条 */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>经验值</span>
            <span>{Math.round(experience)}/{getExperienceToNextLevel()}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${(experience / getExperienceToNextLevel()) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 技能训练区域 */}
      <div>
        <h3 className="text-xl font-bold mb-4">🎯 技能训练</h3>
        
        <div className="space-y-4">
          {Object.entries(skills).map(([skillKey, skillValue]) => {
            const key = skillKey as keyof typeof skills;
            const config = skillConfig[key];
            
            return (
              <div key={skillKey} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{config.icon}</div>
                    <div>
                      <h4 className="font-bold text-lg">{config.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{config.description}</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                    {skillValue}
                  </div>
                </div>
                
                {/* 技能进度条 */}
                <div className="mb-3">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getSkillProgressColor(skillValue)} transition-all duration-500 ease-out`}
                      style={{ width: `${skillValue}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-green-500">✓</span> {config.effect}
                  </div>
                  <button
                    onClick={() => trainSkill(key)}
                    disabled={!canTrainSkill()}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${canTrainSkill() 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    训练
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 训练消耗说明 */}
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
            <div className="text-lg">⚠️</div>
            <div>
              <p className="font-medium">训练消耗</p>
              <p>每次训练消耗40能量值，并增加15饱食度需求</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTrainer;