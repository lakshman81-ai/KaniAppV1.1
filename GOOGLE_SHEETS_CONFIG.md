# Google Sheets Configuration Guide

This document explains how to configure Google Sheets URLs for the 4 quiz modules with worksheet support.

## Overview

The Super Quiz application now supports 4 different modules, each with its own Google Sheets data source and specific worksheet:

1. **Space** 🚀 (Easy difficulty) - Worksheet 1
2. **Geography** 🌍 (Medium difficulty) - Worksheet 2
3. **Math** 🔢 (Hard difficulty) - Worksheet 3
4. **Spell Check** ✏️ (Medium difficulty) - Worksheet 4

Each module can load data from a specific worksheet/tab within a Google Sheet.

## Configuring Google Sheets URLs

### Step 1: Update the Placeholder URLs

Open `/services/googleSheetsService.ts` and replace the placeholder URLs with your actual Google Sheets URLs:

```typescript
export const SHEET_URLS = {
  space: 'YOUR_SPACE_GOOGLE_SHEET_URL_HERE',
  geography: 'YOUR_GEOGRAPHY_GOOGLE_SHEET_URL_HERE',
  math: 'YOUR_MATH_GOOGLE_SHEET_URL_HERE',
  spell: 'YOUR_SPELL_CHECK_GOOGLE_SHEET_URL_HERE',
};
```

### Step 2: Google Sheets URL Format

Your Google Sheets URLs should be in the published CSV format:

**Example:**
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv
```

Or if your sheet is published as web:
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQvN6QlJiOpQXwoA_kvY5mFEIiQiwX-a3QHDZHiXxYsSswb8yYADM63YLkXZbiOmXgDSXly5Pn_wkk-/pub?output=csv
```

### Step 3: Configure Worksheet Numbers (Optional)

Each module is configured to load from a specific worksheet number:

```typescript
{
  id: 'space',
  name: 'Space',
  // ... other properties
  worksheetNumber: 1, // Loads from Worksheet 1
  worksheetGid: '0',  // GID for worksheet (0 is first worksheet)
}
```

**To use different worksheets:**

1. **Find the Worksheet GID:**
   - Open your Google Sheet
   - Click on the worksheet/tab you want to use
   - Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=123456789`
   - The number after `gid=` is your worksheet GID (e.g., `123456789`)

2. **Update the configuration in `/services/googleSheetsService.ts`:**
   ```typescript
   {
     id: 'space',
     name: 'Space',
     sheetUrl: 'YOUR_GOOGLE_SHEET_URL',
     worksheetNumber: 1,
     worksheetGid: '0', // First worksheet
   },
   {
     id: 'geography',
     name: 'Geography',
     sheetUrl: 'YOUR_GOOGLE_SHEET_URL',
     worksheetNumber: 2,
     worksheetGid: '123456789', // Your specific worksheet GID
   }
   ```

### Step 4: Make Your Sheet Public

1. Open your Google Sheet
2. Go to File → Share → Publish to web
3. Choose the specific worksheet/tab or "Entire Document"
4. Select "Comma-separated values (.csv)" as the format
5. Click "Publish"
6. Copy the generated URL

**Note:** The app automatically handles worksheet selection using the GID parameter, so you can use a single Google Sheet with multiple worksheets/tabs for all modules.

## Google Sheets Data Format

Each Google Sheet should follow this CSV format:

### Header Row (Required):
```
Question,Answer A,Answer B,Answer C,Answer D,Correct Answer,Note
```

### Data Rows:
```csv
Question,Answer A,Answer B,Answer C,Answer D,Correct Answer,Note
"Who took Lily and Max on their space trip?","Captain Star","Emma","Jake","Columbus","A","Read the story carefully before answering."
"What planet is known as the Red Planet?","Venus","Mars","Jupiter","Saturn","B",""
```

### Field Descriptions:

- **Question**: The question text (required)
- **Answer A**: First answer option (required)
- **Answer B**: Second answer option (required)
- **Answer C**: Third answer option (required)
- **Answer D**: Fourth answer option (required)
- **Correct Answer**: The letter of the correct answer: A, B, C, or D (required)
- **Note**: Optional hint or note to display with the question (optional)

## Sample Data (Currently Used as Fallback)

When Google Sheets URLs are not configured, the app uses sample data:

### Space Module
- "Who took Lily and Max on their space trip?" → Answer: Captain Star
- "What planet is known as the Red Planet?" → Answer: Mars

### Geography Module
- "What is the capital of France?" → Answer: Paris

### Math Module
- "What is 12 + 8?" → Answer: 20

### Spell Check Module
- "Which word is spelled correctly?" → Answer: Beautiful

## Testing Your Configuration

1. Update the URLs in `googleSheetsService.ts`
2. Run the app: `npm run dev`
3. Navigate through the quiz and select a topic
4. The app will fetch questions from your Google Sheet
5. If fetching fails, sample data will be shown as fallback

## Troubleshooting

### Questions not loading?

1. **Check the Sheet URL**: Make sure the URL is correct and the sheet is published
2. **Check the format**: Ensure your CSV format matches the expected format
3. **Check CORS**: Google Sheets published as CSV should work without CORS issues
4. **Console logs**: Check browser console for error messages

### Data not parsing correctly?

1. **Commas in content**: Ensure cells with commas are properly quoted
2. **Empty cells**: Make sure there are no completely empty rows
3. **Correct Answer format**: Use only A, B, C, or D (uppercase)

## Module Configuration Details

You can adjust module properties in `/services/googleSheetsService.ts`:

```typescript
export const TOPICS: Topic[] = [
  {
    id: 'space',
    name: 'Space',
    icon: '🚀',
    color: '#4dd0e1',
    difficulty: 'Easy',
    solved: 0,
    total: 10, // Update this to match your actual question count
    sheetUrl: SHEET_URLS.space,
    worksheetNumber: 1, // Worksheet number for display
    worksheetGid: '0', // GID of the worksheet (0 = first worksheet)
  },
  // ... other modules
];
```

## Using Multiple Worksheets in a Single Google Sheet

You can use a **single Google Sheet** with multiple worksheets/tabs for all 4 modules:

**Setup:**
1. Create one Google Sheet
2. Create 4 different worksheets/tabs:
   - Tab 1: "Space Questions" (GID will be 0)
   - Tab 2: "Geography Questions" (find GID from URL)
   - Tab 3: "Math Questions" (find GID from URL)
   - Tab 4: "Spell Check Questions" (find GID from URL)
3. Use the same `sheetUrl` for all modules, but different `worksheetGid` values:

```typescript
const SINGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv';

export const TOPICS: Topic[] = [
  {
    id: 'space',
    sheetUrl: SINGLE_SHEET_URL,
    worksheetGid: '0', // Tab 1
  },
  {
    id: 'geography',
    sheetUrl: SINGLE_SHEET_URL,
    worksheetGid: '123456', // Tab 2 GID
  },
  {
    id: 'math',
    sheetUrl: SINGLE_SHEET_URL,
    worksheetGid: '789012', // Tab 3 GID
  },
  {
    id: 'spell',
    sheetUrl: SINGLE_SHEET_URL,
    worksheetGid: '345678', // Tab 4 GID
  },
];
```

## Notes

- The app automatically handles cache-busting by adding a timestamp parameter
- Sample questions are used when Google Sheets are not configured
- Each module can have a different number of questions (update the `total` field accordingly)
