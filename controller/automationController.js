const { PrismaClient } = require('@prisma/client');
const Docker = require('dockerode');
const prisma = new PrismaClient();

// Create a new Docker client
const docker = new Docker();

const fetchAutomations = async (req, res) => {
  try {
    const data = await prisma.Automation.findMany();
    // docker.listImages((err, images) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }

    //   // Print the list of images
    //   images.forEach((image) => {
    //     console.log(image.RepoTags);
    //   });
    // });

    // Get a list of running Docker containers
    console.log('containerlist');
    // docker.listContainers({ all: true }, (err, containers) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }

    //   // Print the list of containers
    //   containers.forEach((container) => {
    //     // console.log(container);
    //     // console.log(container.Names);
    //   });
    //   console.log(containers);
    // });
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createAutomation = async (req, res) => {
  const automationObject = req.body;
  const automation = await prisma.automation.create({
    data: automationObject,
  });
  console.log('Created automation:', automation);
  res.status(200).json(automation);
};

const deleteAutomation = async (req, res) => {
  const { automationId } = req.params;
  try {
    // Delete the automation using Prisma's delete method
    const deletedAutomation = await prisma.automation.delete({
      where: { id: parseInt(automationId) },
    });

    res.status(200).json(deletedAutomation);

    console.log(`Deleted automation with ID: ${deletedAutomation.id}`);
  } catch (error) {
    console.error('Error deleting automation:', error);
  }
};

const updateAutomation = async (req, res) => {
  const { automationId } = req.params;
  const updatedAutomationData = req.body;

  try {
    const updatedAutomation = await prisma.automation.update({
      where: { id: parseInt(automationId) },
      data: updatedAutomationData,
    });

    res.status(200).json(updatedAutomation);
  } catch (error) {
    console.error('Error updating automation:', error);
    res.status(500).json({ error: 'Failed to update automation' });
  }
};

module.exports = {
  fetchAutomations,
  createAutomation,
  deleteAutomation,
  updateAutomation,
};
