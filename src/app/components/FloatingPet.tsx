'use client'
import React, { useState, useEffect, useRef } from 'react';
import { usePetStore } from '../store/petStore';

const FloatingPet: React.FC = () => {
  const {
    name,
    isSleeping,
    isPlaying,
    isSick,
    hunger,
    health,
    happiness,
    updateState,
    feed,
    play,
    rest
  } = usePetStore();

  const [position, setPosition] = useState({ x: window.innerWidth - 120, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  
  const petRef = useRef<HTMLDivElement>(null);

  // 定期更新宠物状态
  useEffect(() => {
    const interval = setInterval(() => {
      updateState();
    }, 60000);

    return () => clearInterval(interval);
  }, [updateState]);

  // 拖动处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (petRef.current) {
      const rect = petRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  // 监听全局鼠标移动和释放事件
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const newX = e.clientX - offset.x;
          const newY = e.clientY - offset.y;
          
          // 限制在窗口范围内
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          const petWidth = 100;
          const petHeight = 120;
          
          setPosition({
            x: Math.max(0, Math.min(newX, windowWidth - petWidth)),
            y: Math.max(0, Math.min(newY, windowHeight - petHeight))
          });
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, offset]);

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

  // 获取状态工具提示
  const getTooltipContent = () => {
    const statuses = [
      `饱食度: ${Math.round(hunger)}`,
      `健康值: ${Math.round(health)}`,
      `心情值: ${Math.round(happiness)}`
    ];
    
    if (isSick) statuses.push('⚠️ 宠物生病了！');
    if (isSleeping) statuses.push('💤 宠物在睡觉');
    if (isPlaying) statuses.push('🎾 宠物在玩耍');
    
    return statuses.join('\n');
  };

  return (
    <div
      ref={petRef}
      className={`fixed z-50 w-24 h-30 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform duration-200 cursor-move ${isDragging ? 'scale-105' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowActions(!showActions)}
    >
      {/* 宠物表情 */}
      <div className="flex justify-center items-center h-20">
        <div className="text-5xl animate-bounce">{getPetEmotion()}</div>
      </div>
      
      {/* 宠物名字 */}
      <div className="text-center text-xs font-medium p-1 truncate">
        {name}
      </div>
      
      {/* 状态工具提示 */}
      {showTooltip && (
        <div className="absolute -right-40 top-0 w-36 bg-black text-white text-xs p-2 rounded whitespace-pre-line z-10 pointer-events-none">
          {getTooltipContent()}
        </div>
      )}
      
      {/* 快速操作菜单 */}
      {showActions && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 z-20 min-w-[120px]">
          <button 
            onClick={(e) => { e.stopPropagation(); feed(); }} 
            disabled={isSleeping}
            className={`block w-full text-left px-3 py-1.5 text-xs rounded ${isSleeping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            🍖 喂食
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); play(); }} 
            disabled={isSleeping}
            className={`block w-full text-left px-3 py-1.5 text-xs rounded ${isSleeping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            🎾 玩耍
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); rest(); }}
            className="block w-full text-left px-3 py-1.5 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            😴 {isSleeping ? '唤醒' : '睡觉'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingPet;