const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchExecutionlogs = async (req, res) => {
  try {
    const data =
      await prisma.$queryRaw`select distinct task_id,bot_id from roboflow.tbl_execution_log`;
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const fetchTaskLogById = async (req, res) => {
  try {
    const { task_id } = req.query;
    const data =
      await prisma.$queryRaw`SELECT * FROM roboflow.tbl_execution_log WHERE task_id = ${task_id}`;
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createExecutionlog = async (req, res) => {
  const executionlogObject = req.body;
  const executionlog = await prisma.ExecutionLog.create({
    data: executionlogObject,
  });
  console.log('Created executionlog:', executionlog);
  res.status(200).json(executionlog);
};

const deleteExecutionlog = async (req, res) => {
  const { executionlogId } = req.params;
  try {
    // Delete the executionlog using Prisma's delete method
    const data =
      await prisma.$queryRaw`delete FROM roboflow.tbl_execution_log WHERE task_id = ${executionlogId}`;
    return res.status(200).json(data);

    // res.status(200).json(deletedExecutionlog);

    // console.log(`Deleted executionlog with ID: ${deletedExecutionlog.id}`);
  } catch (error) {
    console.error('Error deleting executionlog:', error);
  }
};

const updateExecutionlog = async (req, res) => {
  const { executionlogId } = req.params;
  const updatedExecutionlogData = req.body;

  try {
    const updatedExecutionlog = await prisma.ExecutionLog.update({
      where: { id: parseInt(executionlogId) },
      data: updatedExecutionlogData,
    });

    res.status(200).json(updatedExecutionlog);
  } catch (error) {
    console.error('Error updating executionlog:', error);
    res.status(500).json({ error: 'Failed to update executionlog' });
  }
};

module.exports = {
  fetchExecutionlogs,
  createExecutionlog,
  deleteExecutionlog,
  updateExecutionlog,
  fetchTaskLogById,
};
