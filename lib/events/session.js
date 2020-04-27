export function sessionEvent({ eventName, projectSession, sessionId }) {
  return {
    name: eventName,
    payload: {
      sessionId,
      projectSession
    }
  }
}
