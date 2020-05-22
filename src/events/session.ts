interface Event {
  eventName: string
  sessionId: string
  projectSession: string
}

interface SessionEvent {
  name: string
  payload: {
    sessionId: string
    projectSession: string
  }
}

export function sessionEvent ({
  eventName,
  projectSession,
  sessionId
}: Event): SessionEvent {
  return {
    name: eventName,
    payload: {
      sessionId,
      projectSession
    }
  }
}
