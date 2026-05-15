#!/usr/bin/env node
/**
 * Self-Improvement Skill
 * Generic agent feedback capture and improvement generation
 * 
 * Usage: 
 *   node self-improvement.mjs --job daily-digest --feedback "Thanks!"
 *   node self-improvement.mjs --job daily-digest --stats
 *   node self-improvement.mjs --job daily-digest --improve
 *   node self-improvement.mjs --improve all --weekly
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORKSPACE = '/home/adelpro/.openclaw/workspace';
const FEEDBACK_FILE = `${WORKSPACE}/memory/learning/agent-feedback.json`;

// Parse args
const args = process.argv.slice(2);
let jobName = null;
let feedback = null;
let doStats = false;
let generateImprove = false;
let weekly = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--job' && args[i + 1]) jobName = args[++i];
  else if (args[i] === '--feedback' && args[i + 1]) feedback = args[++i];
  else if (args[i] === '--score' && args[i + 1]) scoreOverride = parseInt(args[++i]);
  else if (args[i] === '--stats') doStats = true;
  else if (args[i] === '--improve') {
    generateImprove = true;
    if (args[i + 1] && !args[i + 1].startsWith('--')) jobName = args[++i];
  }
  else if (args[i] === '--weekly') weekly = true;
}

let scoreOverride = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--score' && args[i + 1]) scoreOverride = parseInt(args[++i]);
}

// Load feedback
function loadFeedback() {
  if (existsSync(FEEDBACK_FILE)) {
    return JSON.parse(readFileSync(FEEDBACK_FILE, 'utf-8'));
  }
  return { jobs: {}, last_updated: null };
}

// Save feedback
function saveFeedback(data) {
  data.last_updated = new Date().toISOString();
  writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2));
}

// Evaluate response
function evaluateResponse(response) {
  const text = (response || '').toLowerCase();
  
  const positive = ['thanks', 'thank you', 'great', 'good', 'perfect', 'awesome', 'nice', 'love', 'exactly', 'yes', 'well done', 'good job'];
  const negative = ['but', 'however', 'can you', 'could you', 'should', 'instead', 'not', 'wrong', 'missing', 'forgot', 'add', 'include', 'also', 'too', 'short', 'long', 'format'];
  
  let score = 0;
  let hint = null;
  
  if (positive.some(p => text.includes(p))) score = 1;
  if (negative.some(n => text.includes(n)) && text.length > 15) {
    score = score === 1 ? 1 : -1;
    hint = extractHint(text);
  }
  
  return { score, hint };
}

function extractHint(text) {
  const patterns = [
    /can you (also |)(.*?)(\?|$)/i,
    /could you (.*?)(\?|$)/i,
    /(should |)(.*?)instead/i,
    /(add|include|show) (.*?)(\?|$)/i,
    /(too |)(short|long|complex)/i,
    /use (.*?)instead/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].replace(/\?$/, '').trim();
  }
  return text.substring(0, 50).trim();
}

// Capture feedback
function captureFeedback(jobName, userFeedback, score = null) {
  const data = loadFeedback();
  
  if (!data.jobs[jobName]) {
    data.jobs[jobName] = { evaluations: [], improvements: [] };
  }
  
  const job = data.jobs[jobName];
  const evalResult = evaluateResponse(userFeedback);
  const finalScore = score !== null ? score : evalResult.score;
  
  job.evaluations.push({
    date: new Date().toISOString().split('T')[0],
    score: finalScore,
    hint: evalResult.hint,
    feedback: userFeedback.substring(0, 100)
  });
  
  saveFeedback(data);
  console.log(`✅ Captured feedback for ${jobName}: score=${finalScore}, hint="${evalResult.hint || 'none'}"`);
  return data;
}

// Show stats
function showStats(jobName) {
  const data = loadFeedback();
  
  if (jobName === 'all') {
    console.log(`📊 Self-Improvement Stats - All Jobs\n`);
    for (const [job, info] of Object.entries(data.jobs)) {
      const scores = info.evaluations.map(e => e.score).filter(s => s !== 0);
      const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 'N/A';
      console.log(`  ${job}: ${info.evaluations.length} evals, avg: ${avg}`);
    }
    return data;
  }
  
  const job = data.jobs[jobName];
  if (!job) {
    console.log(`No feedback for ${jobName}`);
    return data;
  }
  
  const scores = job.evaluations.map(e => e.score).filter(s => s !== 0);
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 'N/A';
  
  console.log(`📊 ${jobName}`);
  console.log(`  Total evaluations: ${job.evaluations.length}`);
  console.log(`  Average score: ${avg}`);
  
  // Hint frequency
  const hints = job.evaluations.filter(e => e.hint).map(e => e.hint);
  if (hints.length) {
    console.log(`\n  Top Hints:`);
    const freq = {};
    hints.forEach(h => { freq[h] = (freq[h] || 0) + 1; });
    Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 3).forEach(([hint, count]) => {
      console.log(`    • "${hint}" (${count}x)`);
    });
  }
  
  return data;
}

// Generate improvements
function generateImprovements(jobName, isWeekly = false) {
  const data = loadFeedback();
  
  const jobs = jobName === 'all' ? Object.keys(data.jobs) : [jobName];
  
  for (const job of jobs) {
    const jobData = data.jobs[job];
    if (!jobData) continue;
    
    const evaluations = jobData.evaluations;
    const recent = isWeekly 
      ? evaluations.slice(-7) 
      : evaluations.slice(-3);
    
    const scores = recent.map(e => e.score).filter(s => s !== 0);
    const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : 'N/A';
    
    // Extract hints
    const hints = recent.filter(e => e.hint).map(e => e.hint);
    const hintFreq = {};
    hints.forEach(h => { hintFreq[h] = (hintFreq[h] || 0) + 1; });
    const topHints = Object.entries(hintFreq).sort((a, b) => b[1] - a[1]).slice(0, 3);
    
    console.log(`\n📈 ${isWeekly ? 'Weekly' : 'Daily'} Improvements - ${job}`);
    console.log(`   Score: ${avg} (${recent.length} evals)`);
    
    if (topHints.length) {
      console.log(`\n   Suggested Actions:`);
      topHints.forEach(([hint, count]) => {
        const action = hintToAction(hint);
        console.log(`   • ${action} (from "${hint}")`);
        
        // Add to improvements
        jobData.improvements.push({
          date: new Date().toISOString().split('T')[0],
          suggestion: action,
          from_hint: hint,
          implemented: false
        });
      });
    } else {
      console.log(`   No suggestions (user satisfied)`);
    }
  }
  
  saveFeedback(data);
  return data;
}

function hintToAction(hint) {
  const hintLower = hint.toLowerCase();
  
  if (hintLower.includes('star')) return 'Add star trend/delta comparison';
  if (hintLower.includes('table') || hintLower.includes('format')) return 'Use table-image-generator';
  if (hintLower.includes('more') || hintLower.includes('add')) return 'Add more detail to section';
  if (hintLower.includes('short') || hintLower.includes('long')) return 'Adjust output length';
  if (hintLower.includes('weather')) return 'Add weather section';
  if (hintLower.includes('github')) return 'Expand GitHub analytics';
  
  return `Review: "${hint}"`;
}

// Main
function main() {
  if (!jobName && !doStats && !generateImprove) {
    console.log(`Self-Improvement Skill
Usage:
  --job <name> --feedback "<text>"   Capture feedback
  --job <name> --stats               Show feedback stats  
  --job <name> --improve             Generate improvements
  --improve all                      All jobs
  --weekly                           Weekly summary`);
    return;
  }
  
  const data = loadFeedback();
  
  if (feedback) {
    captureFeedback(jobName, feedback, scoreOverride);
  } else if (doStats) {
    showStats(jobName || 'all');
  } else if (generateImprove) {
    generateImprovements(jobName || 'all', weekly);
  }
}

main();
