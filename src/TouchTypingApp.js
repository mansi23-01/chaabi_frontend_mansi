import React, { useState, useEffect } from 'react';

const TouchTypingApp = () => {
  const [currentKey, setCurrentKey] = useState('');
  const [nextKey, setNextKey] = useState('');
  const [keysPressed, setKeysPressed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timer, setTimer] = useState(300);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [paragraph, setParagraph] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(0);

  useEffect(() => {
    setParagraph(generateParagraph());
  }, []);

  useEffect(() => {
    if (practiceStarted) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(interval);
            setShowResults(true);
            calculateTypingSpeed();
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [practiceStarted]);

  useEffect(() => {
    setNextKey(paragraph[keysPressed]);
  }, [paragraph, keysPressed]);

  const handleStart = () => {
    setPracticeStarted(true);
    setNextKey(paragraph[0]);
  };

  const handleKeyPress = (event) => {
    const { key } = event;

    if (!practiceStarted) {
      setPracticeStarted(true);
      setNextKey(paragraph[0]);
    }

    if (key === nextKey) {
      setCurrentKey(key);
      setKeysPressed((prevKeysPressed) => prevKeysPressed + 1);

      if (keysPressed === paragraph.length - 1) {
        setShowResults(true);
        calculateTypingSpeed();
      }
    } else {
      setAccuracy((prevAccuracy) => prevAccuracy - 1);
    }
  };

  const generateParagraph = () => {
    return 'The quick brown fox jumps over the lazy dog.';
  };

  const calculateTypingSpeed = () => {
    const timeInMinutes = (300 - timer) / 60;
    const wordsTyped = paragraph.trim().split(' ').length;
    const typingSpeed = Math.round(wordsTyped / timeInMinutes);
    setTypingSpeed(typingSpeed);
  };

  const handleRestart = () => {
    setCurrentKey('');
    setNextKey('');
    setKeysPressed(0);
    setAccuracy(100);
    setTimer(300);
    setPracticeStarted(false);
    setParagraph(generateParagraph());
    setShowResults(false);
  };

  return (
    <div className='main'>
      <h1 className='heading'>Touch Typing Practice</h1>
      {!practiceStarted && !showResults && (
        <div className='center'>
        <button className='startbtn' onClick={handleStart}>Start</button>
        </div>
      )}
      {!showResults && practiceStarted && (
        <div className='activity'>
          <div>
            <p>Time remaining: {timer} seconds</p>
            <p>Keys pressed: {keysPressed}</p>
            <p>Accuracy: {accuracy}%</p>
          </div>
          <div>
            <p>Current key: {currentKey}</p>
            <p>Next key: {nextKey}</p>
          </div>
          <div className='paragraph'>
            <p>{paragraph}</p>
          </div>
          <div>
            <input
              type="text"
              onKeyPress={handleKeyPress}
              autoFocus
              readOnly={!practiceStarted}
              className='input'
            />
          </div>
        </div>
      )}
      {showResults && (
        <div className="results-popup">
          <h2>Practice Completed</h2>
          <p>Accuracy: {accuracy}%</p>
          <p>Typing Speed: {typingSpeed} words per minute</p>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default TouchTypingApp;
