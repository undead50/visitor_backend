const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchCredentials = async (req, res) => {
  try {
    const data = await prisma.Credential.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createCredential = async (req, res) => {
  const credentailObject = req.body;
  const credentail = await prisma.credential.create({
    data: credentailObject,
  });
  console.log('Created credentail:', credentail);
  res.status(200).json(credentail);
};

const deleteCredential = async (req, res) => {
  const { credentailId } = req.params;
  try {
    // Delete the credentail using Prisma's delete method
    const deletedCredentail = await prisma.credential.delete({
      where: { id: parseInt(credentailId) },
    });

    res.status(200).json(deletedCredentail);

    console.log(`Deleted credentail with ID: ${deletedCredentail.id}`);
  } catch (error) {
    console.error('Error deleting credentail:', error);
  }
};

const updateCredential = async (req, res) => {
  const { credentailId } = req.params;
  const updatedCredentailData = req.body;

  try {
    const updatedCredentail = await prisma.credential.update({
      where: { id: parseInt(credentailId) },
      data: updatedCredentailData,
    });

    res.status(200).json(updatedCredentail);
  } catch (error) {
    console.error('Error updating credentail:', error);
    res.status(500).json({ error: 'Failed to update credentail' });
  }
};

module.exports = {
  fetchCredentials,
  createCredential,
  deleteCredential,
  updateCredential,
};
