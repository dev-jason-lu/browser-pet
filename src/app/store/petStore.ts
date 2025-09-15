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
  
  // 状态更新
  updateState: () => void;
  renamePet: (name: string) => void;
  
  // 初始化宠物
  initializePet: (name?: string, type?: string) => void;
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
      actions: [],

      // 喂食操作
      feed: () => {
        set((state) => ({
          hunger: Math.min(state.hunger + 20, 100),
          health: Math.min(state.health + 5, 100),
          actions: [...state.actions, {
            type: 'feed',
            timestamp: Date.now(),
            description: '喂食成功！'
          }].slice(-10), // 只保留最近10条记录
          lastUpdate: Date.now()
        }));
      },

      // 玩耍操作
      play: () => {
        set((state) => {
          if (state.energy < 20) {
            return state;
          }
          return {
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
        });
        
        // 3秒后结束玩耍状态
        setTimeout(() => {
          set(() => ({ isPlaying: false }));
        }, 3000);
      },

      // 清洁操作
      clean: () => {
        set((state) => ({
          cleanliness: 100,
          health: Math.min(state.health + 10, 100),
          actions: [...state.actions, {
            type: 'clean',
            timestamp: Date.now(),
            description: '洗澡真舒服！'
          }].slice(-10),
          lastUpdate: Date.now()
        }));
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
          return {
            happiness: Math.max(state.happiness - 5, 0),
            energy: Math.max(state.energy - 30, 0),
            actions: [...state.actions, {
              type: 'train',
              timestamp: Date.now(),
              description: '训练完成！'
            }].slice(-10),
            lastUpdate: Date.now()
          };
        });
      },

      // 治疗操作
      heal: () => {
        set((state) => ({
          health: 100,
          isSick: false,
          actions: [...state.actions, {
            type: 'heal',
            timestamp: Date.now(),
            description: '治疗成功！'
          }].slice(-10),
          lastUpdate: Date.now()
        }));
      },

      // 更新状态
      updateState: () => {
        const now = Date.now();
        set((state) => {
          const timePassed = now - state.lastUpdate;
          const minutesPassed = timePassed / (1000 * 60);
          
          // 计算衰减值
          const hungerDecay = DECAY_RATES.hunger * minutesPassed;
          const healthDecay = DECAY_RATES.health * minutesPassed;
          const happinessDecay = DECAY_RATES.happiness * minutesPassed;
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
            newEnergy = Math.min(newEnergy + (minutesPassed * 3), 100);
            newHunger = Math.max(newHunger - (minutesPassed * 1.5), 0);
          }
          
          // 检查健康状态
          const isSick = newHealth < 30 || newHunger === 0 || newCleanliness < 20;
          
          // 更新年龄 (每24小时增加1岁)
          const newAge = Math.floor((now - state.lastUpdate) / (1000 * 60 * 60 * 24)) + state.age;
          
          return {
            hunger: newHunger,
            health: newHealth,
            happiness: newHappiness,
            energy: newEnergy,
            cleanliness: newCleanliness,
            isSick: isSick,
            age: newAge,
            lastUpdate: now
          };
        });
      },

      // 重命名宠物
      renamePet: (name: string) => {
        set(() => ({
          name: name.trim() || '小宠物',
          actions: [{ type: 'rename', timestamp: Date.now(), description: `宠物改名为${name}` }]
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
          actions: [{ type: 'initialize', timestamp: Date.now(), description: '新宠物诞生！' }]
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
        actions: state.actions
      })
    }
  )
);