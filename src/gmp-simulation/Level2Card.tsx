
import React, { useState } from 'react';
import { Timer } from './Timer';
import Level2Screen1_CaseSelection from './level2/Level2Screen1_CaseSelection';
import Level2Screen2 from './level2/Level2Screen2';
import Level2Screen3 from './level2/Level2Screen3';
import Level2Screen4 from './level2/Level2Screen4';

interface TeamMember {
  name: string;
  email: string;
}

interface Level2CardProps {
  teamName: string;
  teamMembers: TeamMember[];
}


const INITIAL_TIME = 10800; // 180 minutes in seconds

const Level2Card: React.FC<Level2CardProps> = ({ teamName, teamMembers }) => {
  const [screen, setScreen] = useState(1);
  const [selectedCases, setSelectedCases] = useState<{ [email: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(true);

  const handleSelectCase = (email: string, caseId: number) => {
    setSelectedCases((prev) => ({ ...prev, [email]: caseId }));
  };

  const handleContinue = () => {
    setScreen((s) => s + 1);
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    // Optionally, handle what happens when time is up (e.g., auto-submit, show modal, etc.)
    // alert('Time is up!');
  };

  // Show timer at the top of every screen
  const timerDisplay = (
    <div className="w-full flex justify-center items-center py-2 bg-gray-900">
      <span className="text-xs text-gray-400 mr-2">Time Remaining:</span>
      <Timer
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        initialTime={INITIAL_TIME}
        onTimeUp={handleTimeUp}
        isActive={timerActive}
      />
    </div>
  );

  if (screen === 1) {
    return (
      <>
        {timerDisplay}
        <Level2Screen1_CaseSelection
          teamName={teamName}
          teamMembers={teamMembers}
          selectedCases={selectedCases}
          onSelectCase={handleSelectCase}
          onContinue={handleContinue}
        />
      </>
    );
  }
  if (screen === 2) return <>{timerDisplay}<Level2Screen2 /></>;
  if (screen === 3) return <>{timerDisplay}<Level2Screen3 /></>;
  if (screen === 4) return <>{timerDisplay}<Level2Screen4 /></>;
  return null;
};

export default Level2Card;
