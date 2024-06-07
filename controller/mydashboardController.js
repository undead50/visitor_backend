const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchMydashboards = async (req, res) => {
  try {
    const data = await prisma.$queryRaw`SELECT STATUS,CAST(COUNT(*) AS CHAR) AS count FROM tbl_risk_master
    GROUP BY STATUS`
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createMydashboard = async (req, res) => {
  const  mydashboardObject  = req.body;
  const mydashboard = await prisma.mydashboard.create({
    data: mydashboardObject,
  });
  console.log('Created mydashboard:', mydashboard);
  res.status(200).json(mydashboard);
};


const deleteMydashboard = async (req, res) => {
  const { mydashboardId } = req.params;
  try {
    // Delete the mydashboard using Prisma's delete method
    const deletedMydashboard = await prisma.mydashboard.delete({
      where: { id: parseInt(mydashboardId) },
    });

    res.status(200).json(deletedMydashboard);

    console.log(`Deleted mydashboard with ID: ${deletedMydashboard.id}`);
  } catch (error) {
    console.error('Error deleting mydashboard:', error);
  }
};

const  updateMydashboard = async (req, res) => {
  const { mydashboardId } = req.params;
  const updatedMydashboardData = req.body;

  try {
    const updatedMydashboard = await prisma.mydashboard.update({
      where: { id: parseInt(mydashboardId) },
      data: updatedMydashboardData,
    });

    res.status(200).json(updatedMydashboard);
  } catch (error) {
    console.error('Error updating mydashboard:', error);
    res.status(500).json({ error: 'Failed to update mydashboard' });
  }
}

module.exports = { fetchMydashboards, createMydashboard, deleteMydashboard, updateMydashboard };