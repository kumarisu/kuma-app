/**
 * DeckController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  find: async (req, res) => {
    try {
      console.log('📋 DeckController.find called');
      const decks = await Deck.find();
      console.log('📊 Found decks:', decks.length, 'items');
      console.log('📝 Decks data:', decks);
      return res.json(decks);
    } catch (error) {
      console.error('❌ Error in DeckController.find:', error);
      return res.serverError(error);
    }
  }

};

