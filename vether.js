const VETHER = require('./DeployedVether.json')

const addr = () => {
	return '0x4Ba6dDd7b89ed838FEd25d208D4f644106E34279'
}

const abi = () => {
	return VETHER.abi
}

module.exports = {  
    addr, abi
}