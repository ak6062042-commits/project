
# SAlOON SALES REPRESENATATIVE


project/
├── backend/
│   ├── main.py        ← /recommend /chat /faq /cart /booking /addons
│   ├── logic.py       ← all calculation logic
│   ├── prompts.py     ← system prompt + FAQ responses
│   ├── products.json  ← product catalogue
│   └── .env           ← GEMINI_API_KEY
└── frontend/
    └── src/
        ├── components/
        │   ├── StepCard.jsx       ← question cards
        │   ├── ResultCard.jsx     ← recommendation output
        │   ├── LoadingScreen.jsx  ← animated loading
        │   └── FAQSection.jsx     ← objection handling
        ├── api/
        │   └── stylist.js         ← all API calls
        ├── App.jsx                ← guided flow controller
        └── index.css              ← dark/gold theme

# HOW TO RUN
- cd backend
- uvicorn main:app --reload
- cd frontend
- npm run dev