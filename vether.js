const VETHER = require('./DeployedVether.json')

const addr = () => {
	return '0xd447B74e5Ff9fAF98eB66dC59DC2C91DD47736dC'
}

const abi = () => {
	return VETHER.abi
}

module.exports = {  
    addr, abi
}