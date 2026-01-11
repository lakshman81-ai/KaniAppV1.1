import React, { useState, useRef } from 'react';

interface SpellWord {
  word: string;
  difficulty: string;
  hint: string;
  category: string;
  fillInBlank: string;
  worksheetNumber?: number;
}

interface SpellCheckScreenProps {
  onBack: () => void;
  playerName: string;
  mascotEmoji: string;
}

// Sample spell words (will be replaced with Google Sheets data)
const SAMPLE_SPELL_WORDS: SpellWord[] = [
  { word: 'elephant', difficulty: 'easy', hint: 'Large grey animal with a trunk', category: 'Animals', fillInBlank: 'ele____t', worksheetNumber: 4 },
  { word: 'beautiful', difficulty: 'medium', hint: 'Very pretty or attractive', category: 'Adjectives', fillInBlank: 'beau____ul', worksheetNumber: 4 },
  { word: 'difficult', difficulty: 'medium', hint: 'Not easy to do', category: 'Adjectives', fillInBlank: 'diffi____t', worksheetNumber: 4 },
  { word: 'favourite', difficulty: 'easy', hint: 'The one you like most', category: 'Adjectives', fillInBlank: 'favo____te', worksheetNumber: 4 },
  { word: 'knowledge', difficulty: 'hard', hint: 'What you learn and know', category: 'Nouns', fillInBlank: 'know____ge', worksheetNumber: 4 },
  { word: 'butterfly', difficulty: 'easy', hint: 'Colorful flying insect', category: 'Animals', fillInBlank: 'butt____ly', worksheetNumber: 4 },
  { word: 'chocolate', difficulty: 'easy', hint: 'Sweet brown treat', category: 'Food', fillInBlank: 'choc____te', worksheetNumber: 4 },
  { word: 'adventure', difficulty: 'medium', hint: 'An exciting journey', category: 'Nouns', fillInBlank: 'adven____e', worksheetNumber: 4 },
];

export default function SpellCheckScreen({ onBack, playerName, mascotEmoji }: SpellCheckScreenProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [spellMode, setSpellMode] = useState<'full' | 'fillIn'>('full');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = SAMPLE_SPELL_WORDS[currentWordIndex];

  // Speech synthesis for audio pronunciation
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(word);

      // Try to find Indian English voice
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(voice =>
        voice.lang.includes('en-IN') ||
        voice.name.includes('India') ||
        voice.name.includes('indian')
      );

      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      utterance.rate = 0.8; // Slower for kids
      utterance.pitch = 1.1;
      utterance.onend = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Check spelling answer
  const checkSpelling = () => {
    const isCorrect = userInput.toLowerCase().trim() === currentWord.word.toLowerCase();

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setTotalQuestions(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  // Next question
  const nextQuestion = () => {
    setFeedback(null);
    setUserInput('');
    setShowHint(false);

    if (currentWordIndex < SAMPLE_SPELL_WORDS.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setCurrentWordIndex(0); // Loop back
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.bgPattern}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.floatingLetter,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${20 + Math.random() * 30}px`,
              opacity: 0.1,
            }}
          >
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', '✏️', '📚', '🔤', '✨'][Math.floor(Math.random() * 12)]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <span>←</span>
        </button>
        <div style={styles.titleSection}>
          <span style={styles.titleIcon}>✏️</span>
          <h1 style={styles.mainTitle}>Spell Challenge</h1>
        </div>
        <div style={styles.streakBadge}>
          <span>🔥</span>
          <span>{streak}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span>⭐ {score}</span>
        </div>
        <div style={styles.statItem}>
          <span>📝 {totalQuestions}</span>
        </div>
        <div style={styles.statItem}>
          <span>🎯 {totalQuestions > 0 ? Math.round((score/totalQuestions)*100) : 0}%</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Progress */}
        <div style={styles.progressInfo}>
          <span>Word {currentWordIndex + 1} of {SAMPLE_SPELL_WORDS.length}</span>
        </div>

        {/* Category Badge */}
        <div style={styles.categoryBadge}>
          <span>{currentWord.category}</span>
        </div>

        {/* Audio Play Button */}
        <div style={styles.audioSection}>
          <div style={styles.audioWave}>
            {isPlaying && (
              <>
                <div style={{...styles.wave, animationDelay: '0s'}} />
                <div style={{...styles.wave, animationDelay: '0.1s'}} />
                <div style={{...styles.wave, animationDelay: '0.2s'}} />
              </>
            )}
          </div>
          <button
            style={{
              ...styles.playButton,
              ...(isPlaying ? styles.playButtonActive : {}),
            }}
            onClick={() => speakWord(currentWord.word)}
            disabled={isPlaying}
          >
            <span style={styles.playIcon}>{isPlaying ? '🔊' : '▶️'}</span>
            <span>{isPlaying ? 'Playing...' : 'Listen to the word'}</span>
          </button>
        </div>

        {/* Mode Toggle */}
        <div style={styles.modeToggle}>
          <button
            style={{
              ...styles.modeBtn,
              ...(spellMode === 'full' ? styles.modeBtnActive : {}),
            }}
            onClick={() => setSpellMode('full')}
          >
            Full Word
          </button>
          <button
            style={{
              ...styles.modeBtn,
              ...(spellMode === 'fillIn' ? styles.modeBtnActive : {}),
            }}
            onClick={() => setSpellMode('fillIn')}
          >
            Fill in Blanks
          </button>
        </div>

        {/* Fill in Blank Hint */}
        {spellMode === 'fillIn' && (
          <div style={styles.fillInHint}>
            <span style={styles.fillInText}>{currentWord.fillInBlank}</span>
          </div>
        )}

        {/* Input */}
        <div style={styles.inputSection}>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the spelling here..."
            style={{
              ...styles.input,
              ...(feedback === 'correct' ? styles.inputCorrect : {}),
              ...(feedback === 'incorrect' ? styles.inputIncorrect : {}),
            }}
            disabled={feedback !== null}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && userInput.trim() && !feedback) {
                checkSpelling();
              }
            }}
          />
        </div>

        {/* Hint Button */}
        {!feedback && (
          <button style={styles.hintBtn} onClick={() => setShowHint(true)}>
            <span>💡</span>
            <span>Need a hint?</span>
          </button>
        )}

        {/* Hint Display */}
        {showHint && !feedback && (
          <div style={styles.hintBox}>
            <span>💡 Hint: {currentWord.hint}</span>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div style={{
            ...styles.feedback,
            background: feedback === 'correct'
              ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
              : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
          }}>
            <span style={styles.feedbackEmoji}>
              {feedback === 'correct' ? '🎉' : '💪'}
            </span>
            <div style={styles.feedbackContent}>
              <p style={{
                ...styles.feedbackTitle,
                color: feedback === 'correct' ? '#2e7d32' : '#c62828',
              }}>
                {feedback === 'correct' ? 'Perfect!' : 'Not quite!'}
              </p>
              <p style={styles.feedbackText}>
                <strong>Correct spelling:</strong> {currentWord.word}
              </p>
              {feedback === 'correct' && streak >= 3 && (
                <div style={styles.streakAlert}>
                  🔥 {streak} in a row! You're on fire!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          {!feedback ? (
            <button
              style={{
                ...styles.submitBtn,
                opacity: userInput.trim() ? 1 : 0.5,
              }}
              onClick={checkSpelling}
              disabled={!userInput.trim()}
            >
              <span>Check Spelling</span>
              <span>✓</span>
            </button>
          ) : (
            <button style={styles.nextBtn} onClick={nextQuestion}>
              <span>Next Word</span>
              <span>→</span>
            </button>
          )}
        </div>

        {/* Helper Mascot */}
        <div style={styles.helperMascot}>
          <span style={styles.mascotIcon}>{mascotEmoji}</span>
          <div style={styles.mascotBubble}>
            {!feedback && `Keep going, ${playerName}!`}
            {feedback === 'correct' && 'Great job!'}
            {feedback === 'incorrect' && 'Try again!'}
          </div>
        </div>
      </div>

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.2; }
  }
  @keyframes wave {
    0%, 100% { transform: scaleY(0.5); }
    50% { transform: scaleY(1); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%, #f8bbd0 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Nunito', 'Quicksand', sans-serif",
  },

  bgPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },

  floatingLetter: {
    position: 'absolute',
    animation: 'float 6s ease-in-out infinite',
    fontWeight: '700',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 10,
  },

  backBtn: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#ffc107',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 4px 15px rgba(255, 193, 7, 0.4)',
    color: '#fff',
    fontWeight: 'bold',
  },

  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  titleIcon: {
    fontSize: '32px',
  },

  mainTitle: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ab47bc 0%, #7c4dff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  },

  streakBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
  },

  statsBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 10,
  },

  statItem: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '12px',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: '#7c4dff',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },

  mainContent: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '30px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    zIndex: 10,
  },

  progressInfo: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    fontWeight: '600',
  },

  categoryBadge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #7c4dff 0%, #ab47bc 100%)',
    color: '#fff',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '20px',
  },

  audioSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
  },

  audioWave: {
    display: 'flex',
    gap: '5px',
    height: '40px',
    alignItems: 'center',
  },

  wave: {
    width: '4px',
    height: '100%',
    background: '#7c4dff',
    borderRadius: '2px',
    animation: 'wave 0.6s ease-in-out infinite',
  },

  playButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #7c4dff 0%, #ab47bc 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(124, 77, 255, 0.4)',
    transition: 'all 0.3s ease',
  },

  playButtonActive: {
    animation: 'pulse 1s ease-in-out infinite',
  },

  playIcon: {
    fontSize: '24px',
  },

  modeToggle: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
  },

  modeBtn: {
    flex: 1,
    padding: '10px 20px',
    background: 'rgba(124, 77, 255, 0.1)',
    border: '2px solid rgba(124, 77, 255, 0.3)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#7c4dff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  modeBtnActive: {
    background: 'linear-gradient(135deg, #7c4dff 0%, #ab47bc 100%)',
    color: '#fff',
    borderColor: 'transparent',
    boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
  },

  fillInHint: {
    textAlign: 'center',
    marginBottom: '20px',
  },

  fillInText: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#7c4dff',
    letterSpacing: '4px',
  },

  inputSection: {
    marginBottom: '20px',
  },

  input: {
    width: '100%',
    padding: '15px 20px',
    fontSize: '20px',
    fontWeight: '600',
    border: '3px solid #e0e0e0',
    borderRadius: '12px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },

  inputCorrect: {
    borderColor: '#4caf50',
    background: '#e8f5e9',
  },

  inputIncorrect: {
    borderColor: '#f44336',
    background: '#ffebee',
  },

  hintBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'rgba(255, 152, 0, 0.1)',
    border: '2px solid rgba(255, 152, 0, 0.3)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#ff9800',
    cursor: 'pointer',
    margin: '0 auto 15px',
  },

  hintBox: {
    background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#e65100',
    fontWeight: '600',
    textAlign: 'center',
    borderLeft: '4px solid #ffc107',
  },

  feedback: {
    padding: '20px',
    borderRadius: '16px',
    marginBottom: '20px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },

  feedbackEmoji: {
    fontSize: '48px',
  },

  feedbackContent: {
    flex: 1,
  },

  feedbackTitle: {
    fontSize: '20px',
    fontWeight: '800',
    margin: '0 0 5px 0',
  },

  feedbackText: {
    fontSize: '16px',
    margin: 0,
    color: '#333',
  },

  streakAlert: {
    marginTop: '10px',
    padding: '8px 12px',
    background: 'rgba(255, 107, 53, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#ff6b35',
  },

  actions: {
    display: 'flex',
    justifyContent: 'center',
  },

  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 40px',
    background: 'linear-gradient(135deg, #7c4dff 0%, #ab47bc 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(124, 77, 255, 0.4)',
    transition: 'all 0.3s ease',
  },

  nextBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 40px',
    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
  },

  helperMascot: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '30px',
    justifyContent: 'center',
  },

  mascotIcon: {
    fontSize: '40px',
  },

  mascotBubble: {
    background: 'rgba(124, 77, 255, 0.1)',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#7c4dff',
  },
};
