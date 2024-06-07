const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchRunnerById = async (req, res) => {
  try {
    const { remote_access } = req.params; // assuming id is passed in the request parameters
    const runner = await prisma.Runner.findMany({
      where: {
        remote_access: remote_access,
      },
    });

    if (!runner) {
      return res.status(404).json({ error: 'Runner not found' });
    }

    return res.status(200).json(runner);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'An error occurred while fetching the runner' });
  } finally {
    await prisma.$disconnect();
  }
};

const fetchRunners = async (req, res) => {
  try {
    const data = await prisma.Runner.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createRunner = async (req, res) => {
  const runnerObject = req.body;
  const runner = await prisma.runner.create({
    data: runnerObject,
  });
  console.log('Created runner:', runner);
  res.status(200).json(runner);
};

const deleteRunner = async (req, res) => {
  const { runnerId } = req.params;
  try {
    // Delete the runner using Prisma's delete method
    const deletedRunner = await prisma.runner.delete({
      where: { id: parseInt(runnerId) },
    });

    res.status(200).json(deletedRunner);

    console.log(`Deleted runner with ID: ${deletedRunner.id}`);
  } catch (error) {
    console.error('Error deleting runner:', error);
  }
};

const updateRunner = async (req, res) => {
  const { runnerId } = req.params;
  const updatedRunnerData = req.body;

  try {
    const updatedRunner = await prisma.runner.update({
      where: { id: parseInt(runnerId) },
      data: updatedRunnerData,
    });

    res.status(200).json(updatedRunner);
  } catch (error) {
    console.error('Error updating runner:', error);
    res.status(500).json({ error: 'Failed to update runner' });
  }
};

module.exports = {
  fetchRunners,
  createRunner,
  deleteRunner,
  updateRunner,
  fetchRunnerById,
};
