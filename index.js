const express = require('express');
const cors = require('cors');
const trustproxy = require('trustproxy');
const multer = require('multer');

const upload = multer({ dest: 'files/' });

const homerouter = require('./routes/home');
const authRouter = require('./routes/authRoute');
const categoryRouter = require('./routes/categoryRoute');
const questionRouter = require('./routes/questionRoute');
const privilegeRouter = require('./routes/privilegeRoute');
const riskRouter = require('./routes/riskRoute');
const markRouter = require('./routes/markRoute');
const reportRouter = require('./routes/reportRoute');
const branchRouter = require('./routes/branchRoute');
const dashboardRouter = require('./routes/dashboardRoute');
const mydashboardRouter = require('./routes/mydashboardRoute');
const credentailRouter = require('./routes/credentailRoute');
const runnerRouter = require('./routes/runnerRoute');
const automationRouter = require('./routes/automationRoute');
const botRouter = require('./routes/botRoute');
const taskRouter = require('./routes/taskRoute');
const logRouter = require('./routes/logRoute');
const executionlogRouter = require('./routes/executionlogRoute');
const newtaskRouter = require('./routes/newtaskRoute');
const scheduleRouter = require('./routes/scheduleRoute');
const alertRouter = require('./routes/alertRoute');
const signtureRouter = require('./routes/signatureRoute');
const shareRouter = require('./routes/shareRoute');
const applicantRouter = require('./routes/applicantRoute');
const visitorRouter = require('./routes/visitorRoute');
const departmentRouter = require('./routes/departmentRoute');

//middleware Access
const {
  checkAPIKey,
  verifyTokenAdmin,
  verifyTokenAdminOrUser,
  verifyToken,
} = require('./middleware/auth');
const { listCategories } = require('./controller/categoryController');
const { verify } = require('jsonwebtoken');

const app = express();

//CORS (Cross-Origin Resource Sharing middleware)
app.use(cors());

//Setting up ENV in our project
require('dotenv').config();
app.use(express.json());
app.set('trust proxy', trustproxy(['loopback', 'linklocal', 'uniquelocal']));


//Router Inject
app.use(homerouter);
app.use('/api/auth', authRouter);
app.use('/api/visitor',visitorRouter);
app.use('/api/department',departmentRouter);
app.use('/api/category', verifyToken, categoryRouter);
app.use('/api/question', verifyToken, questionRouter);
app.use('/api/privilege', verifyToken, privilegeRouter);
app.use('/api/risk', verifyToken, riskRouter);
app.use('/api/mark', verifyToken, markRouter);
app.use('/api/report', verifyToken, reportRouter);
app.use('/api/branch', verifyToken, branchRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/mydashboard', verifyToken);
app.use('/api/credentail', verifyToken, credentailRouter);
app.use('/api/runner', verifyToken, runnerRouter);
app.use('/api/automation', verifyToken, automationRouter);
app.use('/api/bot', verifyToken, botRouter);
app.use('/api/task', verifyToken, taskRouter);
app.use('/api/log', verifyToken, logRouter);
app.use('/api/executionlog', verifyToken, executionlogRouter);
app.use('/api/newtask',verifyToken, newtaskRouter);
app.use('/api/schedule', verifyToken, scheduleRouter);
app.use('/api/alert', verifyToken, alertRouter);
app.use('/api/signature',signtureRouter);
app.use('/api/share',shareRouter);
app.use('/api/applicant',applicantRouter)
// Set the ip-address of your trusted reverse proxy server
app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
