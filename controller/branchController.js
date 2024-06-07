const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchBranchs = async (req, res) => {
  try {
    const data = await await prisma.$queryRaw`SELECT branchCode,branchDesc FROM tbl_sol`;
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createBranch = async (req, res) => {
  const  branchObject  = req.body;
  const branch = await prisma.branch.create({
    data: branchObject,
  });
  console.log('Created branch:', branch);
  res.status(200).json(branch);
};


const deleteBranch = async (req, res) => {
  const { branchId } = req.params;
  try {
    // Delete the branch using Prisma's delete method
    const deletedBranch = await prisma.branch.delete({
      where: { id: parseInt(branchId) },
    });

    res.status(200).json(deletedBranch);

    console.log(`Deleted branch with ID: ${deletedBranch.id}`);
  } catch (error) {
    console.error('Error deleting branch:', error);
  }
};

const  updateBranch = async (req, res) => {
  const { branchId } = req.params;
  const updatedBranchData = req.body;

  try {
    const updatedBranch = await prisma.branch.update({
      where: { id: parseInt(branchId) },
      data: updatedBranchData,
    });

    res.status(200).json(updatedBranch);
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({ error: 'Failed to update branch' });
  }
}

module.exports = { fetchBranchs, createBranch, deleteBranch, updateBranch };