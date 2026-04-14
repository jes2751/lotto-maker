const projectId = 'lotto-maker-lab';
const apiKey = 'AIzaSyB04fPEha6ddbR5N4lGUOeKuZxav5S_8is';
fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    structuredQuery: {
      from: [{ collectionId: 'generated_records' }],
      orderBy: [{ field: { fieldPath: 'generatedAt' }, direction: 'DESCENDING' }],
      limit: 1
    }
  })
}).then(res => res.json()).then(data => {
  const fields = data[0].document.fields;
  console.log('Record strategy:', fields.strategy);
  console.log('Record targetRound:', fields.targetRound);
}).catch(console.error);
