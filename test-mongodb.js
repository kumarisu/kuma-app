/**
 * Test MongoDB connection and create sample Deck data
 */

const sails = require('sails');

// Start Sails.js without HTTP server
sails.lift({
  // Override default settings here
  hooks: {
    grunt: false, // disable grunt hook for this test
    http: false,  // disable HTTP server
    sockets: false, // disable sockets
    views: false,   // disable views hook
    blueprints: false, // disable blueprints for this test
  },
  log: {
    level: 'info'
  }
}, async function(err) {
  if (err) {
    console.error('Failed to lift Sails:', err);
    return process.exit(1);
  }

  try {
    console.log('🚀 Connected to MongoDB successfully!');
    
    // Clear existing data for clean test
    await Deck.destroy({});
    console.log('🧹 Cleared existing deck data');
    
    // Test creating a sample deck
    const sampleDeck = await Deck.create({
      title: 'Sample Deck',
      imageUrl: 'https://example.com/sample-image.jpg',
      description: 'This is a sample deck for testing',
      cards: [
        {
          id: '1',
          front: 'What is JavaScript?',
          back: 'A programming language used for web development'
        },
        {
          id: '2', 
          front: 'What is Node.js?',
          back: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine'
        }
      ]
    }).fetch();

    console.log('✅ Created sample deck:', sampleDeck);

    // Test finding all decks
    const allDecks = await Deck.find();
    console.log('📚 All decks in database:', allDecks);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Lower Sails.js (terminate the app)
    sails.lower(function() {
      console.log('👋 Sails lowered.');
      process.exit(0);
    });
  }
});
