# Google Sheets Configuration Guide

This document explains how to configure Google Sheets URLs for the 4 quiz modules.

## Overview

The Super Quiz application now supports 4 different modules, each with its own Google Sheets data source:

1. **Space** 🚀 (Easy difficulty)
2. **Geography** 🌍 (Medium difficulty)
3. **Math** 🔢 (Hard difficulty)
4. **Spell Check** ✏️ (Medium difficulty)

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

### Step 3: Make Your Sheet Public

1. Open your Google Sheet
2. Go to File → Share → Publish to web
3. Choose "Entire Document" or specific sheet
4. Select "Comma-separated values (.csv)" as the format
5. Click "Publish"
6. Copy the generated URL

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
    sheetUrl: SHEET_URLS.space
  },
  // ... other modules
];
```

## Notes

- The app automatically handles cache-busting by adding a timestamp parameter
- Sample questions are used when Google Sheets are not configured
- Each module can have a different number of questions (update the `total` field accordingly)
