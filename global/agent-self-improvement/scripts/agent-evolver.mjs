#!/usr/bin/env node
/**
 * Cron Feedback Evaluator
 * PRM-style evaluation for cron job outputs
 * 
 * Usage: node cron-feedback-evaluator.mjs --job daily-digest
 * 
 * Captures:
 * - Evaluative signals (+1/-1/0)
 * - Directive signals (how to improve)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORKSPACE = '/home/adelpro/.openclaw/workspace';
const FEEDBACK_FILE = join(WORKSPACE, 'memory/learning/cron-feedback.json');

// Simple CLI args parser
const args = process.argv.slice(2);
const jobIndex = args.indexOf('--job');
const jobName = jobIndex >= 0 ? args[jobIndex + 1] : 'unknown';

// Load previous feedback
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

// PRM-style evaluation based on response
function evaluateResponse(response) {
  const text = (response || '').toLowerCase();
  
  // Positive indicators
  const positive = [
    'thanks', 'thank you', 'great', 'good', 'perfect', 'awesome',
    'nice', 'love it', 'exactly', 'yes', 'good job', 'well done'
  ];
  
  // Negative/correction indicators  
  const negative = [
    'but', 'however', 'can you', 'could you', 'should', 'instead',
    'not', 'wrong', 'missing', 'forgot', 'add', 'include', 'also',
    'too long', 'short', 'format', 'use', 'please'
  ];
  
  let score = 0;
  let hint = null;
  
  // Check for positive
  if (positive.some(p => text.includes(p))) {
    score = 1;
  }
  
  // Check for corrections/directives
  if (negative.some(n => text.includes(n)) && text.length > 20) {
    score = score === 1 ? 1 : -1; // Keep positive if already positive
    hint = extractHint(text);
  }
  
  return { score, hint };
}

// Extract directive hint from response
function extractHint(text) {
  // Common patterns
  const patterns = [
    /can you (also |)(.*?)(\?|$)/i,
    /could you (.*?)(\?|$)/i,
    /(should |)(.*?)instead/i,
    /(add|include) (.*?)(\?|$)/i,
    /(too |)(short|long|complex)/i,
    /use (.*?)instead/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/\?$/, '').trim();
    }
  }
  
  // Return first 50 chars as hint
  return text.substring(0, 50).trim();
}

// Main evaluation
function evaluate(jobName, userResponse = null) {
  const feedback = loadFeedback();
  
  if (!feedback.jobs[jobName]) {
    feedback.jobs[jobName] = { evaluations: [], avg_score: 0 };
  }
  
  const jobFeedback = feedback.jobs[jobName];
  
  // If no user response provided, this is a check
  if (!userResponse) {
    console.log(`📊 Agent Evolver - ${jobName}`);
    console.log(`Total evaluations: ${jobFeedback.evaluations.length}`);
    console.log(`Average score: ${(jobFeedback.avg_score || 0).toFixed(2)}`);
    return feedback;
  }
  
  // Evaluate the response
  const evaluation = evaluateResponse(userResponse);
  evaluation.date = new Date().toISOString().split('T')[0];
  evaluation.response = userResponse.substring(0, 100);
  
  jobFeedback.evaluations.push(evaluation);
  
  // Recalculate average
  const scores = jobFeedback.evaluations.map(e => e.score).filter(s => s !== 0);
  jobFeedback.avg_score = scores.length > 0 
    ? scores.reduce((a, b) => a + b, 0) / scores.length 
    : 0;
  
  saveFeedback(feedback);
  
  console.log(`✅ Evaluated ${jobName}:`);
  console.log(`   Score: ${evaluation.score > 0 ? '+1' : evaluation.score < 0 ? '-1' : '0'}`);
  if (evaluation.hint) {
    console.log(`   Hint: ${evaluation.hint}`);
  }
  
  return feedback;
}

// Run
const isMain = process.argv[1] === __filename;
if (isMain) {
  evaluate(jobName);
}

export { evaluate, loadFeedback };
