chat_sessions = {}


def addMessage(
    session_id: str,
    role: str,
    content: str
):

    if session_id not in chat_sessions:
        chat_sessions[session_id] = []

    chat_sessions[session_id].append({
        "role": role,
        "content": content
    })

    # keep latest 10 messages only
    chat_sessions[session_id] = (
        chat_sessions[session_id][-10:]
    )


def getHistory(session_id: str):

    return chat_sessions.get(
        session_id,
        []
    )


def buildConversationString(
    session_id: str
):

    history = getHistory(session_id)

    if not history:
        return ""

    lines = []

    for msg in history:

        role = msg["role"].upper()

        lines.append(
            f"{role}: {msg['content']}"
        )

    return "\n".join(lines)