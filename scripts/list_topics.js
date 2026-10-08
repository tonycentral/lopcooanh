import { IELTS_TASK2_TOPICS, IELTS_TASK1_TOPICS } from '../src/data/topicsData.js';

console.log('--- TASK 2 TOPICS (Total: ' + IELTS_TASK2_TOPICS.length + ') ---');
IELTS_TASK2_TOPICS.forEach((t, i) => {
  console.log(`${i+1}. [${t.id}] ${t.name} (VN: ${t.vietnameseName || 'N/A'}) - Tag: ${t.tag} - Year: ${t.yearDate || 'N/A'}`);
});

console.log('\n--- TASK 1 TOPICS (Total: ' + IELTS_TASK1_TOPICS.length + ') ---');
IELTS_TASK1_TOPICS.forEach((t, i) => {
  console.log(`${i+1}. [${t.id}] ${t.name} (VN: ${t.vietnameseName || 'N/A'})`);
});
