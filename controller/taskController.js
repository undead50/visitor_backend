const { PrismaClient } = require('@prisma/client');
const Docker = require('dockerode');
const prisma = new PrismaClient();

// Create a new Docker client
// const docker = new Docker();
var dockerHostIP = process.env.DOCKER_HOST_IP;
var dockerHostPort = process.env.DOCKER_HOST_PORT;
var docker = new Docker({ host: dockerHostIP, port: dockerHostPort });
const fetchTasks = async (req, res) => {
  try {
    // const container = docker.getContainer(
    //   '2154f937b1f93ae5ab25e0eb720280095ca16f9ec2bece9a969edfce5e859630'
    // );

    // container.logs(
    //   { follow: true, stdout: true, stderr: true },
    //   function (err, stream) {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }

    //     stream.setEncoding('utf8');

    //     stream.on('data', function (chunk) {
    //       console.log(chunk);
    //     });

    //     stream.on('end', function () {
    //       console.log('Container logs stream ended');
    //     });

    //     stream.on('error', function (err) {
    //       console.error('Error reading container logs:', err.message);
    //     });
    //   }
    // );
    // const data = await prisma.Task.findMany();
    docker.listContainers({ all: true }, (err, containers) => {
      if (err) {
        console.error(err);
        return;
      }
      // Print the list of containers
      containers.forEach((container) => {
        // console.log(container);
        // console.log(container.Names);
      });
      return res.status(200).json(containers);
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createTask = async (req, res) => {
  const taskObject = req.body;
  const task = await prisma.task.create({
    data: taskObject,
  });
  console.log('Created task:', task);
  res.status(200).json(task);
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    // Delete the task using Prisma's delete method
    const deletedTask = await prisma.task.delete({
      where: { id: parseInt(taskId) },
    });

    res.status(200).json(deletedTask);

    console.log(`Deleted task with ID: ${deletedTask.id}`);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

const getBotTask = async (req, res) => {
  const { client_ip } = req.body;
  try {
    const result = await prisma.$queryRaw`
    SELECT
      c.runner_name,
      c.remote_access,
      a.minimum_run_date,
      a.priority AS task_priority,
      a.params AS task_param,
      a.id AS task_id,
      b.notify_user,
      b.priority AS automation_priority,
      b.params AS automation_param,
      bot_id,
      script_name AS script_to_execute
    FROM
      tbl_new_task a
      JOIN tbl_automation b ON a.automation_id = b.id
      JOIN tbl_runner c ON b.runners_attached = c.id
      JOIN tbl_bot d ON b.agent_attached = d.id
    WHERE
      a.status = 'P' AND 
      c.remote_access = ${client_ip}
  `;
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error executing raw query:', error);
  } finally {
    await prisma.$disconnect();
  }
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updatedTaskData = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: updatedTaskData,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

module.exports = { fetchTasks, createTask, deleteTask, updateTask, getBotTask };
