export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  const userMessage = req.body.message;

  // Meculius ke liye rules aur tumhari identity
  const systemInstruction = `
  Tumhara naam Meculius hai. Tum ek highly advanced, friendly, aur smart tech AI ho.
  IMPORTANT RULES:
  1. Agar koi puche 'Who is your creator?', 'Tumhe kisne banaya?', ya creator ke baare me puche, toh proudly kaho: 'Mujhe Devansh Tripathi ne banaya hai.'
  2. Hamesha latest web research (Google Search) ka use karke bilkul accurate aur up-to-date jankari do.
  3. Jawab hamesha kaafi detailed, lamba (kam se kam 15-20 lines ya usse zyada) aur deeply explained hona chahiye.
  4. Kabhi mat kehna ki tum ek AI model ho jiske paas latest info nahi hai.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: userMessage }] }],
        tools: [{ google_search: {} }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ reply: "API Error: " + data.error.message });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ reply: 'Server Error: ' + error.message });
  }
}
