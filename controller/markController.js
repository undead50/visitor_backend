const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchMarks = async (req, res) => {
  try {
    const data = await prisma.$queryRaw`SELECT * FROM tbl_marking_weight`
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createMark = async (req, res) => {
  const  markObject  = req.body;
  const mark = await prisma.mark.create({
    data: markObject,
  });
  console.log('Created mark:', mark);
  res.status(200).json(mark);
};


const deleteMark = async (req, res) => {
  const { markId } = req.params;
  try {
    // Delete the mark using Prisma's delete method
    const deletedMark = await prisma.mark.delete({
      where: { id: parseInt(markId) },
    });

    res.status(200).json(deletedMark);

    console.log(`Deleted mark with ID: ${deletedMark.id}`);
  } catch (error) {
    console.error('Error deleting mark:', error);
  }
};

const  updateMark = async (req, res) => {
  const { markId } = req.params;
  const updatedMarkData = req.body;

  try {
    const updatedMark = await prisma.mark.update({
      where: { id: parseInt(markId) },
      data: updatedMarkData,
    });

    res.status(200).json(updatedMark);
  } catch (error) {
    console.error('Error updating mark:', error);
    res.status(500).json({ error: 'Failed to update mark' });
  }
}

module.exports = { fetchMarks, createMark, deleteMark, updateMark };