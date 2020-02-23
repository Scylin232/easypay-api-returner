const axios = require('axios');
const cors = require('cors');
const express = require('express');
const mongo = require('./mongo');

const appPort = process.env.PORT || 4515
const app = express();

app.use(cors());

app.get('/wallets', async (req, res) => {
  try {
    const easyPayParams = await mongo.tokenModel.findById('5e4e37a0d5b4492364eeda92').lean();
    if (easyPayParams.pageId === undefined) {
      return await res.status(401).send('Token is unvailable.');
    };
    const easypay = await axios({
      url: 'https://api.easypay.ua/api/wallets/get',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${easyPayParams.bearerToken}`,
        'AppId': easyPayParams.appId,
        'PageId': easyPayParams.pageId
      }
    });
    return await res.status(200).send(easypay.data.wallets);
  } catch(err) {
    console.log(err.message, easypay.data)
    return await res.status(500).send('Request to EasyPay API Failed.');
  }
});

app.get('/getWalletById', async (req, res) => {
  try {
    const easyPayParams = await mongo.tokenModel.findById('5e4e37a0d5b4492364eeda92').lean();
    if (easyPayParams.pageId === undefined || req.query.walletId === undefined) {
      return await res.status(401).send('Token is unvailable.');
    };
    const walletId = req.query.walletId;
    const easypay = await axios({
      url: `https://api.easypay.ua/api/wallets/get/${walletId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${easyPayParams.bearerToken}`,
        'AppId': easyPayParams.appId,
        'PageId': easyPayParams.pageId
      }
    });
    return await res.status(200).send(easypay.data.wallets);
  } catch(err) {
    console.log(err.message, easypay.data)
    return await res.status(500).send('Request to EasyPay API Failed.');
  }
});

app.post('/setCredentials', async (req, res) => {
  try {
    const { login, password } = req.query;
    console.log(login, password);
    await mongo.credentialsModel.findByIdAndUpdate('5e4e36c5d5b4492364eeda8d', { login, password });
    return await res.status(200).send('Credentials updates succesfuly!');
  } catch(err) {
    console.log(err.message, easypay.data)
    return await res.status(500).send('Request to EasyPay API Failed.');
  }
});

app.listen(appPort, () => {
  console.log('App listening on port: ', appPort);
});