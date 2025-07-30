const User = require('../models/User');

const DEFAULT_USERS = [
  'Rahul',
  'Kamal',
  'Sanak',
  'Aisha',
  'Rohan',
  'Neha',
  'Vikram',
  'Priya',
  'Ankit',
  'Sneha'
];

async function seedInitialUsers() {
  const count = await User.countDocuments();
  if (count > 0) {
    console.log(`Users already present (${count}). Skipping seed.`);
    return;
  }

  const docs = DEFAULT_USERS.map((name) => ({ name }));
  await User.insertMany(docs);
  console.log('Seeded initial 10 users.');
}

module.exports = { seedInitialUsers };
