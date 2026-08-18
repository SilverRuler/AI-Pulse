import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://leading-boar-43697.upstash.io',
  token: 'AaqxAAIgcDFiN2Y5YmYzYjYxZDc0YTQxOWY0OTg0MjM3ODFhNTIyNQ',
});

async function cleanDB() {
  console.log('--- Cleaning Upstash Redis ---');

  // 1. Clean Users
  const users = await redis.smembers('users:list');
  console.log(`Found ${users.length} users.`);
  
  for (const userId of users) {
    if (userId !== 'sr' && userId !== 'dmswk123' && userId !== 'admin') {
      console.log(`Deleting user: ${userId}`);
      await redis.del(`user:${userId}`);
      await redis.srem('users:list', userId);
    } else {
      console.log(`Keeping admin user: ${userId}`);
    }
  }

  // 2. Clean Subscribers
  const subscribers = await redis.lrange('subscribers:list', 0, -1);
  console.log(`Found ${subscribers.length} subscribers.`);
  
  const keepSubscribers = [];
  
  for (const sub of subscribers) {
    // sub is already parsed if it's JSON because of upstash/redis, or string
    let parsed = sub;
    if (typeof sub === 'string') {
      try { parsed = JSON.parse(sub); } catch(e) {}
    }
    
    // Check if the subscriber is an admin
    if (parsed && (parsed.userId === 'sr' || parsed.userId === 'dmswk123' || parsed.userId === 'admin')) {
      console.log(`Keeping admin subscriber: ${parsed.email || parsed}`);
      keepSubscribers.push(typeof sub === 'string' ? sub : JSON.stringify(sub));
    } else {
      console.log(`Deleting subscriber: ${parsed.email || parsed}`);
    }
  }

  // Replace subscribers list
  await redis.del('subscribers:list');
  if (keepSubscribers.length > 0) {
    await redis.rpush('subscribers:list', ...keepSubscribers);
  }
  
  console.log('--- Cleanup Complete ---');
}

cleanDB().catch(console.error);
