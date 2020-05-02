require('dotenv').config()
const ethers = require('ethers');
const BigNumber = require('bignumber.js')
var vether = require('./vether.js')
var hdkey = require('ethereumjs-wallet/hdkey')
var bip39 = require('bip39')

const timeDelay = 1*60*1000;
const delay = ms => new Promise(res => setTimeout(res, ms));

var provider; var signingKey;
var minerAddress; var payoutAddress; var wallet; var contract; var vethBalance; var ethBalance;
var currentEra; var currentDay; var nextDayTime;
let arrayDays = []; let arrayShares = []; let arrayTx = [];
var cycles; var txCount;
var times = { 'start': "", 'cycle': "", 'query':"" };

const updateDetails = async () => {
	const cycleTime = new Date(Date.now()).toLocaleTimeString("en-gb")
	console.log('updating details at time:', cycleTime)
	times = { 'start': times.start, 'cycle': cycleTime, 'query': times.query  }
	provider = ethers.getDefaultProvider('rinkeby');
	signingKey = new ethers.utils.SigningKey(process.env.PAYER_KEY);
	minerAddress = signingKey.address
	//payoutAddress = process.env.PAYOUT_ADDR
	//console.log('Address: ' + signingKey.address);
	wallet = new ethers.Wallet(process.env.PAYER_KEY, provider);
    contract = new ethers.Contract(vether.addr(), vether.abi(), wallet)
    vethBalance = ethers.utils.formatEther(await contract.balanceOf(payoutAddress))
    ethBalance = ethers.utils.formatEther(await provider.getBalance(minerAddress))

	currentEra = (new BigNumber(await contract.currentEra())).toFixed()
	currentDay = (new BigNumber(await contract.currentDay())).toFixed()
	nextDayTime = (new BigNumber(await contract.nextDayTime())).toFixed()
	console.log('era:%s - day:%s - NextDay:%s', currentEra, currentDay, nextDayTime)
}

const sendEth = async (amt) => {
	let amount = ethers.utils.parseEther(amt);
	let gasPrice_ = (await provider.getGasPrice()).mul(2)
	let tx = {
		//to: vetherAddr(),
		gasPrice: gasPrice_, 
		gasLimit: 250000,
		value: amount
	};
	let length = arrayDays.length	
	if (length == 0) {
		await sendTx(tx)
	} else {
		let latest = arrayDays[length - 1]
		if (latest.era < currentEra) {
			await sendTx(tx)
		} else {
			if (latest.day < currentDay) {
				await sendTx(tx)
			} else {
				const now_ = Date.now()/1000
				console.log(now_, nextDayTime)
				if ( now_ >= nextDayTime) {
					await sendTx(tx)
				}
			}
		}
	}
	ethBalance = ethers.utils.formatEther(await provider.getBalance(minerAddress))
	console.log("Balance: " + ethBalance);
}

async function sendTx(tx) {
	txCount ++
	console.log('sending ether for:', payoutAddress)
	let resp = await contract.burnEtherForMember(payoutAddress, tx);
	//const resp = await wallet.sendTransaction(tx);
	time = new Date(Date.now()).toLocaleString("en-gb")
	var etherscan="https://rinkeby.etherscan.io/tx/"
	console.log('tx sent', currentEra, currentDay, ethers.utils.formatEther(tx.value), resp.hash, time)
	arrayDays.push({ 'era': currentEra, 'day': currentDay, 'amt': ethers.utils.formatEther(tx.value), 'hash': resp.hash, 'time': time, 'link': etherscan.concat(resp.hash) })
}

const checkShare = async () => {
	//console.log(arrayShares)
	console.log('checking shares')
	let length = arrayShares.length
	if (length == 0) {
		await checkAll()
	} else {
		let latest = arrayShares[length - 1]
		if (latest.era < currentEra) {
			for (var i = latest.era; i <= currentEra; i++) {
				await checkEra(i)
			}
		} else {
			if (latest.day < currentDay - 1) {
				for (var j = latest.day; j < currentDay; j++) {
					console.log(latest)
					await checkDay(currentEra, j)
				}
			}
		}
	}
}

async function checkAll() {
	for (var i = 1; i <= currentEra; i++) {
		console.log('check all, era: ', i)
		await checkEra(i)
	}
}

async function checkEra(i) {
	let indexContributed = (new BigNumber(await contract.getDaysContributedForEra(payoutAddress, i))).toFixed()
	console.log('Check currentEra: %s, currentDays contributed: %s', i, indexContributed)
	for (var j = 1; j <= indexContributed; j++) {
		console.log('checking index:%s', j-1)
		await checkDay(i, j-1)
	}
}

async function checkDay(i, j) {
	console.log("Checking currentEra %s, Index %s, currentDay %s", i, j, currentDay)
	if (i < currentEra || (i == currentEra && j < currentDay-1)) {
		console.log(payoutAddress, i, j)
		let day = (new BigNumber(await contract.mapMemberEra_Days(payoutAddress, i, j))).toFixed()
		console.log('Day at index %s is: %s', j, day)
		console.log(i, +day, payoutAddress)
		let share = ethers.utils.formatEther(await contract.getEmissionShare(i, +day, payoutAddress))
		console.log('share is', share)
		if (share > 0) {
			console.log(i, day, share)
			arrayShares.push({ 'era': i, 'day': day, 'share': share, 'withdrawn': false })
		}
	}
}

const claimShare = async () => {
	console.log('claiming shares')
	for (var i = 0; i < arrayShares.length; i++) {
		console.log('withdrawn', arrayShares[i].withdrawn)
		if (arrayShares[i].withdrawn == false) {
			let era = arrayShares[i].era; let day = arrayShares[i].day; let share = arrayShares[i].share; let withdrawn = arrayShares[i].withdrawn;
			if(era < currentEra || (era >= currentEra && day < currentDay)) {
				console.log('withdraw: ', era, day, share, withdrawn)
				arrayShares[i] = { 'era': era, 'day': day, 'share': share, 'withdrawn': true }
				era = arrayShares[i].era; day = arrayShares[i].day; share = arrayShares[i].share; withdrawn = arrayShares[i].withdrawn;
				console.log('withdraw: ', era, day, share, withdrawn)
				let tx = await contract.withdrawShareForMember(era, day, payoutAddress);
				console.log(tx.hash);
				await tx.wait();
			}
		}
	}
}

const getPayoutWallet = (index) => {
	if(process.env.PAYOUT_ADDR){
		payoutAddress = process.env.PAYOUT_ADDR
		console.log("payoutAddress", payoutAddress)
	} else {
	const EthereumHDKey = hdkey.fromExtendedKey(process.env.PAYOUT_XPUB);
	const childNode = EthereumHDKey.deriveChild(index%5)
	const childWallet = childNode.getWallet()
	payoutAddress = childWallet.getAddressString()
	console.log("childAddress", payoutAddress)
	}
}

const main = async () => {

	cycles = 0; txCount = 0
	const startTime = new Date(Date.now()).toLocaleString("en-gb")
	times = { 'start': startTime, 'cycle': times.cycle, 'query': times.query  }
    for (var i = 0; i < 10000; i++) {
		getPayoutWallet(i)
		await updateDetails()
		await sendEth(process.env.DAY_CAPITAL)
		await checkShare()
		await claimShare()
		console.log("now waiting: %s", timeDelay/1000)
		await delay(timeDelay)
		cycles++
	}
  }

const getVethBalance = async () => {
	return vethBalance
}

const getEthBalance = async () => {
	return ethBalance
}

const getMiningAddress = function () {
    return  minerAddress
}

const getMiningLink = function () {
    var etherscan="https://rinkeby.etherscan.io/address/"
    var link = etherscan.concat(getMiningAddress())
    return link
}

const getPayoutAddress = function () {
    return process.env.PAYOUT_ADDR
}

const getPayoutLink = function () {
    var etherscan="https://rinkeby.etherscan.io/address/"
    var link = etherscan.concat(getPayoutAddress())
    return link
}

const getDailyBurn = function () {
    return process.env.DAY_CAPITAL
}

const getCycles = () => {
	return cycles
}
const getTxCount = () => {
	return txCount
}

const getArrayDays = () => {
	return arrayDays
}
const getArrayShares = () => {
	return arrayShares
}

const updateTime = () => {
	const queryTime = new Date(Date.now()).toLocaleTimeString("en-gb")
	times = { 'start': times.start, 'cycle': times.cycle, 'query': queryTime  }
}

const getTimes = () => {
	return times
}

module.exports = {  
    main, 
    getMiningAddress, getMiningLink,
    getPayoutAddress, getPayoutLink, 
    getVethBalance, getEthBalance,
	getDailyBurn, getCycles, getTxCount,
	getArrayDays, getArrayShares,
	updateTime, getTimes
}





