const { PrismaClient } = require('@prisma/client');
const callAPI = require('../helpers/apims');
const prisma = new PrismaClient();

const fetchApplicants = async (req, res) => {
  try {
    const data = await prisma.Applicant.findMany();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const fetchUnverfiedApplicants = async (req, res) => {
  try {
    const functionName = process.env.fetchUnverifiedApplicantForms;
    const companyId = req.body.companyId;
    const requestModel = {
      "bankCode": "1101",
      "companyShareIds": [companyId],
      "paginationParam": {
      "page": "1",
      "size": "1000"
      }
     }
    console.log(requestModel); 
    const unverfiedAF = await callAPI(functionName, requestModel);
    console.log(unverfiedAF)
    if (unverfiedAF.Code === '0'){
      return res.status(200).json(unverfiedAF.Data.content);
    }
    else {
      return res.status(200).json([])
    }
    
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const createApplicant = async (req, res) => {
  const  applicantObject  = req.body;
  const applicant = await prisma.applicant.create({
    data: applicantObject,
  });
  console.log('Created applicant:', applicant);
  res.status(200).json(applicant);
};


const deleteApplicant = async (req, res) => {
  const { applicantId } = req.params;
  try {
    // Delete the applicant using Prisma's delete method
    const deletedApplicant = await prisma.applicant.delete({
      where: { id: parseInt(applicantId) },
    });

    res.status(200).json(deletedApplicant);

    console.log(`Deleted applicant with ID: ${deletedApplicant.id}`);
  } catch (error) {
    console.error('Error deleting applicant:', error);
  }
};

const  updateApplicant = async (req, res) => {
  const { applicantId } = req.params;
  const updatedApplicantData = req.body;

  try {
    const updatedApplicant = await prisma.applicant.update({
      where: { id: parseInt(applicantId) },
      data: updatedApplicantData,
    });

    res.status(200).json(updatedApplicant);
  } catch (error) {
    console.error('Error updating applicant:', error);
    res.status(500).json({ error: 'Failed to update applicant' });
  }
}

module.exports = { fetchApplicants, createApplicant, deleteApplicant, updateApplicant,fetchUnverfiedApplicants };