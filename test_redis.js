import { Redis } from '@upstash/redis';
const redis = new Redis({
  url: 'https://leading-boar-43697.upstash.io',
  token: 'AaqxAAIgcDFiN2Y5YmYzYjYxZDc0YTQxOWY0OTg0MjM3ODFhNTIyNQ',
});
async function test() {
  const user = await redis.get('user:qwe');
  console.log(user);
}
test();
