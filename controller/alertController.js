const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchAlerts = async (req, res) => {
  try {
    const data = await prisma.Alert.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createAlert = async (req, res) => {
  const  alertObject  = req.body;
  const alert = await prisma.alert.create({
    data: alertObject,
  });
  console.log('Created alert:', alert);
  res.status(200).json(alert);
};


const deleteAlert = async (req, res) => {
  const { alertId } = req.params;
  try {
    // Delete the alert using Prisma's delete method
    const deletedAlert = await prisma.alert.delete({
      where: { id: parseInt(alertId) },
    });

    res.status(200).json(deletedAlert);

    console.log(`Deleted alert with ID: ${deletedAlert.id}`);
  } catch (error) {
    console.error('Error deleting alert:', error);
  }
};

const  updateAlert = async (req, res) => {
  const { alertId } = req.params;
  const updatedAlertData = req.body;

  try {
    const updatedAlert = await prisma.alert.update({
      where: { id: parseInt(alertId) },
      data: updatedAlertData,
    });

    res.status(200).json(updatedAlert);
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
}

module.exports = { fetchAlerts, createAlert, deleteAlert, updateAlert };