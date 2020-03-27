const axios = require('axios');
const cors = require('cors');
const express = require('express');
const fs =require('fs');

const appPort = process.env.PORT || 4515
const app = express();

app.use(cors());

app.get('/wallets', async (req, res) => {
  try {
    const [pageId, appId, bearerToken] = fs.readFileSync('../easypayData.dat', 'utf-8').split(/\r?\n/);
    if (pageId === undefined) {
      return await res.status(401).send('Token is unvailable.');
    };
    const easypay = await axios({
      url: 'https://api.easypay.ua/api/wallets/get',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'AppId': appId,
        'PageId': pageId
      }
    });
    return await res.status(200).send(easypay.data.wallets);
  } catch(err) {
    console.log(err.message);
    return await res.status(500).send('Request to EasyPay API Failed.');
  }
});

app.get('/walletGlobalMoney', async (req, res) => {
  try {
    const [bearerToken, walletId] = fs.readFileSync('../globalmoneyData.dat', 'utf-8').split(/\r?\n/);
    const globalmoney = await axios({
      url: 'https://www.globalmoney.ua/wallet/info/',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'uuid': walletId
      }
    });
    return await res.status(200).send(globalmoney.data.content);
  } catch(err) {
    console.log(err.message);
    return await res.status(500).send('Request to EasyPay API Failed.');
  }
});

app.get('/getWalletById', async (req, res) => {
  try {
    const [pageId, appId, bearerToken] = fs.readFileSync('../easypayData.dat', 'utf-8').split(/\r?\n/);
    if (pageId === undefined) {
      return await res.status(401).send('Token is unvailable.');
    };
    const walletId = req.query.walletId;
    const easypay = await axios({
      url: `https://api.easypay.ua/api/wallets/get/${walletId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'AppId': appId,
        'PageId': pageId
      }
    });
    return await res.status(200).send(easypay.data.wallets);
  } catch(err) {
    console.log(err.message);
    return await res.status(500).send('Request to EasyPay API Failed.');
  }
});

app.post('/setCredentials', async (req, res) => {
  try {
    const { login, password } = req.query;
    console.log(login, password);
    if (login.startsWith('38')) {
      await fs.writeFileSync('../easypayCredentials.dat', `${login}\n${password}`);
    } else {
      await fs.writeFileSync('../easypayCredentials.dat', `38${login}\n${password}`);
    };
    return await res.status(200).send('Credentials updates succesfuly!');
  } catch(err) {
    console.log(err.message);
    return await res.status(500).send('Request to EasyPay API Failed.');
  }
});

app.post('/setCredentialsGlobalMoney', async (req, res) => {
  try {
    const { login, password } = req.query;
    console.log(login, password);
    await fs.writeFileSync('../globalmoneyCredentials.dat', `${login}\n${password}`);
    return await res.status(200).send('Credentials updates succesfuly!');
  } catch(err) {
    console.log(err.message);
    return await res.status(500).send('Request to EasyPay API Failed.');
  }
});

app.listen(appPort, () => {
  console.log('App listening on port: ', appPort);
});