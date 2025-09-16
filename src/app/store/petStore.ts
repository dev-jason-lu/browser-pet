import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义宠物的状态类型
export interface PetState {
  // 基本信息
  name: string;
  type: string; // 宠物类型
  age: number;
  
  // 生理状态 (0-100)
  hunger: number;
  health: number;
  happiness: number;
  energy: number;
  cleanliness: number;
  
  // 外观状态
  isSleeping: boolean;
  isPlaying: boolean;
  isSick: boolean;
  
  // 时间相关
  lastUpdate: number;
  
  // 动作记录
  actions: { type: string; timestamp: number; description: string }[];
  
  // 成就系统
  achievements: Record<string, boolean>;
  
  // 技能系统
  skills: {
    intelligence: number; // 智力
    agility: number; // 敏捷
    strength: number; // 力量
    charm: number; // 魅力
  };
  
  // 等级系统
  level: number;
  experience: number;
}

// 定义宠物的动作类型
export interface PetActions {
  // 基本操作
  feed: () => void;
  play: () => void;
  clean: () => void;
  rest: () => void;
  
  // 高级操作
  train: () => void;
  heal: () => void;
  
  // 互动系统
  petInteract: (interactionType: 'pet' | 'doubleClick' | 'drag' | 'pat') => void;
  
  // 状态更新
  updateState: () => void;
  renamePet: (name: string) => void;
  
  // 初始化宠物
  initializePet: (name?: string, type?: string) => void;
  
  // 成就系统
  unlockAchievement: (achievementId: string) => void;
  
  // 经验和等级系统
  gainExperience: (amount: number) => void;
  levelUp: () => void;
  
  // 技能系统
  trainSkill: (skillName: keyof PetState['skills']) => void;
}

// 合并状态和动作类型
export type PetStore = PetState & PetActions;

// 状态衰减速率 (每分钟减少的数值)
const DECAY_RATES = {
  hunger: 1,
  health: 0.5,
  happiness: 0.8,
  energy: 1.2,
  cleanliness: 0.7,
};

// 创建宠物store
export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      // 初始状态
      name: '小宠物',
      type: '小猫',
      age: 0,
      hunger: 50,
      health: 100,
      happiness: 80,
      energy: 100,
      cleanliness: 100,
      isSleeping: false,
      isPlaying: false,
      isSick: false,
      lastUpdate: Date.now(),
      actions: [] as { type: string; timestamp: number; description: string }[],
      achievements: {},
      skills: {
        intelligence: 10,
        agility: 10,
        strength: 10,
        charm: 10
      },
      level: 1,
      experience: 0,

      // 喂食操作
      feed: () => {
        set((state) => {
          const newState: Partial<PetState> = {
            hunger: Math.min(state.hunger + 20, 100),
            health: Math.min(state.health + 5, 100),
            actions: [...state.actions, {
              type: 'feed',
              timestamp: Date.now(),
              description: '喂食成功！'
            }].slice(-10), // 只保留最近10条记录
            lastUpdate: Date.now()
          };

          // 检查是否解锁初次喂食成就
          if (!state.achievements['first-feed']) {
            setTimeout(() => {
              usePetStore.getState().unlockAchievement('first-feed');
            }, 0);
          }

          // 获得喂食经验
          setTimeout(() => {
            usePetStore.getState().gainExperience(5);
          }, 0);

          return newState;
        });
      },

      // 玩耍操作
      play: () => {
        set((state) => {
          if (state.energy < 20) {
            return state;
          }
          
          const newState: Partial<PetState> = {
            happiness: Math.min(state.happiness + 25, 100),
            energy: Math.max(state.energy - 20, 0),
            isPlaying: true,
            actions: [...state.actions, {
              type: 'play',
              timestamp: Date.now(),
              description: '玩耍时间！'
            }].slice(-10),
            lastUpdate: Date.now()
          };

          // 获得玩耍经验
          setTimeout(() => {
            usePetStore.getState().gainExperience(10);
          }, 0);

          // 检查是否解锁游戏伙伴成就
          if (!state.achievements['game-partner']) {
            setTimeout(() => {
              usePetStore.getState().unlockAchievement('game-partner');
            }, 0);
          }

          return newState;
        });
        
        // 3秒后结束玩耍状态
        setTimeout(() => {
          set(() => ({ isPlaying: false }));
        }, 3000);
      },

      // 清洁操作
      clean: () => {
        set((state) => {
          const newState: Partial<PetState> = {
            cleanliness: 100,
            health: Math.min(state.health + 10, 100),
            actions: [...state.actions, {
              type: 'clean',
              timestamp: Date.now(),
              description: '洗澡真舒服！'
            }].slice(-10),
            lastUpdate: Date.now()
          };

          // 获得清洁经验
          setTimeout(() => {
            usePetStore.getState().gainExperience(5);
          }, 0);

          // 检查是否解锁清洁小能手成就
          if (!state.achievements['clean-freak']) {
            setTimeout(() => {
              usePetStore.getState().unlockAchievement('clean-freak');
            }, 0);
          }

          return newState;
        });
      },

      // 休息操作
      rest: () => {
        set((state) => {
          if (state.isSleeping) {
            return {
              isSleeping: false,
              actions: [...state.actions, {
                type: 'wake',
                timestamp: Date.now(),
                description: '醒来了！'
              }].slice(-10),
              lastUpdate: Date.now()
            };
          }
          return {
            isSleeping: true,
            actions: [...state.actions, {
              type: 'sleep',
              timestamp: Date.now(),
              description: '睡觉中...'
            }].slice(-10),
            lastUpdate: Date.now()
          };
        });
      },

      // 训练操作
      train: () => {
        set((state) => {
          if (state.energy < 30 || state.hunger > 70) {
            return state;
          }
          
          const newState: Partial<PetState> = {
            happiness: Math.max(state.happiness - 5, 0),
            energy: Math.max(state.energy - 30, 0),
            actions: [...state.actions, {
              type: 'train',
              timestamp: Date.now(),
              description: '训练完成！'
            }].slice(-10),
            lastUpdate: Date.now()
          };

          // 获得训练经验
          setTimeout(() => {
            usePetStore.getState().gainExperience(15);
          }, 0);

          // 检查是否解锁学习达人成就
          if (!state.achievements['study-master']) {
            setTimeout(() => {
              usePetStore.getState().unlockAchievement('study-master');
            }, 0);
          }

          return newState;
        });
      },

      // 治疗操作
      heal: () => {
        set((state) => {
          const newState: Partial<PetState> = {
            health: 100,
            isSick: false,
            actions: [...state.actions, {
              type: 'heal',
              timestamp: Date.now(),
              description: '治疗成功！'
            }].slice(-10),
            lastUpdate: Date.now()
          };

          // 获得治疗经验
          setTimeout(() => {
            usePetStore.getState().gainExperience(20);
          }, 0);

          // 检查是否解锁医生成就
          if (!state.achievements['pet-doctor']) {
            setTimeout(() => {
              usePetStore.getState().unlockAchievement('pet-doctor');
            }, 0);
          }

          return newState;
        });
      },

      // 互动系统 - 玩家与宠物的实时互动
      petInteract: (interactionType: 'pet' | 'doubleClick' | 'drag' | 'pat') => {
        set((state) => {
          if (state.isSleeping) {
            // 如果宠物在睡觉，只有抚摸可能唤醒它
            if (interactionType === 'pet') {
              // 30%的几率唤醒宠物
              const shouldWake = Math.random() < 0.3;
              if (shouldWake) {
                return {
                  ...state,
                  isSleeping: false,
                  happiness: Math.min(state.happiness + 5, 100),
                  actions: [...state.actions, {
                    type: 'interact',
                    timestamp: Date.now(),
                    description: '被抚摸醒了！'
                  }].slice(-10)
                };
              }
              return state;
            }
            return state;
          }
          
          const newState: Partial<PetState> = { ...state };
          let description = '';
          
          switch (interactionType) {
            case 'pet':
              // 抚摸宠物 - 增加心情值和少量经验
              newState.happiness = Math.min(newState.happiness! + 8, 100);
              description = '开心地被抚摸！';
              
              // 有几率获得额外经验
              if (Math.random() < 0.2) {
                setTimeout(() => {
                  usePetStore.getState().gainExperience(3);
                }, 0);
              }
              break;
            
            case 'doubleClick':
              // 双击宠物 - 增加更多心情值
              newState.happiness = Math.min(newState.happiness! + 15, 100);
              newState.energy = Math.max(newState.energy! - 5, 0);
              description = '兴奋地跳起来！';
              break;
            
            case 'drag':
              // 拖拽宠物 - 小幅度增加心情值，可能降低一点
              const isHappy = Math.random() > 0.3;
              newState.happiness = isHappy 
                ? Math.min(newState.happiness! + 5, 100) 
                : Math.max(newState.happiness! - 3, 0);
              description = isHappy ? '喜欢被拖动！' : '有点晕乎乎的...';
              break;
            
            case 'pat':
              // 轻拍宠物 - 增加心情值和一点健康值
              newState.happiness = Math.min(newState.happiness! + 10, 100);
              newState.health = Math.min(newState.health! + 2, 100);
              description = '被拍拍好舒服！';
              break;
          }
          
          // 记录互动
          newState.actions = [...state.actions, {
            type: 'interact',
            timestamp: Date.now(),
            description: description
          }].slice(-10);
          
          newState.lastUpdate = Date.now();
          
          // 检查是否解锁互动达人成就
          const interactionCount = newState.actions.filter(a => a.type === 'interact').length;
          if (interactionCount === 5 && !state.achievements['interaction-master']) {
            setTimeout(() => {
              usePetStore.getState().unlockAchievement('interaction-master');
            }, 0);
          }
          
          return newState;
        });
      },
      
      // 解锁成就
      unlockAchievement: (achievementId: string) => {
        set((state) => {
          if (state.achievements[achievementId]) {
            return state;
          }
          
          // 解锁成就时获得经验奖励
          const expReward = 50;
          let newExperience = state.experience + expReward;
          let newLevel = state.level;
          
          // 检查是否升级
          while (newExperience >= newLevel * 100) {
            newExperience -= newLevel * 100;
            newLevel += 1;
          }
          
          return {
            achievements: {
              ...state.achievements,
              [achievementId]: true
            },
            experience: newExperience,
            level: newLevel,
            actions: [...state.actions, {
              type: 'achievement',
              timestamp: Date.now(),
              description: `解锁成就，获得${expReward}经验值！`
            }].slice(-10)
          };
        });
      },

      // 获得经验值
      gainExperience: (amount: number) => {
        set((state) => {
          let newExperience = state.experience + amount;
          let newLevel = state.level;
          
          // 检查是否升级
          while (newExperience >= newLevel * 100) {
            newExperience -= newLevel * 100;
            newLevel += 1;
            
            // 升级时获得属性加成
            const newSkills = {
              ...state.skills,
              intelligence: Math.min(state.skills.intelligence + 2, 100),
              agility: Math.min(state.skills.agility + 2, 100),
              strength: Math.min(state.skills.strength + 2, 100),
              charm: Math.min(state.skills.charm + 2, 100)
            };
            
            return {
              ...state,
              experience: newExperience,
              level: newLevel,
              skills: newSkills,
              actions: [...state.actions, {
                type: 'levelup',
                timestamp: Date.now(),
                description: `升级了！现在是${newLevel}级`
              }].slice(-10)
            };
          }
          
          return {
            ...state,
            experience: newExperience
          };
        });
      },

      // 升级
      levelUp: () => {
        set((state) => {
          // 这个方法主要是为了手动升级，实际游戏中通常通过获得经验自动升级
          const newLevel = state.level + 1;
          const newSkills = {
            ...state.skills,
            intelligence: Math.min(state.skills.intelligence + 3, 100),
            agility: Math.min(state.skills.agility + 3, 100),
            strength: Math.min(state.skills.strength + 3, 100),
            charm: Math.min(state.skills.charm + 3, 100)
          };
          
          return {
            ...state,
            level: newLevel,
            skills: newSkills,
            actions: [...state.actions, {
              type: 'levelup',
              timestamp: Date.now(),
              description: `升级了！现在是${newLevel}级`
            }].slice(-10)
          };
        });
      },

      // 训练技能
      trainSkill: (skillName: keyof PetState['skills']) => {
        set((state) => {
          // 检查是否有足够的能量和饱食度
          if (state.energy < 40 || state.hunger > 60) {
            return state;
          }
          
          const newSkills = {
            ...state.skills,
            [skillName]: Math.min(state.skills[skillName] + 5, 100)
          };
          
          return {
            ...state,
            skills: newSkills,
            energy: Math.max(state.energy - 40, 0),
            hunger: Math.min(state.hunger + 15, 100),
            actions: [...state.actions, {
              type: 'train',
              timestamp: Date.now(),
              description: `训练${skillName}技能！`
            }].slice(-10),
            lastUpdate: Date.now()
          };
        });
      },

      // 更新状态
      updateState: () => {
        const now = Date.now();
        set((state) => {
          const timePassed = now - state.lastUpdate;
          const minutesPassed = timePassed / (1000 * 60);
          const hoursPassed = minutesPassed / 60;
          
          // 基础衰减率 - 考虑技能等级的影响
          const intelligenceFactor = 1 - (state.skills.intelligence / 100 * 0.3); // 智力减少衰减
          const charmFactor = 1 + (state.skills.charm / 100 * 0.2); // 魅力增加心情恢复
          
          // 计算衰减值
          const hungerDecay = DECAY_RATES.hunger * minutesPassed * intelligenceFactor;
          const healthDecay = DECAY_RATES.health * minutesPassed * intelligenceFactor;
          const happinessDecay = DECAY_RATES.happiness * minutesPassed * (1 / charmFactor);
          const energyDecay = DECAY_RATES.energy * minutesPassed;
          const cleanlinessDecay = DECAY_RATES.cleanliness * minutesPassed;
          
          // 计算新状态
          let newHunger = Math.max(state.hunger - hungerDecay, 0);
          const newHealth = Math.max(state.health - healthDecay, 0);
          const newHappiness = Math.max(state.happiness - happinessDecay, 0);
          let newEnergy = Math.max(state.energy - energyDecay, 0);
          const newCleanliness = Math.max(state.cleanliness - cleanlinessDecay, 0);
          
          // 如果在睡觉，能量恢复，饥饿增加
          if (state.isSleeping) {
            // 敏捷影响能量恢复速度
            const agilityFactor = 1 + (state.skills.agility / 100 * 0.5);
            newEnergy = Math.min(newEnergy + (minutesPassed * 3 * agilityFactor), 100);
            newHunger = Math.max(newHunger - (minutesPassed * 1.5), 0);
          }
          
          // 检查健康状态
          let isSick = state.isSick;
          let actions = [...state.actions];
          
          if (newHealth < 30 || newHunger === 0 || newCleanliness < 20) {
            if (!isSick) {
              isSick = true;
              actions.push({
                type: 'status',
                timestamp: now,
                description: `${state.name} 生病了！需要治疗。`
              });
              actions = actions.slice(-10); // 只保留最近10条记录
            }
          } else if (isSick) {
            isSick = false;
            actions.push({
              type: 'status',
              timestamp: now,
              description: `${state.name} 感觉好多了！`
            });
            actions = actions.slice(-10); // 只保留最近10条记录
          }
          
          // 更新年龄 (每24小时增加1岁)
          const newAge = Math.floor((now - state.lastUpdate) / (1000 * 60 * 60 * 24)) + state.age;
          
          // 年龄达到7天解锁资深宠物成就
          if (newAge >= 7 && !state.achievements['senior-pet']) {
            setTimeout(() => {
              usePetStore.getState().unlockAchievement('senior-pet');
            }, 0);
          }
          
          // 综合状态良好时获得额外经验
          if (newHunger > 70 && newHealth > 70 && newHappiness > 70 && newCleanliness > 70) {
            // 每小时获得额外经验
            if (timePassed > 0) {
              const bonusExp = Math.floor(hoursPassed * 3);
              if (bonusExp > 0) {
                setTimeout(() => {
                  usePetStore.getState().gainExperience(bonusExp);
                }, 0);
              }
            }
          }
          
          return {
            hunger: newHunger,
            health: newHealth,
            happiness: newHappiness,
            energy: newEnergy,
            cleanliness: newCleanliness,
            isSick: isSick,
            age: newAge,
            actions: actions,
            lastUpdate: now
          };
        });
      },

      // 重命名宠物
      renamePet: (name: string) => {
        set((state) => ({
          name: name.trim() || '小宠物',
          actions: [...state.actions, { type: 'rename', timestamp: Date.now(), description: `宠物改名为${name}` }].slice(-10)
        }));
      },

      // 初始化宠物
      initializePet: (name?: string, type?: string) => {
        set(() => ({
          name: name || '小宠物',
          type: type || '小猫',
          age: 0,
          hunger: 50,
          health: 100,
          happiness: 80,
          energy: 100,
          cleanliness: 100,
          isSleeping: false,
          isPlaying: false,
          isSick: false,
          lastUpdate: Date.now(),
          actions: [{ type: 'initialize', timestamp: Date.now(), description: '新宠物诞生！' }],
          achievements: {},
          skills: {
            intelligence: 10,
            agility: 10,
            strength: 10,
            charm: 10
          },
          level: 1,
          experience: 0
        }));
      }
    }),
    {
      name: 'pet-storage',
      partialize: (state) => ({
        name: state.name,
        type: state.type,
        age: state.age,
        hunger: state.hunger,
        health: state.health,
        happiness: state.happiness,
        energy: state.energy,
        cleanliness: state.cleanliness,
        isSleeping: state.isSleeping,
        isSick: state.isSick,
        lastUpdate: state.lastUpdate,
        actions: state.actions,
        achievements: state.achievements,
        skills: state.skills,
        level: state.level,
        experience: state.experience
      })
    }
  )
);