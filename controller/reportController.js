const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fetchReports = async (req, res) => {

  const getCurrentDate = () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns 0-11
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    console.log(formattedDate);
    return formattedDate
  }
  try {
    const { startDate, endDate } = req.query;
    console.log(startDate)
    console.log(endDate)
    const categoryRiskData = await prisma.$queryRaw`SELECT a.question,b.categoryName,b.id AS categoryId,a.weightOfelement,a.ref FROM tbl_question a 
    JOIN tbl_category b ON a.categoryId = b.id`
  
    const categoryData = await prisma.$queryRaw`SELECT categoryName,weightOfelement,id,weightOfelement as categoryWeight  FROM tbl_category`
    
    const markWeighData = await prisma.$queryRaw`SELECT * FROM tbl_marking_weight`

    let sql = ''
    if (startDate === undefined){
      sql = `SELECT a.*,b.branchDesc FROM tbl_risk_master a JOIN tbl_sol b ON a.branch_code = b.branchCode WHERE a.status NOT IN ('DRAFT','INITIATED') and CAST(created_at AS DATE) = '${getCurrentDate()}'`
    } else {
      sql = `SELECT a.*,b.branchDesc FROM tbl_risk_master a JOIN tbl_sol b ON a.branch_code = b.branchCode WHERE a.status NOT IN ('DRAFT','INITIATED') AND CAST(created_at AS DATE) BETWEEN '${startDate}' AND '${endDate}'`
    }
    
    const data = await prisma.$queryRawUnsafe(sql)
    const reportDataList = []
    data.map((riskData) => {
      let weightageAverageScoreList = []
      categoryData.map((category) => {
        const listWeightScore = []
        categoryRiskData.map((key) => {
          const processedDataJson = JSON.parse(riskData.assessment_data)
          const filteredData = markWeighData.filter((mark) => mark.WeightId === processedDataJson[key.ref]);
          // console.log(filteredData[0].WeightOfelement)
          // let value = processedDataJson[key.ref] === 1 ? 100 : processedDataJson[key.ref] === 2 ? 50: processedDataJson[key.ref] === 3 ? 0: processedDataJson[key.ref] === 4 ? 100:100
          let value = filteredData[0].WeightOfelement
          if (key.categoryId == category.id) {
            let avegareWeightScore = (parseInt(value) * parseInt(key.weightOfelement)) / 100
            listWeightScore.push(avegareWeightScore)
          }
        })
  
        const sum = listWeightScore.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
        let weightageAverageScore = parseInt(sum) * parseInt(category.categoryWeight) / 100
        weightageAverageScoreList.push(weightageAverageScore)
      })

      
       const sumOfWeightageAverageScore = weightageAverageScoreList.reduce((accumulator, currentObj) => {
          return accumulator + currentObj;
       }, 0);
      
      // console.log(sumOfWeightageAverageScore)
      riskData.sumOfWeightageAverageScore = sumOfWeightageAverageScore
      riskData.key = riskData.id
      riskData.riskRating = riskData.sumOfWeightageAverageScore < 20 ? 'Low': riskData.sumOfWeightageAverageScore > 70 ? 'High': 'Medium'
      reportDataList.push(riskData)
      // console.log(riskData) 
      
    })
    return res.status(200).json(reportDataList);  
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createReport = async (req, res) => {
  const  reportObject  = req.body;
  const report = await prisma.report.create({
    data: reportObject,
  });
  console.log('Created report:', report);
  res.status(200).json(report);
};


const deleteReport = async (req, res) => {
  const { reportId } = req.params;
  try {
    // Delete the report using Prisma's delete method
    const deletedReport = await prisma.report.delete({
      where: { id: parseInt(reportId) },
    });

    res.status(200).json(deletedReport);

    console.log(`Deleted report with ID: ${deletedReport.id}`);
  } catch (error) {
    console.error('Error deleting report:', error);
  }
};

const  updateReport = async (req, res) => {
  const { reportId } = req.params;
  const updatedReportData = req.body;

  try {
    const updatedReport = await prisma.report.update({
      where: { id: parseInt(reportId) },
      data: updatedReportData,
    });

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
}

module.exports = { fetchReports, createReport, deleteReport, updateReport };