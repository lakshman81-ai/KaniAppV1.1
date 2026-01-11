import type { Question, Topic } from '../types';

// Google Sheets URLs for each module (placeholders - will be replaced with actual URLs)
export const SHEET_URLS = {
  space: 'PLACEHOLDER_SPACE_SHEET_URL',
  geography: 'PLACEHOLDER_GEOGRAPHY_SHEET_URL',
  math: 'PLACEHOLDER_MATH_SHEET_URL',
  spell: 'PLACEHOLDER_SPELL_CHECK_SHEET_URL',
};

// Topics configuration with Google Sheets URLs and worksheet numbers
export const TOPICS: Topic[] = [
  {
    id: 'space',
    name: 'Space',
    icon: '🚀',
    color: '#4dd0e1',
    difficulty: 'Easy',
    solved: 0,
    total: 10,
    sheetUrl: SHEET_URLS.space,
    worksheetNumber: 1, // Worksheet 1
    worksheetGid: '0', // Default first worksheet GID (0)
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    color: '#66bb6a',
    difficulty: 'Medium',
    solved: 0,
    total: 8,
    sheetUrl: SHEET_URLS.geography,
    worksheetNumber: 2, // Worksheet 2
    worksheetGid: undefined, // Will use default or extract from URL
  },
  {
    id: 'math',
    name: 'Math',
    icon: '🔢',
    color: '#ffa726',
    difficulty: 'Hard',
    solved: 0,
    total: 12,
    sheetUrl: SHEET_URLS.math,
    worksheetNumber: 3, // Worksheet 3
    worksheetGid: undefined, // Will use default or extract from URL
  },
  {
    id: 'spell',
    name: 'Spell Check',
    icon: '✏️',
    color: '#ab47bc',
    difficulty: 'Medium',
    solved: 0,
    total: 7,
    sheetUrl: SHEET_URLS.spell,
    worksheetNumber: 4, // Worksheet 4
    worksheetGid: undefined, // Will use default or extract from URL
  },
];

/**
 * Build CSV URL with worksheet GID parameter
 */
function buildCsvUrlWithWorksheet(baseUrl: string, worksheetGid?: string): string {
  // Extract GID from existing URL if present
  const gidMatch = baseUrl.match(/[?&]gid=(\d+)/);
  const existingGid = gidMatch ? gidMatch[1] : null;

  // Use provided GID, or existing GID, or default to '0' (first worksheet)
  const gid = worksheetGid || existingGid || '0';

  // Handle different Google Sheets URL formats
  if (baseUrl.includes('/pub?')) {
    // Published sheet format: ensure gid and output=csv are present
    if (baseUrl.includes('gid=')) {
      // Replace existing gid
      return baseUrl.replace(/gid=\d+/, `gid=${gid}`);
    } else {
      // Add gid parameter
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}gid=${gid}&single=true&output=csv`;
    }
  } else if (baseUrl.includes('/export')) {
    // Export format
    if (baseUrl.includes('gid=')) {
      // Replace existing gid
      return baseUrl.replace(/gid=\d+/, `gid=${gid}`);
    } else {
      // Add gid parameter
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}gid=${gid}`;
    }
  } else if (baseUrl.includes('/edit')) {
    // Convert edit URL to export format with gid
    const sheetId = baseUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (sheetId) {
      return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }
  }

  // Default: return URL as-is and hope for the best
  return baseUrl;
}

/**
 * Parse CSV data from Google Sheets into Question objects
 */
function parseCSVToQuestions(csvText: string, topicId: string): Question[] {
  const lines = csvText.trim().split('\n');
  const questions: Question[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (basic parsing, may need enhancement for complex cases)
    const parts = line.split(',').map(part => part.trim().replace(/^"|"$/g, ''));

    if (parts.length >= 6) {
      const [questionText, answerA, answerB, answerC, answerD, correctAnswer, note] = parts;

      questions.push({
        id: `${topicId}-q${i}`,
        text: questionText,
        note: note || undefined,
        answers: [
          { id: 'A', text: answerA },
          { id: 'B', text: answerB },
          { id: 'C', text: answerC },
          { id: 'D', text: answerD },
        ],
        correctAnswer: correctAnswer.toUpperCase(),
        topic: topicId,
      });
    }
  }

  return questions;
}

/**
 * Fetch questions from Google Sheets for a specific topic
 */
export async function fetchQuestionsFromSheet(topic: Topic): Promise<Question[]> {
  try {
    // Check if the URL is still a placeholder
    if (topic.sheetUrl.startsWith('PLACEHOLDER_')) {
      console.warn(`Google Sheets URL for ${topic.name} is still a placeholder. Using sample data.`);
      return getSampleQuestions(topic.id);
    }

    // Build CSV URL with worksheet GID
    let csvUrl = buildCsvUrlWithWorksheet(topic.sheetUrl, topic.worksheetGid);

    // Log which worksheet is being loaded
    const worksheetInfo = topic.worksheetNumber
      ? `Worksheet ${topic.worksheetNumber}`
      : topic.worksheetGid
        ? `GID ${topic.worksheetGid}`
        : 'default worksheet';
    console.log(`Loading ${topic.name} from ${worksheetInfo}`);

    // Add cache busting parameter
    const url = csvUrl + (csvUrl.includes('?') ? '&' : '?') + 't=' + Date.now();

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch from Google Sheets`);
    }

    const csvText = await response.text();
    const questions = parseCSVToQuestions(csvText, topic.id);

    if (questions.length === 0) {
      throw new Error('No questions found in the sheet');
    }

    console.log(`Successfully loaded ${questions.length} questions for ${topic.name} from ${worksheetInfo}`);
    return questions;
  } catch (error) {
    console.error(`Error fetching questions for ${topic.name}:`, error);
    // Fallback to sample questions
    return getSampleQuestions(topic.id);
  }
}

/**
 * Get sample questions for testing (used when Google Sheets URL is not configured)
 */
function getSampleQuestions(topicId: string): Question[] {
  const sampleQuestions: Record<string, Question[]> = {
    space: [
      {
        id: 'space-q1',
        text: 'Who took Lily and Max on their space trip?',
        note: 'Read the story carefully before answering.',
        answers: [
          { id: 'A', text: 'Captain Star' },
          { id: 'B', text: 'Emma' },
          { id: 'C', text: 'Jake' },
          { id: 'D', text: 'Columbus' },
        ],
        correctAnswer: 'A',
        topic: 'space',
      },
      {
        id: 'space-q2',
        text: 'What planet is known as the Red Planet?',
        answers: [
          { id: 'A', text: 'Venus' },
          { id: 'B', text: 'Mars' },
          { id: 'C', text: 'Jupiter' },
          { id: 'D', text: 'Saturn' },
        ],
        correctAnswer: 'B',
        topic: 'space',
      },
    ],
    geography: [
      {
        id: 'geography-q1',
        text: 'What is the capital of France?',
        answers: [
          { id: 'A', text: 'London' },
          { id: 'B', text: 'Berlin' },
          { id: 'C', text: 'Paris' },
          { id: 'D', text: 'Madrid' },
        ],
        correctAnswer: 'C',
        topic: 'geography',
      },
    ],
    math: [
      {
        id: 'math-q1',
        text: 'What is 12 + 8?',
        answers: [
          { id: 'A', text: '18' },
          { id: 'B', text: '20' },
          { id: 'C', text: '22' },
          { id: 'D', text: '24' },
        ],
        correctAnswer: 'B',
        topic: 'math',
      },
    ],
    spell: [
      {
        id: 'spell-q1',
        text: 'Which word is spelled correctly?',
        note: 'Look carefully at each spelling before choosing.',
        answers: [
          { id: 'A', text: 'Beatiful' },
          { id: 'B', text: 'Beautiful' },
          { id: 'C', text: 'Beutiful' },
          { id: 'D', text: 'Beautifull' },
        ],
        correctAnswer: 'B',
        topic: 'spell',
      },
    ],
  };

  return sampleQuestions[topicId] || [];
}
