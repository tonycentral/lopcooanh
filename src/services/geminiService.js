// Optional Gemini AI Service for deep real-time IELTS examiner grading

export async function evaluateWithGemini(type, data, apiKey) {
  if (!apiKey) return null;

  try {
    let prompt = "";
    if (type === "translation_single") {
      prompt = `
You are a senior British Council IELTS Writing Task 2 Examiner.
Evaluate this student's English translation of the following Vietnamese sentence.

Context:
- Target Band: ${data.targetBand}
- Vietnamese Sentence to Translate: "${data.vietnamesePrompt}"
- Target Word: "${data.targetWord}"
- Synonyms: ${data.synonyms?.join(", ")}
- Topic: ${data.topicName}
- Model Translation: "${data.modelSentence}"
- Student's English Translation: "${data.studentSentence}"

CRITICAL INSTRUCTIONS:
1. The student is practicing translating the specific Vietnamese sentence above into academic English.
2. Any "upgradedSentence" MUST STRICTLY preserve the semantic meaning, subject, and context of the Vietnamese sentence ("${data.vietnamesePrompt}").
3. DO NOT switch to another topic or produce an unrelated sentence. Elevate the grammar and lexical precision to meet IELTS Band ${data.targetBand}+ standard while staying 100% faithful to the Vietnamese sentence.

Respond ONLY with valid JSON with this exact schema (no markdown formatting, no code blocks):
{
  "scores": {
    "overallBand": 7.5,
    "lexicalResource": 7.5,
    "grammarRange": 7.5
  },
  "upgradedSentence": "An academically elevated English translation of the exact Vietnamese sentence above at Band ${data.targetBand}+",
  "strengths": ["string in Vietnamese praising accurate translation points"],
  "improvements": ["string in Vietnamese offering constructive grammar or vocabulary tips"]
}
`;
    } else if (type === "vocabulary") {
      prompt = `
You are a senior British Council IELTS Writing Task 2 Examiner.
Evaluate this student's sentence written to practice the target vocabulary item in an academic essay context.

Context:
- Target Band: ${data.targetBand}
- Target Word: ${data.targetWord}
- Synonyms: ${data.synonyms?.join(", ")}
- Topic: ${data.topicName}
- Student's Sentence: "${data.sentence}"

Respond ONLY with valid JSON with this exact schema (no markdown formatting, no code blocks):
{
  "scores": {
    "overallBand": 7.0,
    "lexicalResource": 7.0,
    "grammarRange": 7.0
  },
  "foundTargetWord": true,
  "foundSynonym": null,
  "strengths": ["string in Vietnamese praising good points"],
  "improvements": ["string in Vietnamese pointing out weaknesses or errors"],
  "upgradeSuggestion": {
    "band1": "7.5",
    "version1": "Upgraded Band 7.5 sentence in English",
    "band2": "8.5",
    "version2": "Upgraded Band 8.5 sentence in English",
    "explanation": "Explanation in Vietnamese on how the sentence was elevated"
  }
}
`;
    } else {
      prompt = `
You are a senior British Council IELTS Writing Task 2 Examiner.
Evaluate this student's follow-up sentence written to maintain Coherence and Cohesion with a model sentence.

Context:
- Target Band: ${data.targetBand}
- Model Sentence A: "${data.sentenceA}"
- Student's Follow-up Sentence B: "${data.sentenceB}"
- Topic: ${data.topicName}
- Intended Function: ${data.prompt}

Respond ONLY with valid JSON with this exact schema (no markdown formatting, no code blocks):
{
  "scores": {
    "overallBand": 7.5,
    "coherenceCohesion": 8.0,
    "lexicalResource": 7.0,
    "grammarRange": 7.5
  },
  "detectedCohesiveDevices": ["Furthermore"],
  "strengths": ["string in Vietnamese praising logical flow and transitions"],
  "improvements": ["string in Vietnamese pointing out weaknesses in coherence or grammar"],
  "modelFollowUp": "A perfect native Band 8.5 follow-up sentence in English",
  "explanation": "Detailed explanation in Vietnamese on how cohesive devices and referencing words create seamless flow"
}
`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    if (!response.ok) {
      console.warn("Gemini API call returned status:", response.status);
      return null;
    }

    const json = await response.json();
    const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText);
    return {
      ...parsed,
      isAiGraded: true,
      targetBand: data.targetBand,
      isTargetMet: (parsed.scores?.overallBand || 0) >= parseFloat(data.targetBand)
    };
  } catch (err) {
    console.error("Gemini evaluation error:", err);
    return null;
  }
}
