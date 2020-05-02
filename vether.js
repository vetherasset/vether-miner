const VETHER = require('./DeployedVether.json')

const addr = () => {
	return '0x2Db2C2235a5F8daa22DdBD39875c0483b286AeA8'
}

const abi = () => {
	return VETHER.abi
}

module.exports = {  
    addr, abi
}