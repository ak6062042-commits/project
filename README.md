
# SAlOON SALES REPRESENATATIVE


backend/
├── main.py
├── logic.py
├── prompts.py
├── ai.py
├── models.py
├── products.json
├── requirements.txt
├── .env
└── chat_memory.py

frontend/src/
├── api/
│   └── stylist.js
├── components/
│   ├── StepCard.jsx
│   ├── ResultCard.jsx
│   ├── LoadingScreen.jsx
│   ├── FAQSection.jsx
│   ├── FollowUpChat.jsx
│   ├── ProgressBar.jsx
│   ├── PriceCard.jsx
│   └── StatusMessage.jsx
├── utils/
│   └── session.js
├── App.jsx
├── index.css
└── main.jsx


# HOW TO RUN
- cd backend
- uvicorn main:app --reload
- cd frontend
- npm run dev

# What this is

- Guided conversational flowNot a chatbot — controlled step by step
- Backend-driven recommendation engine Logic lives in Python, AI just narrates
- Hallucination preventionAI never calculates — only speaks backend results
- Graceful degradationApp works even when Gemini rate limit hits
- Rule-based gram/pack logicAssignment requirement — fully implemented
- Modular architecturelogic.py / prompts.py / main.py all separate concerns
- Swagger API documentationAuto-generated at /docs
- Scalable for Phase 2 Ready for image upload, RAG, more products

resultcard and faqquestion and app.jsx