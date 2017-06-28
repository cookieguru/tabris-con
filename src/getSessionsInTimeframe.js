export default function(conferenceData, timestamp1, timestamp2) {
  return [...conferenceData.sessions].filter(session =>
    new Date(timestamp1) <= new Date(session.startTimestamp) &&
    new Date(timestamp2) > new Date(session.startTimestamp)
  );
}
