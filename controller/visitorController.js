const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const prisma = new PrismaClient();
const fs = require('fs');
const dayjs = require('dayjs');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'files/', // Directory where uploaded files will be stored
  filename: (req, file, cb) => {
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage }); // Use.array to handle multiple files

const serveFile = async (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, '..', 'files', fileName); // Assuming files are stored in the 'files' directory

  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set the appropriate headers for the response
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Failed to serve file' });
  }
};

const fetchVisitors = async (req, res) => {
  try {
    const data = await prisma.Visitor.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createVisitor = async (req, res) => {
  try {
    upload.array('files')(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: 'File upload error', error: err.message });
      }

      // After successful file upload, proceed with your logic
      const body = req.body; // Access the request body
      const files = req.files; // Now contains an array of uploaded files
      body.uploaded_files = files;
      body.status = 'C';
      body.check_in_time = dayjs(body.check_in_time).toISOString();
      const visitor = await prisma.visitor.create({
        data: body,
      });
      // Send a response indicating success
      res
        .status(200)
        .json({ message: 'Visitor created successfully', files, visitor });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'An error occurred', error: error.message });
  }
};

const deleteVisitor = async (req, res) => {
  const { visitorId } = req.params;
  try {
    // Delete the visitor using Prisma's delete method
    const deletedVisitor = await prisma.visitor.delete({
      where: { id: parseInt(visitorId) },
    });

    res.status(200).json(deletedVisitor);

    console.log(`Deleted visitor with ID: ${deletedVisitor.id}`);
  } catch (error) {
    console.error('Error deleting visitor:', error);
  }
};

const updateVisitor = async (req, res) => {
  try {
    upload.array('files')(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: 'File upload error', error: err.message });
      }
      const { visitorId } = req.params;
      const updatedVisitorData = req.body;
      const files = req.files;
      console.log(files);
      console.log(updatedVisitorData);
      updatedVisitorData.uploaded_files = files;
      const updatedVisitor = await prisma.visitor.update({
        where: { id: parseInt(visitorId) },
        data: updatedVisitorData,
      });

      res.status(200).json(updatedVisitor);
    });
  } catch (error) {
    console.error('Error updating visitor:', error);
    res.status(500).json({ error: 'Failed to update visitor' });
  }
};

module.exports = {
  fetchVisitors,
  createVisitor,
  deleteVisitor,
  updateVisitor,
  serveFile,
};
