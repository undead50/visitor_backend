const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchPrivileges = async (req, res) => {
  try {
    const data = await prisma.Privilege.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createPrivilege = async (req, res) => {
  const privilegeObject = req.body;
  const privilege = await prisma.privilege.create({
    data: privilegeObject,
  });
  console.log('Created privilege:', privilege);
  res.status(200).json(privilege);
};

const deletePrivilege = async (req, res) => {
  const { privilegeId } = req.params;
  try {
    // Delete the privilege using Prisma's delete method
    const deletedPrivilege = await prisma.privilege.delete({
      where: { id: parseInt(privilegeId) },
    });

    res.status(200).json(deletedPrivilege);

    console.log(`Deleted privilege with ID: ${deletedPrivilege.id}`);
  } catch (error) {
    console.error('Error deleting privilege:', error);
  }
};

const updatePrivilege = async (req, res) => {
  const { id } = req.body;
  const updatedPrivilegeData = req.body;

  try {
    const updatedPrivilege = await prisma.privilege.update({
      where: { id: parseInt(id) },
      data: updatedPrivilegeData,
    });

    res.status(200).json(updatedPrivilege);
  } catch (error) {
    console.error('Error updating privilege:', error);
    res.status(500).json({ error: 'Failed to update privilege' });
  }
};

module.exports = {
  fetchPrivileges,
  createPrivilege,
  deletePrivilege,
  updatePrivilege,
};
