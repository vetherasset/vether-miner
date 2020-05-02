var express = require('express');
var router = express.Router();
var miner = require('../miner.js')

router.get('/', async (req, res) => {
  const miningAddress = await miner.getMiningAddress()
  const payoutAddress = await miner.getPayoutAddress()
  const getMiningLink = await miner.getMiningLink()
  const getPayoutLink = await miner.getPayoutLink()
  const vethBalance = await miner.getVethBalance()
  const ethBalance = await miner.getEthBalance()
  const getDailyBurn = await miner.getDailyBurn()
  const getCycles = await miner.getCycles()
  const txCount = await miner.getTxCount()
  const arrayDays = await miner.getArrayDays()
  const arrayShares = await miner.getArrayShares()
  const times = await miner.getTimes()
  await miner.updateTime()

  res.render('index', { 
    miningAddress: miningAddress, 
    miningLink: getMiningLink,
    vethBalance: vethBalance, 
    ethBalance: ethBalance, 
    payoutAddress: payoutAddress, 
    payoutLink: getPayoutLink,
    dailyBurn: getDailyBurn,
    cycles: getCycles,
    txCount: txCount,
    arrayDays: arrayDays, arrayShares: arrayShares,
    times: times
  });
});


module.exports = router;
