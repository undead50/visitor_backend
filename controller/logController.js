const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');
const prisma = new PrismaClient();

const fetchLogs = asyncHandler(async (req, res) => {
  try {
    const Docker = require('dockerode');
    var dockerHostIP = process.env.DOCKER_HOST_IP;
    var dockerHostPort = process.env.DOCKER_HOST_PORT;
    var docker = new Docker({ host: dockerHostIP, port: dockerHostPort });
    console.log(req.query.containerId);
    const container = docker.getContainer(req.query.containerId);
    const logs = await container.logs({ stdout: true, stderr: true });
    res.send(logs.toString());
  } catch (error) {
    console.error(error);
  } finally {
    // await prisma.$disconnect();
  }
});

const createLog = async (req, res) => {
  const logObject = req.body;
  const log = await prisma.log.create({
    data: logObject,
  });
  console.log('Created log:', log);
  res.status(200).json(log);
};

const deleteLog = async (req, res) => {
  const { logId } = req.params;
  try {
    // Delete the log using Prisma's delete method
    const deletedLog = await prisma.log.delete({
      where: { id: parseInt(logId) },
    });

    res.status(200).json(deletedLog);

    console.log(`Deleted log with ID: ${deletedLog.id}`);
  } catch (error) {
    console.error('Error deleting log:', error);
  }
};

const updateLog = async (req, res) => {
  const { logId } = req.params;
  const updatedLogData = req.body;

  try {
    const updatedLog = await prisma.log.update({
      where: { id: parseInt(logId) },
      data: updatedLogData,
    });

    res.status(200).json(updatedLog);
  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).json({ error: 'Failed to update log' });
  }
};

module.exports = { fetchLogs, createLog, deleteLog, updateLog };
