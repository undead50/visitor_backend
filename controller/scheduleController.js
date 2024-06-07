const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchSchedules = async (req, res) => {
  try {
    const data = await prisma.Schedule.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createSchedule = async (req, res) => {
  const  scheduleObject  = req.body;
  const schedule = await prisma.schedule.create({
    data: scheduleObject,
  });
  console.log('Created schedule:', schedule);
  res.status(200).json(schedule);
};


const deleteSchedule = async (req, res) => {
  const { scheduleId } = req.params;
  try {
    // Delete the schedule using Prisma's delete method
    const deletedSchedule = await prisma.schedule.delete({
      where: { id: parseInt(scheduleId) },
    });

    res.status(200).json(deletedSchedule);

    console.log(`Deleted schedule with ID: ${deletedSchedule.id}`);
  } catch (error) {
    console.error('Error deleting schedule:', error);
  }
};

const  updateSchedule = async (req, res) => {
  const { scheduleId } = req.params;
  const updatedScheduleData = req.body;

  try {
    const updatedSchedule = await prisma.schedule.update({
      where: { id: parseInt(scheduleId) },
      data: updatedScheduleData,
    });

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
}

module.exports = { fetchSchedules, createSchedule, deleteSchedule, updateSchedule };