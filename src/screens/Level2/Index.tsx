import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomePage from '../../components/Level2/HomePage';
import GameInterface from '../../components/Level2/GameInterface';
import { gameModes } from '../../data/Level2/gameModes';
import { GameMode } from '../../types/Level2/types';
import '../../components/Level2/index.css';

const Level2: React.FC = () => {
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();

  const handleGameModeSelect = (modeId: string) => {
    const gameMode = gameModes.find(mode => mode.id === modeId);
    if (gameMode) {
      setSelectedGameMode(gameMode);
    }
  };

  const handleBackToHome = () => {
    setSelectedGameMode(null);
  };

  const handleExitToModules = () => {
    navigate('/modules/1');
  };

  const handleNextLevel = () => {
    // Navigate to Level 3
    navigate(`/modules/${moduleId}/levels/3`);
  };

  if (selectedGameMode) {
    return (
      <GameInterface
        gameMode={selectedGameMode}
        moduleId={moduleId || '1'}
        onBack={handleBackToHome}
        onNextLevel={handleNextLevel}
      />
    );
  }

  return (
    <HomePage
      onGameModeSelect={handleGameModeSelect}
      onExit={handleExitToModules}
    />
  );
};

export default Level2;
