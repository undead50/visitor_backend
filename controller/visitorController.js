const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const prisma = new PrismaClient();
const fs = require('fs');
const dayjs = require('dayjs');
const path = require('path');
const utc = require('dayjs/plugin/utc'); // Import the UTC plugin
const timezone = require('dayjs/plugin/timezone'); // Import the timezone plugin

// Extend Day.js with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);



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
    const data = await prisma.Visitor.findMany({
      orderBy: {
        created_at: 'desc' // Assuming 'createdAt' is the field for creation timestamp
      }
    });
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
      body.department = parseInt(body.department);
      body.id_card_no = parseInt(body.id_card_no);
      body.status = 'C';
      body.check_in_time =  dayjs(body.check_in_time).toISOString();
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

const checkoutVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const updatedVisitorData = req.body;

    // Convert check_in_time string to Date object
    const checkOutTime = new Date(updatedVisitorData.check_out_time);

    // Adjust time to match Nepal time zone (UTC+5:45)
    checkOutTime.setHours(checkOutTime.getHours() + 5);
    checkOutTime.setMinutes(checkOutTime.getMinutes() + 45);

    // Set check_in_time in updatedVisitorData to adjusted time
    updatedVisitorData.check_out_time = checkOutTime;

    console.log(updatedVisitorData);

    // Update visitor data in the database
    const updatedVisitor = await prisma.visitor.update({
      where: { id: parseInt(visitorId) },
      data: updatedVisitorData,
    });

    res.status(200).json(updatedVisitor);
  } catch (error) {
    console.error('Error updating visitor:', error);
    res.status(500).json({ error: 'Failed to update visitor' });
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
      if(updatedVisitorData.department){
      updatedVisitorData.department = parseInt(updatedVisitorData.department)
      }
      if(updatedVisitorData.id_card_no){
        updatedVisitorData.id_card_no = parseInt(updatedVisitorData.id_card_no)
      }
      const updatedVisitor = await prisma.visitor.update({
        where: { id: parseInt(visitorId) },
        data: updatedVisitorData,
      });

      res.status(200).json(updatedVisitor);
    })
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
  checkoutVisitor,
};
