
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

# What this is

- Guided conversational flowNot a chatbot — controlled step by stepBackend-driven recommendation engineLogic lives in Python, AI just narrates
- Hallucination preventionAI never calculates — only speaks backend results
- Graceful degradationApp works even when Gemini rate limit hits
- Rule-based gram/pack logicAssignment requirement — fully implemented
- Modular architecturelogic.py / prompts.py / main.py all separate concerns
- Swagger API documentationAuto-generated at /docs
- Scalable for Phase 2 Ready for image upload, RAG, more products