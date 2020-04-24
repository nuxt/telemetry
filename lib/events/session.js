export function sessionEvent({
  eventName,
  options,
  projectSession,
  sessionId
}) {
  return {
    name: eventName,
    payload: {
      sessionId,
      projectSession
    }
  }
}
