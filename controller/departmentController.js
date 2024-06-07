const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchDepartments = async (req, res) => {
  try {
    const data = await prisma.Department.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createDepartment = async (req, res) => {
  const  departmentObject  = req.body;
  const department = await prisma.department.create({
    data: departmentObject,
  });
  console.log('Created department:', department);
  res.status(200).json(department);
};


const deleteDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    // Delete the department using Prisma's delete method
    const deletedDepartment = await prisma.department.delete({
      where: { id: parseInt(departmentId) },
    });

    res.status(200).json(deletedDepartment);

    console.log(`Deleted department with ID: ${deletedDepartment.id}`);
  } catch (error) {
    console.error('Error deleting department:', error);
  }
};

const  updateDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const updatedDepartmentData = req.body;

  try {
    const updatedDepartment = await prisma.department.update({
      where: { id: parseInt(departmentId) },
      data: updatedDepartmentData,
    });

    res.status(200).json(updatedDepartment);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ error: 'Failed to update department' });
  }
}

module.exports = { fetchDepartments, createDepartment, deleteDepartment, updateDepartment };