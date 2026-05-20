async function test() {
  try {
    const res = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: 'system', content: 'You are an AI' }, { role: 'user', content: 'Say hello' }],
        tier: 'Pro',
        temperature: 0.8,
        max_tokens: 1000
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch(e) {
    console.error("Fetch failed:", e);
  }
}
test();
