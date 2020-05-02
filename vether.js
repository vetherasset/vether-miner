const VETHER = require('./DeployedVether.json')

const addr = () => {
	return '0x830a6f5764b3e736f1f24427a6ea294926862195'
}

const abi = () => {
	return VETHER.abi
}

module.exports = {  
    addr, abi
}