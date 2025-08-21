import React from 'react';


import { useState } from 'react';

const Level2Screen3: React.FC = () => {
  const [ideaLine, setIdeaLine] = useState('');
  const [problem, setProblem] = useState('');
  const [technology, setTechnology] = useState('');
  const [collaboration, setCollaboration] = useState('');
  const [creativity, setCreativity] = useState('');
  const [speedScale, setSpeedScale] = useState('');
  const [impact, setImpact] = useState('');
  const [reflection, setReflection] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Innovation Template</h2>
      <p className="mb-2 text-slate-300">(Technology – Collaboration – Creativity – Speed – Impact)</p>
      <div className="mb-6">
        <label className="block font-semibold mb-1">Write your idea in one line:</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-slate-800 border border-slate-700 mb-2"
          placeholder="I want to solve ___ for ___ by ___."
          value={ideaLine}
          onChange={e => setIdeaLine(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">1. Problem You Are Solving:</label>
        <textarea
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          placeholder="What issue or need are you addressing? Who faces this problem?"
          value={problem}
          onChange={e => setProblem(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">2. Technology You Can Use:</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          placeholder="What tool, app, software, machine, or digital aid can make your solution stronger?"
          value={technology}
          onChange={e => setTechnology(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">3. Collaboration Angle:</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          placeholder="Who can you team up with to make this idea bigger?"
          value={collaboration}
          onChange={e => setCollaboration(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">4. Creativity Twist:</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          placeholder="What unique feature, design, or new approach makes your idea stand out?"
          value={creativity}
          onChange={e => setCreativity(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">5. Speed & Scale:</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          placeholder="How can your solution be applied quickly? Can it be scaled to help many people?"
          value={speedScale}
          onChange={e => setSpeedScale(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">6. Purpose & Impact:</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          placeholder="How does your idea create value? (Social, environmental, educational, or economic impact?)"
          value={impact}
          onChange={e => setImpact(e.target.value)}
        />
      </div>
      <div className="mb-6 p-4 bg-slate-800 rounded">
        <label className="block font-semibold mb-2">7. Final Statement</label>
        <div className="italic text-slate-200">
          Our innovation solves <span className="underline">{problem || '______'}</span> by using (<span className="underline">{technology || 'technology'}</span>), built with (<span className="underline">{collaboration || 'collaboration'}</span>), adding (<span className="underline">{creativity || 'creative twist'}</span>). It can grow with (<span className="underline">{speedScale || 'speed & scale'}</span>) and will create (<span className="underline">{impact || 'purpose/impact'}</span>).
        </div>
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-1">8. Prototype/Demo/Sketch (PDF upload):</label>
        <input
          type="file"
          accept="application/pdf"
          className="block mt-2"
          onChange={handleFileChange}
        />
        {file && <span className="text-green-400 ml-2">{file.name} selected</span>}
      </div>
      <div className="mb-8">
        <label className="block font-semibold mb-1">9. Reflection (what did you learn, what would you improve?):</label>
        <textarea
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          placeholder="Your reflection..."
          value={reflection}
          onChange={e => setReflection(e.target.value)}
        />
      </div>
      {/* You can add a submit button and logic as needed */}
    </div>
  );
};

export default Level2Screen3;
