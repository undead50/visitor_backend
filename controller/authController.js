// Import necessary modules
const jwt = require('jsonwebtoken');
const ldap = require('ldapjs');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

// Define the function for Active Directory login
const adLoginUser = (req, res) => {
  const { username, password } = req.body;
  const domainName = `${username}@ebl.com.np`;
  
  const empDetail = {
    domainUserName: 'ayush.pradhan',
    solId: '001',
    email: 'test@gmail.com',
    departmentName: 'IT',
    isSuperAdmin: true,
    employeeName: 'AYUSH.PRADHAN',
  };

  const accessToken = jwt.sign({ data: empDetail }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  empDetail.token = accessToken;

  console.log(`username: ${username}, domainName: ${domainName}`);

  const client = ldap.createClient({
    url: process.env.LDAP_URL,
  });

  client.bind(domainName, password, (err) => {
    if (err) {
      // Check if the error is due to invalid credentials
      if (err.message === 'Invalid Credentials') {
        // Return a more descriptive error message
        return res.status(401).json({ error: 'Invalid username or password' });
      } else {
        // For other errors, return the actual error message
        return res.status(401).json({ error: err.message });
      }
    } else {
      async function getEmployee(){
        const sql = `select * from tbl_employee where "domainName" = '${username}'`
        const data =  await prisma.$queryRawUnsafe(sql)
        console.log(data)
        if (data && data.length > 0) {
          const response = { Code: "0", Data: data[0] };
          return res.status(200).json(response);
        } else {
          return res.status(404).json({ error: "Employee not found" });
        }
      }
      getEmployee()
      
    }
    client.unbind();
  });
};

// Export the Active Directory login function
module.exports = { adLoginUser };
