/**
 * DeckController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  // GET /deck - Lấy danh sách deck với search
  index: async (req, res) => {
    try {
      const { search } = req.query;
      let criteria = {};
      
      if (search) {
        criteria.title = { contains: search };
      }
      
      const decks = await Deck.find(criteria).sort('createdAt DESC');
      
      if (req.wantsJSON) {
        return res.json(decks);
      }
      
      return res.view('pages/deck/list', { decks, search });
    } catch (error) {
      console.error('❌ Error in DeckController.index:', error);
      return res.serverError(error);
    }
  },

  // GET /deck/get - API endpoint để lấy danh sách deck
  find: async (req, res) => {
    try {
      const { search } = req.query;
      let criteria = {};
      
      if (search) {
        criteria.title = { contains: search };
      }
      
      const decks = await Deck.find(criteria).sort('createdAt DESC');
      return res.json(decks);
    } catch (error) {
      console.error('❌ Error in DeckController.find:', error);
      return res.serverError(error);
    }
  },

  // GET /deck/new - Hiển thị form tạo deck mới
  new: async (req, res) => {
    return res.view('pages/deck/new');
  },

  // POST /deck - Tạo deck mới
  create: async (req, res) => {
    try {
      const { title, imageUrl, description } = req.body;
      
      // Process cards from form data
      let cards = [];
      if (req.body.cards) {
        // Handle array of cards from form
        if (Array.isArray(req.body.cards)) {
          cards = req.body.cards.filter(card => card.front || card.back);
        } else {
          // Handle single card object
          cards = [req.body.cards];
        }
      }
      
      console.log('📝 Creating deck with data:', { title, imageUrl, description, cards });
      
      const newDeck = await Deck.create({
        title,
        imageUrl: imageUrl || null,
        description: description || null,
        cards: cards || []
      }).fetch();
      
      console.log('✅ Created deck:', newDeck);
      
      if (req.wantsJSON) {
        return res.json(newDeck);
      }
      
      return res.redirect('/deck');
    } catch (error) {
      console.error('❌ Error in DeckController.create:', error);
      return res.serverError(error);
    }
  },

  // GET /deck/:id - Hiển thị chi tiết deck
  show: async (req, res) => {
    try {
      const deck = await Deck.findOne({ id: req.params.id });
      
      if (!deck) {
        return res.notFound();
      }
      
      if (req.wantsJSON) {
        return res.json(deck);
      }
      
      return res.view('pages/deck/show', { deck });
    } catch (error) {
      console.error('❌ Error in DeckController.show:', error);
      return res.serverError(error);
    }
  },

  // GET /deck/:id/edit - Hiển thị form chỉnh sửa deck
  edit: async (req, res) => {
    try {
      const deck = await Deck.findOne({ id: req.params.id });
      
      if (!deck) {
        return res.notFound();
      }
      
      return res.view('pages/deck/edit', { deck });
    } catch (error) {
      console.error('❌ Error in DeckController.edit:', error);
      return res.serverError(error);
    }
  },

  // PUT /deck/:id - Cập nhật deck
  update: async (req, res) => {
    try {
      // Check for method override
      if (req.body._method && req.body._method.toUpperCase() === 'PUT') {
        console.log('🔄 Method override detected: PUT');
      }
      
      const { title, imageUrl, description } = req.body;
      
      // Process cards from form data
      let cards = [];
      if (req.body.cards) {
        if (Array.isArray(req.body.cards)) {
          cards = req.body.cards.filter(card => card.front || card.back);
        } else {
          cards = [req.body.cards];
        }
      }
      
      console.log('📝 Updating deck with data:', { 
        id: req.params.id, 
        title, 
        imageUrl, 
        description, 
        cards,
        method: req.method,
        _method: req.body._method 
      });
      
      const updatedDeck = await Deck.updateOne({ id: req.params.id })
        .set({
          title,
          imageUrl: imageUrl || null,
          description: description || null,
          cards: cards || []
        });
      
      if (!updatedDeck) {
        return res.notFound();
      }
      
      console.log('✅ Updated deck:', updatedDeck);
      
      if (req.wantsJSON) {
        return res.json(updatedDeck);
      }
      
      return res.redirect('/deck');
    } catch (error) {
      console.error('❌ Error in DeckController.update:', error);
      return res.serverError(error);
    }
  },

  // DELETE /deck/:id - Xóa deck
  destroy: async (req, res) => {
    try {
      console.log('🗑️ Deleting deck:', req.params.id, 'Method:', req.method, '_method:', req.body._method);
      
      const deletedDeck = await Deck.destroyOne({ id: req.params.id });
      
      if (!deletedDeck) {
        return res.notFound();
      }
      
      console.log('✅ Deleted deck:', deletedDeck);
      
      if (req.wantsJSON) {
        return res.json({ message: 'Deck deleted successfully' });
      }
      
      return res.redirect('/deck');
    } catch (error) {
      console.error('❌ Error in DeckController.destroy:', error);
      return res.serverError(error);
    }
  }

};

