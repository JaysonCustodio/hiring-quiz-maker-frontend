# Quiz Maker App

**Production-ready Quiz Maker** built with Next.js, TypeScript, Tailwind CSS, Zustand, and TanStack Query v5.

Fully integrated with a Node.js + SQLite backend that provides API endpoints for quiz management, grading, and anti-cheat event tracking.

## Features

### ✅ Core Features Implemented

#### 1. Quiz Builder

- Create quizzes with title and description
- **Question Types**:
  - **MCQ (Multiple Choice)**: Select multiple options, set correct answer (text or index)
    - **Validation**: Prevents duplicate options with real-time error messages
    - **Form Validation**: Buttons disabled when form has errors
  - **Short Answer**: Case-insensitive text matching
  - **Code**: Prompt-only questions with optional code snippets (no auto-grading)
- Publish quizzes to backend
- Receive unique Quiz ID for sharing

#### 2. Quiz Player

- **Start Attempt**: Enter Quiz ID → backend creates attempt session
- **Answer Questions**: Navigate with Previous/Next buttons
- **Incremental Saving**: Answers saved to backend as user types
- **Submit**: One-click submission with instant score calculation

#### 3. Results Page

- **Score Display**: Percentage + raw count (X/Y correct)
- **Per-Question Breakdown**: Shows correct/incorrect status and expected answers
- **Activity Summary**: Displays focus switches and paste events detected during quiz

### ✅ Anti-Cheat Tracking (Bonus)

- **Focus Events**: Detects tab blur/focus (tab switching)
- **Paste Detection**: Monitors clipboard paste in answer fields
- **Event Logging**: Posts events to backend in real-time
- **Summary Display**: Shows total events count on results page
- **Lightweight by design**: Logs only blur/focus + paste timestamps (no heavy signals)

## Quick Start

### Prerequisites

- Node.js 18+
- Backend running on `http://localhost:4000`

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (copy example)
cp .env.local-example .env.local
# Edit .env.local with your backend URL

# 3. Start backend (in separate terminal/directory)
cd ../hiring-quiz-maker-backend-main
npm install
npm run dev  # Runs on http://localhost:4000

# 4. Start frontend
npm run dev  # Runs on http://localhost:3000
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

Visit `http://localhost:3000` to begin!

## Tech Stack

- **Framework**: Next.js 16.2.2 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5
- **Data Fetching**: TanStack Query 5
- **HTTP Client**: Axios 1.14
- **Icons**: Lucide React (modern icon library)
- **UI Components**: React 19
- **Build Tool**: Turbopack (Next.js built-in)
- **Linting**: ESLint 9
- **CSS Processing**: PostCSS

## Project Structure

```
quiz-app/
├── app/
│   ├── layout.tsx              # Root layout with TanStack Query provider
│   ├── page.tsx                # Home (create/take quiz options)
│   ├── builder/
│   │   └── page.tsx            # Quiz builder page
│   ├── player/
│   │   └── page.tsx            # Quiz player page
│   ├── globals.css             # Global styles
│   └── providers.tsx           # TanStack Query setup
├── components/
│   ├── QuizBuilder.tsx         # Builder entry (controller → view)
│   ├── QuizPlayer.tsx          # Player entry (controller → view)
│   ├── ResultsPage.tsx         # Score display & breakdown
│   ├── Cancel.tsx              # Cancel/back navigation component
│   ├── Modal.tsx               # Beautiful modal component with animations
│   ├── ModalProvider.tsx       # Global modal state management
│   ├── home/                   # Home page components
│   │   ├── HomeContent.tsx     # Main home page content
│   │   └── QuizIdModal.tsx     # Quiz ID input modal
│   ├── quiz-builder/           # Builder "view" components
│   │   └── QuizBuilderView.tsx # Quiz builder UI
│   └── quiz-player/            # Player "view" components
│       └── QuizPlayerView.tsx  # Quiz player UI
├── hooks/
│   ├── useHomeTakeQuiz.ts      # Home take-quiz flow + validation
│   ├── usePlayerSession.ts     # Player page session orchestration
│   ├── useQuizBuilder.ts       # Builder state + mutations + handlers
│   └── useQuizPlayer.ts        # Player state wiring + anti-cheat + autosave
├── lib/
│   ├── types.ts                # TypeScript types matching backend
│   ├── store.ts                # Zustand state management
│   ├── api.ts                  # Axios HTTP client
│   ├── queries.ts              # TanStack Query hooks
│   ├── antiCheat.ts            # Focus/paste detection utilities
│   ├── validation.ts           # Form validation utilities
│   └── questionPrompt.ts       # Code snippet encoding/decoding
├── public/                     # Static assets
├── .env.local                  # Environment configuration
├── .env.local-example          # Environment template
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.*           # Tailwind CSS configuration
├── eslint.config.mjs           # ESLint configuration
## Recent Improvements

### ✅ Form Validation & UX Enhancements

- **Duplicate Option Prevention**: MCQ questions now validate for unique options with real-time error messages
- **Smart Button States**: "Add Question" and "Create & Publish" buttons are disabled when forms have validation errors
- **Code Snippet Support**: Questions can include optional code snippets that are properly encoded/decoded
- **Beautiful Modal System**: Replaced all browser alerts with elegant, animated modals featuring professional Lucide icons
- **Enhanced Validation**: Comprehensive form validation with user-friendly error messages

### ✅ Code Quality

- **TypeScript**: Full type safety with comprehensive interfaces
- **Validation Utilities**: Dedicated validation functions for form inputs
- **Modular Architecture**: Clean separation of concerns with hooks, components, and utilities

---

*Last updated: April 6, 2026*

## Backend Integration

### API Endpoints

The frontend communicates with the Node.js + SQLite backend:

**Quiz Management**

- `POST /quizzes` → Create quiz
- `GET /quizzes/:id` → Fetch quiz with questions
- `POST /quizzes/:id/questions` → Add question
- `PATCH /quizzes/:id` → Update quiz (e.g., publish)

**Quiz Attempts & Grading**

- `POST /attempts` → Start quiz attempt
- `POST /attempts/:id/answer` → Save answer for a question
- `POST /attempts/:id/submit` → Submit attempt and get score
- `POST /attempts/:id/events` → Log anti-cheat events

### Authentication

All requests include: `Authorization: Bearer <API_TOKEN>`

In `.env.local`, set:

```

NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_API_TOKEN=dev-token

## Usage Walkthrough

### Creating a Quiz

1. **Home Page** → Click "Create Quiz"
2. **Step 1: Quiz Information**
   - Enter title (e.g., "JavaScript Basics")
   - Enter description
   - Click "Next: Add Questions"

3. **Step 2: Add Questions**
   - Choose question type (MCQ or Short Answer)
   - Enter the question prompt
   - **For MCQ**:
     - Add at least 2 options
     - Set correct answer (text or option index)
   - **For Short Answer**:
     - Set the canonical answer (case-insensitive)
   - Click "Add Question" to add more
   - Click "Create & Publish Quiz"

4. **Receive Quiz ID** → Share with others!

### Taking a Quiz

1. **Home Page** → Enter Quiz ID → Click "Take Quiz"
2. **Quiz Player**
   - Read the question
   - Enter/select your answer
   - Click "Next" to move forward or "Previous" to go back
   - On the last question, click "Submit Quiz"
3. **Results Page**
   - View your overall score percentage
   - See breakdown of each question
   - View activity summary (if you had any focus/paste events)
   - Choose to take another quiz or go home

## Key Features Explained

### Auto-Saving Answers

- Answers are sent to the backend **as you type**
- No manual save button needed
- Enables quiz resumption (user can leave and come back to the attempt)

### Grading System

- **MCQ**: Backend accepts both option text and index numbers
- **Short Answer**: Case-insensitive, whitespace-normalized comparison
- Score = number of correct answers

### Anti-Cheat Tracking

- **Focus Lost**: Triggered when window loses focus (user tabs away)
- **Focus Regained**: Triggered when window regains focus
- **Paste Detected**: Triggered when user pastes into answer field
- All events logged in real-time (non-blocking)
- Summary on results page shows total counts (not detailed timeline)

### Code Snippets (Display-Only)

The take-home requirements mention an optional “code snippet” per question (display only).

To stay compatible with the provided backend contract (no additional fields), the frontend stores
an optional snippet inside the `prompt` string using a simple marker format:

```
Question text...

[code]
const x = 1;
console.log(x);
[/code]
```

On the player screen, the app decodes this format and renders the snippet as a code block.

## Environment Configuration

### `.env.local`

```bash
# Backend API endpoint
NEXT_PUBLIC_API_URL=http://localhost:4000

# API authentication token
NEXT_PUBLIC_API_TOKEN=dev-token
```

## Architecture

### State Management (Zustand)

Located in `/lib/store.ts`. Manages:

- Current quiz attempt
- User answers
- Anti-cheat events
- Current question index
- Submission score

Zustand was chosen for:

- Minimal boilerplate
- Suits this project's state complexity
- Easy to persist to localStorage if needed

### API Layer (Axios + TanStack Query)

**Raw API** (`/lib/api.ts`):

- Direct axios functions for API calls

**React Hooks** (`/lib/queries.ts`):

- `useGetQuiz()` - Fetch quiz by ID
- `useCreateQuiz()` - Create new quiz
- `useAddQuestion()` - Add question to quiz
- `usePublishQuiz()` - Publish quiz
- `useStartAttempt()` - Start new attempt
- `useSaveAnswer()` - Save individual answer
- `useSubmitAttempt()` - Submit and grade attempt
- `useLogEvent()` - Log anti-cheat event

TanStack Query handles:

- Request caching
- Loading/error states
- Automatic retry logic
- Background refetching

### UI Components

- **QuizBuilder**: Split into a controller hook (`hooks/useQuizBuilder.ts`) and a view (`components/quiz-builder/*`)
- **QuizPlayer**: Split into a controller hook (`hooks/useQuizPlayer.ts`) and a view (`components/quiz-player/*`)
- **ResultsPage**: Score summary, question breakdown, activity log

All components use TypeScript with zero `any` types for full type safety.

### Views vs Logic (current conventions)

- **Views**: Pure/presentational components (render UI, receive data + callbacks via props)
- **Logic**: Custom hooks in `/hooks` encapsulate state, side-effects, and server mutations
- **Public component entrypoints**: `components/QuizBuilder.tsx` and `components/QuizPlayer.tsx` stay stable so pages import them without caring about internal structure

## Error Handling

| Scenario            | Handling                                            |
| ------------------- | --------------------------------------------------- |
| Invalid Quiz ID     | Client-side validation (must be numeric)            |
| Quiz not found      | Error page with "Back to Home" link                 |
| Network error       | Error message displayed, user can retry             |
| Answer save fails   | Logged to console, doesn't block quiz               |
| Event logging fails | Silent failure (retry disabled), doesn't block flow |
| Form validation     | Client-side alerts before submission                |
| Submit failure      | Error alert with retry option                       |

## Performance

- **Query Caching**: Quizzes cached indefinitely (immutable data)
- **Incremental Saves**: Each answer posted immediately
- **Non-Blocking Events**: Anti-cheat events logged asynchronously
- **Code Splitting**: Routes automatically split by Next.js
- **CSS Optimization**: Tailwind purges unused styles in production

# Frontend

cd quiz-app
npm run dev

````
### Manual Test Flow

1. Open `http://localhost:3000`
2. Click "Create Quiz"
3. Enter quiz title and description
4. Add 2-3 questions of different types
5. Copy Quiz ID from success alert
6. Click "Take Quiz" on home page
7. Enter Quiz ID and take quiz
8. Verify results appear correctly

### Expected Behavior

✅ Quiz creation succeeds with Quiz ID
✅ Quiz loads by ID with all questions
✅ Answers save silently as you type
✅ Submit calculates correct score
✅ Results show per-question breakdown
✅ Anti-cheat events appear if they occurred
✅ Navigation is smooth without loading delays

## Troubleshooting

### "Quiz not found" error

- Verify Quiz ID is numeric (e.g., `1`, not `quiz-1`)
- Ensure the quiz exists in backend DB
- Confirm quiz was published

### API connection errors

- Check backend is running: `curl http://localhost:4000/quizzes`
- Verify `.env.local` has correct API_URL and API_TOKEN
- Check browser Network tab for failed requests

### Answers not saving

- Check browser Network tab for POST errors
- Verify answer values aren't empty
- Check browser console for validation errors

### Anti-cheat events not logging

- By design, failures are silent (non-blocking)
- Check Network tab for POST /attempts/:id/events calls
- Ensure focus is on the answer field for focus detection

## Scripts

```bash
npm run dev       # Start development server on port 3000
npm run build     # Create production build
npm start         # Run production build locally
npm run lint      # Run ESLint
````

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Not tested: IE11, older browsers

## Code Quality Checklist

- ✅ Full TypeScript (no `any` types)
- ✅ Error boundaries on all async
- ✅ Loading states on buttons/text
- ✅ Accessible forms (labels, ARIA)
- ✅ Responsive Tailwind CSS
- ✅ Clean file organization
- ✅ Comments on complex logic
- ✅ Separated concerns (API, state, UI)

## Next Steps / Improvements

1. **Timer**: Enforce time limit from `quiz.timeLimitSeconds`
2. **Analytics**: Store attempt history per user
3. **Code Grading**: Basic regex/output matching
4. **Collaborative**: Multiple users, team results
5. **Mobile**: React Native version
6. **Accessibility**: WCAG 2.1 audit
7. **Performance**: Service workers, offline sync
8. **Advanced Anti-Cheat**: Screenshot detection, eye tracking

## Support & Issues

1. Check backend logs: `npm run dev`
2. Check frontend console (F12 → Console)
3. Review Network tab for API responses
4. Verify `.env.local` configuration
5. Restart both services
# hiring-quiz-maker-frontend
