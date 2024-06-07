const { PrismaClient } = require('@prisma/client');
const callAPI = require('../helpers/apims');

const prisma = new PrismaClient();



const ValidateCRN = async (req, res) => {
  try {
    const functionName = process.env.ValidateCRN;
    const  customerObject  = req.body;
    const companyShares = await callAPI(functionName, customerObject);
    if (companyShares.Code === '0'){
      return res.status(200).json(companyShares);
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

const fetchCasbaBankCustomerDetail = async (req, res) => {
  try {
    const functionName = process.env.CasbaBankCustomerDetail;
    const { acctNo } = req.params;
    const requestModel = {
      "acc_no": acctNo
     }
    const companyShares = await callAPI(functionName, requestModel);
    if (companyShares.Code === '0'){
      return res.status(200).json(companyShares.Data.QueryResult[0]);
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

const fetchCompanyShareDetailsbyID = async (req, res) => {
  try {
    const functionName = process.env.companyShareDetailsbyID;
    const { shareId } = req.params;
    const requestModel = {
      "companyShareId": shareId
     }
    const companyShares = await callAPI(functionName, requestModel);
    if (companyShares.Code === '0'){
      return res.status(200).json(companyShares.Data);
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

const fetchShares = async (req, res) => {
  try {
    const functionName = process.env.fetchCompanyShares;
    const requestModel = {
      "empty": "",
      "paginationParam": {
      "page": "0",
      "size": "20"
      }
     
     }
    const companyShares = await callAPI(functionName, requestModel);
    if (companyShares.Code === '0'){
      return res.status(200).json(companyShares.Data.content);
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

const createShare = async (req, res) => {
  const  shareObject  = req.body;
  const share = await prisma.share.create({
    data: shareObject,
  });
  console.log('Created share:', share);
  res.status(200).json(share);
};


const deleteShare = async (req, res) => {
  const { shareId } = req.params;
  try {
    // Delete the share using Prisma's delete method
    const deletedShare = await prisma.share.delete({
      where: { id: parseInt(shareId) },
    });

    res.status(200).json(deletedShare);

    console.log(`Deleted share with ID: ${deletedShare.id}`);
  } catch (error) {
    console.error('Error deleting share:', error);
  }
};

const  updateShare = async (req, res) => {
  const { shareId } = req.params;
  const updatedShareData = req.body;

  try {
    const updatedShare = await prisma.share.update({
      where: { id: parseInt(shareId) },
      data: updatedShareData,
    });

    res.status(200).json(updatedShare);
  } catch (error) {
    console.error('Error updating share:', error);
    res.status(500).json({ error: 'Failed to update share' });
  }
}

module.exports = { fetchShares, createShare, deleteShare, updateShare,fetchCompanyShareDetailsbyID,fetchCasbaBankCustomerDetail,ValidateCRN };