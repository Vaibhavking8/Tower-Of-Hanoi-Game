import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Sound effects component
const useSound = () => {
  const [audio, setAudio] = useState({
    background: null,
    pickup: null,
    drop: null,
    win: null
  });

  useEffect(() => {
    // Create audio elements
    const backgroundMusic = new Audio('/audio/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    const newAudio = {
      background: backgroundMusic,
      pickup: new Audio('/audio/pickup.mp3'),
      drop: new Audio('/audio/drop.mp3'),
      win: new Audio('/audio/win.mp3')
    };

    setAudio(newAudio);

    // Start playing background music immediately
    backgroundMusic.play().catch(e => console.log('Background music autoplay failed:', e));

    return () => {
      // Cleanup audio on unmount
      Object.values(newAudio).forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
    };
  }, []); 

  const playSound = useCallback((type) => {
    if (audio[type]) {
      audio[type].currentTime = 0;
      audio[type].play().catch(e => console.log('Audio play failed:', e));
    }
  }, [audio]);

  const stopSound = useCallback((type) => {
    if (audio[type]) {
      audio[type].pause();
      audio[type].currentTime = 0;
    }
  }, [audio]);

  return { audio, playSound, stopSound };
};

// Disk component with sound effects
const Disk = ({ size, canDrag, towerIndex, diskIndex, onPickup }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'DISK',
    item: () => {
      onPickup(); // Play pickup sound
      return { size, towerIndex, diskIndex };
    },
    canDrag: canDrag,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`
        disk 
        transform transition-all duration-200 ease-in-out 
        hover:scale-105 
        ${isDragging ? 'scale-110 rotate-3 shadow-lg' : 'hover:brightness-110'}
        cursor-grab active:cursor-grabbing
      `}
      style={{
        width: `${size * 40}px`,
        height: '25px',
        backgroundColor: `hsl(${size * 30}, 70%, 50%)`,
        margin: '0 auto',
        borderRadius: '10px',
        boxShadow: isDragging 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        opacity: isDragging ? 0.7 : 1,
      }}
    />
  );
};

// Tower component with sound effects
const Tower = ({ 
  disks, 
  towerIndex, 
  moveDisk, 
  canDropDisk,
  onDrop
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'DISK',
    drop: (item) => {
      if (canDropDisk(item.size, towerIndex)) {
        moveDisk(item.towerIndex, towerIndex);
        onDrop(); // Play drop sound
      }
    },
    canDrop: (item) => canDropDisk(item.size, towerIndex),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div 
      ref={drop} 
      className={`
        tower 
        transition-all duration-300 ease-in-out
        border-4 border-gray-700 rounded-lg
        ${isOver ? 'bg-green-100 scale-105' : 'bg-gray-100'}
        ${canDrop ? 'border-green-500' : 'border-gray-700'}
      `}
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: '250px',
        minHeight: '350px',
        margin: '0 15px',
        padding: '15px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray-800 h-4 w-full rounded-b-lg" />
      
      {disks.map((size, diskIndex) => (
        <Disk 
          key={diskIndex} 
          size={size}
          towerIndex={towerIndex}
          diskIndex={diskIndex}
          canDrag={disks[disks.length - 1] === size}
          onPickup={() => {}} // Will be passed from parent
        />
      ))}
    </div>
  );
};

// Main Tower of Hanoi Game Component
const TowerOfHanoi = () => {
  const [numDisks, setNumDisks] = useState(4);
  const [towers, setTowers] = useState(() => createInitialTowers(numDisks));
  const [moveCount, setMoveCount] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { audio, playSound, stopSound } = useSound();

  function createInitialTowers(diskCount) {
    return Array.from({ length: 3 }, (_, i) => 
      i === 0 ? Array.from({ length: diskCount }, (_, j) => diskCount - j) : []
    );
  }

  useEffect(() => {
    // Handle mute state changes
    if (isMuted) {
      if (audio?.background) {
        audio.background.pause();
      }
    } else {
      if (audio?.background) {
        audio.background.play().catch(e => console.log('Background music play failed:', e));
      }
    }
  }, [isMuted, audio]);

  useEffect(() => {
    if (towers[2].length === numDisks) {
      setIsGameWon(true);
      if (!isMuted) {
        playSound('win');
      }
    }
  }, [towers, numDisks, playSound, isMuted]);

  const canDropDisk = (diskSize, targetTowerIndex) => {
    const targetTower = towers[targetTowerIndex];
    return targetTower.length === 0 || diskSize < targetTower[targetTower.length - 1];
  };

  const moveDisk = (sourceTowerIndex, targetTowerIndex) => {
    if (sourceTowerIndex === targetTowerIndex) return;

    setTowers(prevTowers => {
      const newTowers = prevTowers.map(tower => [...tower]);
      const diskToMove = newTowers[sourceTowerIndex][newTowers[sourceTowerIndex].length - 1];
      newTowers[sourceTowerIndex].pop();
      newTowers[targetTowerIndex].push(diskToMove);
      return newTowers;
    });

    setMoveCount(prevCount => prevCount + 1);
  };

  const resetGame = () => {
    setTowers(createInitialTowers(numDisks));
    setMoveCount(0);
    setIsGameWon(false);
  };

  const handleDiskCountChange = (e) => {
    const newDiskCount = parseInt(e.target.value, 10);
    setNumDisks(newDiskCount);
    setTowers(createInitialTowers(newDiskCount));
    setMoveCount(0);
    setIsGameWon(false);
  };

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);


  return (
    <div className="tower-of-hanoi-game bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-800 tracking-tight">
            Tower of Hanoi
          </h1>
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <label 
            htmlFor="disk-slider" 
            className="text-lg font-semibold text-gray-700 mb-3"
          >
            Number of Disks: <span className="text-blue-600">{numDisks}</span>
          </label>
          <input 
            id="disk-slider"
            type="range" 
            min="2"
            max="5"
            value={numDisks}
            onChange={handleDiskCountChange}
            className="w-32 h-3 bg-blue-200 rounded-full appearance-none cursor-pointer"
          />
        </div>

        <div className="flex justify-center mb-8">
          {towers.map((disks, index) => (
            <Tower
              key={index}
              disks={disks}
              towerIndex={index}
              moveDisk={moveDisk}
              canDropDisk={canDropDisk}
              onDrop={() => !isMuted && playSound('drop')}
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-xl font-medium text-gray-700 mb-4">
            Moves: <span className="text-blue-600 font-bold">{moveCount}</span>
          </p>
          {isGameWon && (
            <div className="animate-bounce">
              <p className="text-2xl font-bold text-green-600 mb-4">
                Congratulations! You solved the puzzle!
              </p>
              <button 
                onClick={resetGame}
                className="
                  bg-blue-500 text-white 
                  px-6 py-3 rounded-full 
                  hover:bg-blue-600 
                  transition-colors duration-300
                  shadow-md hover:shadow-lg
                "
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TowerOfHanoiGame = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <TowerOfHanoi />
    </DndProvider>
  );
};

export default TowerOfHanoiGame;