require('dotenv').config();

const ethers = require("ethers");
const fs = require("fs");

const destination = "/opt/circulatingsupply/";
const serviceMap = {
	7341: 'https://rpc.shyft.network/'
};

const chainid = process.argv[2];
if (chainid in serviceMap) {
	providerUrl = serviceMap[chainid];
	const provider = new ethers.providers.JsonRpcProvider(providerUrl);

	provider.send("eth_getBlockByNumber", [ "latest" ] ).then( (block) => { 
		if ('number' in block) {
			var blocknum = parseInt(block['number'],16);
			var ts = Math.round(Date.now()/1000);
			if (blocknum>3000000) {
				destFilename = `${destination}/snapshot-${chainid}.json`;
				payload = `{ "timestamp": ${ts}, "blocks": { "${chainid}":${blocknum} } }\n`;
				fs.writeFile(destFilename, payload, function err(e, d) { if (e) { console.log("Failed to write to "+destFilename+": "+e)} });
			}
		}
	});
}
