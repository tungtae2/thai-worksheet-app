async function test() {
    const res = await fetch('http://localhost:3001/api/workflows/worksheet_generation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: 'P1', topic: 'สระ', questionCount: 2, type: 'make_sentences' })
    });
    const data = await res.json();
    require('fs').writeFileSync('result.json', JSON.stringify(data, null, 2));
    console.log("Done");
}
test();
