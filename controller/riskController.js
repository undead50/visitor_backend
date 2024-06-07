const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

const fetchRisks = async (req, res) => {

  console.log(req.query.branch_code)

  const { startDate, endDate } = req.query;

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
    if (req.query.branch_code === undefined) {
      let sql = ''
      if (startDate === undefined){
        sql = `SELECT a.*,b.branchDesc FROM tbl_risk_master a 
        JOIN tbl_sol b ON a.branch_code = b.branchCode WHERE CAST(a.created_at AS DATE) = '${getCurrentDate()}'`
      } else {
        sql = `
        SELECT a.*,b.branchDesc FROM tbl_risk_master a 
                JOIN tbl_sol b ON a.branch_code = b.branchCode 
          WHERE CAST(a.created_at AS DATE) BETWEEN '${startDate}' AND '${endDate}'`
      }
      const data = await prisma.$queryRawUnsafe(sql)
      return res.status(200).json(data);
      
    } else {
      let sql = ''
      if (startDate === undefined){
        sql = `SELECT a.*,b.branchDesc FROM tbl_risk_master a 
        JOIN tbl_sol b ON a.branch_code = b.branchCode where a.branch_code = ${req.query.branch_code} and CAST(a.created_at AS DATE) = '${getCurrentDate()}'`
      } else {
        sql = `
        SELECT a.*,b.branchDesc FROM tbl_risk_master a 
                JOIN tbl_sol b ON a.branch_code = b.branchCode 
          WHERE CAST(a.created_at AS DATE) BETWEEN '${startDate}' AND '${endDate}'  and a.branch_code = ${req.query.branch_code}`
      }
      const data = await prisma.$queryRawUnsafe(sql)
      // const data = await prisma.Risk.findMany({
      //   where: {
      //     branch_code: req.query.branch_code,
      //   },
      // });
      return res.status(200).json(data);
    }

    
    
    
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createRisk = async (req, res) => {
  const riskObject = req.body;
  const branchDesc = await prisma.$queryRaw`SELECT branchDesc FROM tbl_sol WHERE branchCode = ${riskObject.branch_code}`
  console.log(branchDesc[0].branchDesc)
  const risk = await prisma.risk.create({
    data: riskObject,
  });
  console.log('Created risk:', risk);
  risk.branchDesc = branchDesc[0].branchDesc
  res.status(200).json(risk);
};

const initiateAssessment = async (req, res) => {
  const sols = req.body.branch;
  console.log(sols)
  const assessment_data = {}
  console.log(typeof (sols))
  for (const sol of sols) {
    try {
      const risk = await prisma.risk.create({
        data : {
          assessment_data: assessment_data,
          branch_code: sol,
          status: 'INITIATED',
          initiated_by: req.body.initiated_by,
          remarks: req.body.remarks
        },
      });
      console.log('Created risk:',risk);
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  }
  
  res.status(200).json({status:"success"});
}


const calculateScore = async(req,res)=>{
  try {
    const { riskId } = req.params;
    const riskData = await prisma.$queryRaw`SELECT assessment_data FROM tbl_risk_master where id = ${riskId}`
    const processedData = riskData[0].assessment_data
    console.log(processedData)
    const categoryRiskData = await prisma.$queryRaw`SELECT a.question,b.categoryName,b.id AS categoryId,a.weightOfelement,a.ref FROM tbl_question a 
    JOIN tbl_category b ON a.categoryId = b.id`
  
    const categoryData = await prisma.$queryRaw`SELECT categoryName,weightOfelement,id,weightOfelement as categoryWeight  FROM tbl_category`
    
    const markWeighData = await prisma.$queryRaw`SELECT * FROM tbl_marking_weight`
    

    // res.status(200).json(data3)
    const assessmentSummary = []
    categoryData.map((category)=>{
      const listWeightScore = []
      categoryRiskData.map((key) => {
        const processedDataJson = JSON.parse(processedData)
        const filteredData = markWeighData.filter((mark) => mark.WeightId === processedDataJson[key.ref]);
        // console.log(filteredData[0].WeightOfelement)
        // let value = processedDataJson[key.ref] === 1 ? 100 : processedDataJson[key.ref] === 2 ? 50: processedDataJson[key.ref] === 3 ? 0: processedDataJson[key.ref] === 4 ? 100:100
        let value = filteredData[0].WeightOfelement
        if(key.categoryId == category.id){
          let avegareWeightScore = (parseInt(value) * parseInt(key.weightOfelement)) / 100
          listWeightScore.push(avegareWeightScore)
        }
      })
  
      const sum = listWeightScore.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);  
  
      const finalData = {
        categoryName: category.categoryName,
        totalSum: sum,
        categoryId: category.id,
        weightage: category.categoryWeight,
        weightageAverageScore: parseInt(sum) * parseInt(category.categoryWeight) / 100,
      }
  
      assessmentSummary.push(finalData)
  
    })
    // console.log(assessmentSummary)
    res.status(200).json(assessmentSummary)
  } catch (error) {
    res.status(500).json(error)
  }
}; 

const deleteRisk = async (req, res) => {
  const { riskId } = req.params;
  try {
    // Delete the risk using Prisma's delete method
    const deletedRisk = await prisma.risk.delete({
      where: { id: parseInt(riskId) },
    });

    res.status(200).json(deletedRisk);

    console.log(`Deleted risk with ID: ${deletedRisk.id}`);
  } catch (error) {
    console.error('Error deleting risk:', error);
  }
};

const updateRisk = async (req, res) => {
  const { riskId } = req.params;
  const updatedRiskData = req.body;
  const branchDescc = updatedRiskData.branchDesc
  delete updatedRiskData.branchDesc

  try {
    const updatedRisk = await prisma.risk.update({
      where: { id: parseInt(riskId) },
      data: updatedRiskData,
    });
    updatedRisk.branchDesc = branchDescc
    console.log(updatedRisk);
    res.status(200).json(updatedRisk);
  } catch (error) {
    console.error('Error updating risk:', error);
    res.status(500).json({ error: 'Failed to update risk' });
  }
};

module.exports = { fetchRisks, createRisk, deleteRisk, updateRisk,calculateScore,initiateAssessment };