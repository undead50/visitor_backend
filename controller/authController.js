// const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const ldap = require('ldapjs');
const callAPI = require('../helpers/apims');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const adLoginUser = (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const domainName = username + '@CTZNBANK.COM';
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
  return res.status(200).json({
    Code: '0',
    Data: empDetail,
  });
  console.log(
    `username: ${username}, domainName: ${domainName}, password:${password} `
  );
  const client = ldap.createClient({
    url: process.env.LDAP_URL,
  });

  client.bind(domainName, password, (err) => {
    if (err) {
      res.status(401).send(err);
    } else {
      //GET THE EMPLOYEE DETAIL BASED ON DOMAIN NAME WHILE AUTHENTICATING
      const functionName = process.env.EMP_DETAIL_BY_DOMAIN;
      const requestModel = { domainUserName: `${username}` };

      async function fetchData() {
        const empDetail = await callAPI(functionName, requestModel);
        if (empDetail) {
          const accessToken = jwt.sign(
            { data: empDetail },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
          );
          empDetail.Data.token = accessToken;
          console.log(empDetail);
          const isSuperAdmin =
            await prisma.$queryRaw`SELECT * FROM tbl_user_privilege
          WHERE DomainUsername = ${username}
          AND Privilege IN ('Superadmin','Approver')`;
          console.log(isSuperAdmin);
          console.log(isSuperAdmin.length);
          empDetail.Data.isSuperAdmin =
            isSuperAdmin.length === 0 ? false : true;
          res.status(200).json(empDetail);
        } else {
          res.status(401).json({ Data: [{ data: 'Authentication Failed' }] });
        }
      }
      fetchData();
      //res.status(200).send('Authentication successful');
    }
    client.unbind();
  });
};

module.exports = { adLoginUser };
