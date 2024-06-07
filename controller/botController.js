const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const prisma = new PrismaClient();
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'scripts/',
  filename: (req, file, cb) => {
    // Use the original filename instead of the generated one
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const fetchBots = async (req, res) => {
  try {
    const data = await prisma.Bot.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createBot = async (req, res) => {
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed' });
      }

      // Assuming you are using `upload.single('file')`, you can access the uploaded file using `req.file`
      const file = req.file;

      console.log(file);
      if (!file) {
        return res.status(400).json({ error: 'File is required' });
      }
      const reqBody = req.body;
      const botObject = {
        bot_id: reqBody.bot_id,
        version: reqBody.version,
        technology: reqBody.technology,
        status: reqBody.status,
        script_name: reqBody.fileName,
      };
      const bot = await prisma.bot.create({
        data: botObject,
      });
      console.log('Created bot:', bot);
      res.status(200).json(bot);
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const deleteBot = async (req, res) => {
  const { botId } = req.params;
  try {
    // Delete the bot using Prisma's delete method
    const deletedBot = await prisma.bot.delete({
      where: { id: parseInt(botId) },
    });

    res.status(200).json(deletedBot);

    console.log(`Deleted bot with ID: ${deletedBot.id}`);
  } catch (error) {
    console.error('Error deleting bot:', error);
  }
};

const updateBot = async (req, res) => {
  const { botId } = req.params;

  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed' });
      }

      // Assuming you are using `upload.single('file')`, you can access the uploaded file using `req.file`
      const file = req.file;

      console.log(file);
      if (!file) {
        return res.status(400).json({ error: 'File is required' });
      }
      const reqBody = req.body;
      const updatedBotData = {
        bot_id: reqBody.bot_id,
        version: reqBody.version,
        technology: reqBody.technology,
        status: reqBody.status,
        script_name: reqBody.fileName,
      };
      const updatedBot = await prisma.bot.update({
        where: { id: parseInt(botId) },
        data: updatedBotData,
      });

      res.status(200).json(updatedBot);
    });
  } catch (error) {
    console.error('Error updating bot:', error);
    res.status(500).json({ error: 'Failed to update bot' });
  }
};

module.exports = { fetchBots, createBot, deleteBot, updateBot };
