const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchEmployees = async (req, res) => {
  try {
    const data = await prisma.Employee.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createEmployee = async (req, res) => {
  const  employeeObject  = req.body;
  const employee = await prisma.employee.create({
    data: employeeObject,
  });
  console.log('Created employee:', employee);
  res.status(200).json(employee);
};


const deleteEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    // Delete the employee using Prisma's delete method
    const deletedEmployee = await prisma.employee.delete({
      where: { id: parseInt(employeeId) },
    });

    res.status(200).json(deletedEmployee);

    console.log(`Deleted employee with ID: ${deletedEmployee.id}`);
  } catch (error) {
    console.error('Error deleting employee:', error);
  }
};

const  updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployeeData = req.body;

  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(employeeId) },
      data: updatedEmployeeData,
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
}

module.exports = { fetchEmployees, createEmployee, deleteEmployee, updateEmployee };