#!/usr/bin/env node

/**
 * AME TechAssist Forum Structure Sync Script
 * 
 * This script:
 * 1. Creates or updates master topics on the Discourse forum
 * 2. Updates hero card settings to point to these topics
 * 3. Preserves the AI Assistant card (hero_card_4)
 * 
 * Prerequisites:
 * - Node.js installed
 * - Environment variables set:
 *   - DISCOURSE_BASE_URL (e.g., "https://support.ame-techassist.com")
 *   - DISCOURSE_API_KEY
 *   - DISCOURSE_API_USER (admin username)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ============================================================================
// Configuration & Validation
// ============================================================================

const DISCOURSE_BASE_URL = process.env.DISCOURSE_BASE_URL?.replace(/\/$/, '');
const DISCOURSE_API_KEY = process.env.DISCOURSE_API_KEY;
const DISCOURSE_API_USER = process.env.DISCOURSE_API_USER;

function validateEnvironment() {
  const missing = [];
  if (!DISCOURSE_BASE_URL) missing.push('DISCOURSE_BASE_URL');
  if (!DISCOURSE_API_KEY) missing.push('DISCOURSE_API_KEY');
  if (!DISCOURSE_API_USER) missing.push('DISCOURSE_API_USER');

  if (missing.length > 0) {
    console.error('❌ Error: Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nUsage:');
    console.error('  DISCOURSE_BASE_URL=https://support.ame-techassist.com \\');
    console.error('  DISCOURSE_API_KEY=your_api_key \\');
    console.error('  DISCOURSE_API_USER=admin_username \\');
    console.error('  node scripts/sync_forum_structure.mjs');
    process.exit(1);
  }
}

// ============================================================================
// Discourse API Helper
// ============================================================================

async function discourseAPI(endpoint, method = 'GET', body = null) {
  const url = `${DISCOURSE_BASE_URL}${endpoint}`;
  
  const headers = {
    'Api-Key': DISCOURSE_API_KEY,
    'Api-Username': DISCOURSE_API_USER,
    'Content-Type': 'application/json'
  };

  const options = {
    method,
    headers
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ API Error [${method} ${endpoint}]:`, error.message);
    throw error;
  }
}

// ============================================================================
// Topic Management
// ============================================================================

async function createTopic(title, rawContent) {
  console.log(`   Creating topic: "${title}"`);
  
  const response = await discourseAPI('/posts.json', 'POST', {
    title,
    raw: rawContent,
    category: null // You can specify a category ID here if needed
  });

  return {
    topic_id: response.topic_id,
    topic_slug: response.topic_slug
  };
}

async function getTopic(topicId) {
  return await discourseAPI(`/t/${topicId}.json`);
}

async function updateTopicFirstPost(topicId, rawContent) {
  // Get the topic to find the first post ID
  const topic = await getTopic(topicId);
  const firstPostId = topic.post_stream.posts[0].id;

  console.log(`   Updating first post (ID: ${firstPostId}) of topic ${topicId}`);
  
  await discourseAPI(`/posts/${firstPostId}.json`, 'PUT', {
    post: {
      raw: rawContent
    }
  });
}

// ============================================================================
// File Management
// ============================================================================

async function loadTopicConfig() {
  const configPath = path.join(ROOT_DIR, 'config', 'forum_topics.json');
  const content = await fs.readFile(configPath, 'utf-8');
  return JSON.parse(content);
}

async function saveTopicConfig(config) {
  const configPath = path.join(ROOT_DIR, 'config', 'forum_topics.json');
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

async function loadMarkdownFile(relativeFilePath) {
  const fullPath = path.join(ROOT_DIR, relativeFilePath);
  return await fs.readFile(fullPath, 'utf-8');
}

// ============================================================================
// Settings Update
// ============================================================================

async function updateSettingsYaml(topicsConfig) {
  const settingsPath = path.join(ROOT_DIR, 'settings.yaml');
  let settingsContent = await fs.readFile(settingsPath, 'utf-8');

  // Update hero card settings for cards 1-3
  for (const topic of topicsConfig) {
    if (topic.hero_card_slot === null || !topic.topic_id) continue;

    const slot = topic.hero_card_slot;
    const topicUrl = `/t/${topic.topic_id}`;
    
    // Update label
    const labelKey = `hero_card_${slot}_label:`;
    const labelPattern = new RegExp(`(${labelKey}\\s*\\n\\s*default:\\s*")[^"]*"`, 'g');
    settingsContent = settingsContent.replace(labelPattern, `$1${topic.title}"`);

    // Update subtitle
    let subtitle = '';
    if (topic.key === 'assistance') subtitle = 'Get live help on real issues';
    else if (topic.key === 'insights') subtitle = 'Field lessons & clever fixes';
    else if (topic.key === 'guides') subtitle = 'Step-by-step procedures';

    const subtitleKey = `hero_card_${slot}_subtitle:`;
    const subtitlePattern = new RegExp(`(${subtitleKey}\\s*\\n\\s*default:\\s*")[^"]*"`, 'g');
    settingsContent = settingsContent.replace(subtitlePattern, `$1${subtitle}"`);

    // Update URL
    const urlKey = `hero_card_${slot}_url:`;
    const urlPattern = new RegExp(`(${urlKey}\\s*\\n\\s*default:\\s*")[^"]*"`, 'g');
    settingsContent = settingsContent.replace(urlPattern, `$1${topicUrl}"`);

    console.log(`✅ Updated hero_card_${slot} settings for ${topic.title}`);
  }

  // Ensure AI Assistant card (slot 4) is preserved with updated label
  const aiLabelPattern = /(hero_card_4_label:\s*\n\s*default:\s*")[^"]*"/g;
  settingsContent = settingsContent.replace(aiLabelPattern, '$1AI Assistant (AME-Bot)"');

  const aiSubtitlePattern = /(hero_card_4_subtitle:\s*\n\s*default:\s*")[^"]*"/g;
  settingsContent = settingsContent.replace(aiSubtitlePattern, '$1Chat with our knowledge base"');

  await fs.writeFile(settingsPath, settingsContent, 'utf-8');
  console.log('✅ Updated settings.yaml with new hero card links');
}

// ============================================================================
// Main Sync Logic
// ============================================================================

async function syncTopics() {
  console.log('🚀 Starting AME TechAssist Forum Structure Sync\n');

  // Load configuration
  const topicsConfig = await loadTopicConfig();
  console.log(`📋 Loaded ${topicsConfig.length} topic configurations\n`);

  let updated = false;

  // Process each topic
  for (const topic of topicsConfig) {
    console.log(`🔧 Processing: ${topic.title}`);

    // Load markdown content
    const markdownContent = await loadMarkdownFile(topic.instructions_file);

    if (!topic.topic_id) {
      // Create new topic
      console.log('   ⚠️  No topic_id found - creating new topic...');
      const result = await createTopic(topic.title, markdownContent);
      topic.topic_id = result.topic_id;
      updated = true;
      console.log(`   ✅ Created topic ID: ${topic.topic_id}`);
    } else {
      // Update existing topic
      console.log(`   📝 Updating existing topic ID: ${topic.topic_id}`);
      await updateTopicFirstPost(topic.topic_id, markdownContent);
      console.log('   ✅ Updated successfully');
    }

    console.log('');
  }

  // Save updated configuration if any topics were created
  if (updated) {
    await saveTopicConfig(topicsConfig);
    console.log('✅ Saved updated topic IDs to config/forum_topics.json\n');
  }

  // Update settings.yaml with new URLs
  await updateSettingsYaml(topicsConfig);

  console.log('\n🎉 Forum structure sync completed successfully!\n');
  console.log('Summary:');
  topicsConfig.forEach(topic => {
    const cardInfo = topic.hero_card_slot ? ` (Hero Card ${topic.hero_card_slot})` : '';
    console.log(`  - ${topic.title}${cardInfo}: /t/${topic.topic_id}`);
  });
}

// ============================================================================
// Welcome Topic Creation (Optional)
// ============================================================================

async function createWelcomeTopic() {
  console.log('\n📝 Creating Welcome / Start Here topic...');
  
  const welcomeContent = await loadMarkdownFile('content/welcome.md');
  const result = await createTopic('Welcome to AME TechAssist - Start Here', welcomeContent);
  
  console.log(`✅ Welcome topic created: /t/${result.topic_id}`);
  console.log('   You can pin this topic or link it from your site navigation.');
}

// ============================================================================
// CLI Entry Point
// ============================================================================

async function main() {
  validateEnvironment();

  try {
    await syncTopics();
    
    // Optionally create welcome topic
    const args = process.argv.slice(2);
    if (args.includes('--with-welcome')) {
      await createWelcomeTopic();
    }

    console.log('\n✨ All done! Deploy your theme to see the changes.\n');
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
