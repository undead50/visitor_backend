const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchDashboards = async (req, res) => {
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

const createDashboard = async (req, res) => {
  const  dashboardObject  = req.body;
  const dashboard = await prisma.dashboard.create({
    data: dashboardObject,
  });
  console.log('Created dashboard:', dashboard);
  res.status(200).json(dashboard);
};


const deleteDashboard = async (req, res) => {
  const { dashboardId } = req.params;
  try {
    // Delete the dashboard using Prisma's delete method
    const deletedDashboard = await prisma.dashboard.delete({
      where: { id: parseInt(dashboardId) },
    });

    res.status(200).json(deletedDashboard);

    console.log(`Deleted dashboard with ID: ${deletedDashboard.id}`);
  } catch (error) {
    console.error('Error deleting dashboard:', error);
  }
};

const  updateDashboard = async (req, res) => {
  const { dashboardId } = req.params;
  const updatedDashboardData = req.body;

  try {
    const updatedDashboard = await prisma.dashboard.update({
      where: { id: parseInt(dashboardId) },
      data: updatedDashboardData,
    });

    res.status(200).json(updatedDashboard);
  } catch (error) {
    console.error('Error updating dashboard:', error);
    res.status(500).json({ error: 'Failed to update dashboard' });
  }
}

module.exports = { fetchDashboards, createDashboard, deleteDashboard, updateDashboard };