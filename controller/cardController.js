const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchCards = async (req, res) => {
  try {
    const data = await prisma.Card.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createCard = async (req, res) => {
  const  cardObject  = req.body;
  const card = await prisma.card.create({
    data: cardObject,
  });
  console.log('Created card:', card);
  res.status(200).json(card);
};


const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    // Delete the card using Prisma's delete method
    const deletedCard = await prisma.card.delete({
      where: { id: parseInt(cardId) },
    });

    res.status(200).json(deletedCard);

    console.log(`Deleted card with ID: ${deletedCard.id}`);
  } catch (error) {
    console.error('Error deleting card:', error);
  }
};

const  updateCard = async (req, res) => {
  const { cardId } = req.params;
  const updatedCardData = req.body;

  try {
    const updatedCard = await prisma.card.update({
      where: { id: parseInt(cardId) },
      data: updatedCardData,
    });

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
}

module.exports = { fetchCards, createCard, deleteCard, updateCard };