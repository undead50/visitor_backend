const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchNewtasks = async (req, res) => {
  try {
    const data = await prisma.Newtask.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createNewtask = async (req, res) => {
  const  newtaskObject  = req.body;
  const newtask = await prisma.newtask.create({
    data: newtaskObject,
  });
  console.log('Created newtask:', newtask);
  res.status(200).json(newtask);
};


const deleteNewtask = async (req, res) => {
  const { newtaskId } = req.params;
  try {
    // Delete the newtask using Prisma's delete method
    const deletedNewtask = await prisma.newtask.delete({
      where: { id: parseInt(newtaskId) },
    });

    res.status(200).json(deletedNewtask);

    console.log(`Deleted newtask with ID: ${deletedNewtask.id}`);
  } catch (error) {
    console.error('Error deleting newtask:', error);
  }
};

const  updateNewtask = async (req, res) => {
  const { newtaskId } = req.params;
  const updatedNewtaskData = req.body;

  try {
    const updatedNewtask = await prisma.newtask.update({
      where: { id: parseInt(newtaskId) },
      data: updatedNewtaskData,
    });

    res.status(200).json(updatedNewtask);
  } catch (error) {
    console.error('Error updating newtask:', error);
    res.status(500).json({ error: 'Failed to update newtask' });
  }
}

module.exports = { fetchNewtasks, createNewtask, deleteNewtask, updateNewtask };