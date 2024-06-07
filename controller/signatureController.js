const { PrismaClient } = require('@prisma/client');
const axios= require('axios');
const prisma = new PrismaClient();


const callApiAndGetSignatures = async (accountNo,ipv4Address) => {
  try {
    
    let data = JSON.stringify({
      "acct": accountNo,
      "ipAddr": "192.168.204.99"
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.SIGNAURE_INQ_URL,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Basic dGVzdDE6ZWJsQDEyMw==', 
      },
      data : data
    };
    // const apiUrl = `http://localhost:8080/api/getSignature?accountNo=${accountNo}`;
    const response = await axios.request(config)

    // Assuming the API returns data in JSON format
    return response.data;
  } catch (error) {
    console.error('Error calling API:', error.message);
    throw error; // Re-throw the error for further handling if needed
  }
};

const fetchUserDetails = async (req,res)=>{
  console.log(req)
  console.log("x-real-ip")
  const clientIP = req.headers['x-real-ip'] || req.connection.remoteAddress;
  console.log("x-forwarded-for")
  console.log(req.headers['x-forwarded-for'])
  console.log(`clientIP : ${clientIP}`)
  const ipv4Address = req.ip.replace('::ffff:', '');
  console.log(ipv4Address)
  return res.send(clientIP)
}

const fetchSignatures = async (req, res) => {
  try {
    // Replace '01400101000009' with the actual account number you want to use
    const accountNo = req.params.accountNo;
    const ipv4Address = req.ip.replace('::ffff:', '');
    console.log(`client ip is ${ipv4Address}`)

    // Call the API and get signatures
    const signatures = await callApiAndGetSignatures(accountNo,ipv4Address);

    // Assuming you want to return the signatures as JSON
    return res.status(200).json(signatures);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close any necessary connections or resources here
    console.log('CBS API Called.')
  }
};

const createSignature = async (req, res) => {
  const  signatureObject  = req.body;
  const signature = await prisma.signature.create({
    data: signatureObject,
  });
  console.log('Created signature:', signature);
  res.status(200).json(signature);
};


const deleteSignature = async (req, res) => {
  const { signatureId } = req.params;
  try {
    // Delete the signature using Prisma's delete method
    const deletedSignature = await prisma.signature.delete({
      where: { id: parseInt(signatureId) },
    });

    res.status(200).json(deletedSignature);

    console.log(`Deleted signature with ID: ${deletedSignature.id}`);
  } catch (error) {
    console.error('Error deleting signature:', error);
  }
};

const  updateSignature = async (req, res) => {
  const { signatureId } = req.params;
  const updatedSignatureData = req.body;

  try {
    const updatedSignature = await prisma.signature.update({
      where: { id: parseInt(signatureId) },
      data: updatedSignatureData,
    });

    res.status(200).json(updatedSignature);
  } catch (error) {
    console.error('Error updating signature:', error);
    res.status(500).json({ error: 'Failed to update signature' });
  }
}

module.exports = { fetchSignatures, createSignature, deleteSignature, updateSignature,fetchUserDetails };