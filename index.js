require("dotenv").config();
const ethers = require("ethers");
const abi = ["event Transfer(address indexed src, address indexed dst, uint val)"];
const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
const usdcContract = new ethers.Contract("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", abi, provider);
const mimContract = new ethers.Contract("0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3", abi, provider);
const daiContract = new ethers.Contract("0x6B175474E89094C44Da98b954EedeAC495271d0F", abi, provider);
const treasuryAddress = "0xD26c85D435F02DaB8B220cd4D2d398f6f646e235";
const usdcFilter = usdcContract.filters.Transfer(null, treasuryAddress);
const mimFilter = mimContract.filters.Transfer(null, treasuryAddress);
const daiFilter = daiContract.filters.Transfer(null, treasuryAddress);
const listener = (symbol, decimals) => (src, _dst, val, event) => {
	  const message = `\`${src}\` sent ${ethers.utils.formatUnits(val, decimals)} ${symbol} in tx https://etherscan.io/tx/${event.transactionHash}`;
	  console.log(message);
	  const data = JSON.stringify({ value1: message });
	  const options = {
		      hostname: "maker.ifttt.com",
		      path: process.env.MAKER_PATH,
		      method: "POST",
		      headers: {
			            "Content-Type": "application/json",
			            "Content-Length": data.length,
			          },
		    };
	  const req = require("https").request(options);
	  req.write(data);
	  req.end();
};
usdcContract.on(usdcFilter, listener("USDC", 6));
mimContract.on(mimFilter, listener("MIM", 18));
daiContract.on(daiFilter, listener("DAI", 18));

