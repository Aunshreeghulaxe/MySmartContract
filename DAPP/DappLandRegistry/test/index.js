const web3 = new Web3("http://127.0.0.1:7545"); // Ganache RPC URL

const connectionstatus = async() =>{
	try{
		const h2 = document.getElementById("server");
		const networkID = await web3.eth.net.getId();
        h2.innerText = h2.innerText + `\t${networkID}`
	}
	catch(error){
		const h2 = document.getElementById("server");
		h2.innerText = `couldn't connect to node http://127.0.0.1:7545`
	}
}
connectionstatus();
 
// Contract ABI and Address
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "landId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "area",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "LandRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "landId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "oldOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getLand",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "isLandRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "lands",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "area",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "registered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_area",
				"type": "uint256"
			}
		],
		"name": "registerLand",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
 
    const contractAddress = "0x54206576B7F372Dd30B0156b25865F0dB7125A4d"; // Sender address
	const senderAddress = "0x93A0f033283f2677717a3C7321837dc79C3D37FD";
 
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const outputDiv = document.getElementById("output");

	function getLandId() {
		const landIdRegister = document.getElementById('landid_register').value;
		return landIdRegister;
	  }
    
    document.getElementById("createLandForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("landid").value;
      const location = document.getElementById("location").value;
      const area = document.getElementById("area").value;
     
      try {
        const gasEstimate = await contract.methods.registerLand(id,location,area).estimateGas({ from: senderAddress });
        await contract.methods.registerLand(id,location,area).send({
          from: senderAddress,
          gas: gasEstimate + 100000 // Add extra gas buffer
        });
        outputDiv.innerText = `Account created for ${id}!`;
      } catch (error) {
        outputDiv.innerText = `Error: ${error.message}`;
      }
    });


    document.getElementById("checkLandOwnerForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("landid").value;
        const newowner = document.getElementById("newaddress").value.trim(); // Trim the address
    
        if (!web3.utils.isAddress(newowner)) {
            outputDiv.innerText = "Error: Invalid new owner address.";
            return;
        }
    
        try {
            const landDetails = await contract.methods.lands(id).call();
            const currentOwner = landDetails[3];
    
            if (currentOwner.toLowerCase() !== senderAddress.toLowerCase()) {
                outputDiv.innerText = "Error: Only the current owner can transfer ownership.";
                return;
            }
    
            const gasEstimate = await contract.methods.transferOwnership(id, newowner).estimateGas({ from: senderAddress });
            await contract.methods.transferOwnership(id, newowner).send({
                from: senderAddress,
                gas: gasEstimate + 100000 // Add extra gas buffer
            });
            outputDiv.innerText = "Ownership Transferred";
        } catch (error) {
            outputDiv.innerText = `Error: ${error.message}`;
        }
    });
    
    document.getElementById("checkLandForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("landid").value.trim();
    
      // Check for empty value and convert id to BigNumber
      if (!id) {
        outputDiv.innerText = "Error: Land ID is required.";
        return;
      }
    
      const idBN = web3.utils.toBN(id);
    
      try {
        const locaid = await contract.methods.lands(idBN).call();
        outputDiv.innerText =`Land ID : ${locaid[0]}\n
                              Location: ${locaid[1]}\n
                              Area: ${locaid[2]}\n
                              Address:${locaid[3]}\n`;
      } catch (error) {
        outputDiv.innerText = `Error: ${error.message}`;
      }
    });

        
    document.getElementById("checkLandregForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("landid").value.trim();
      
        // Check for empty value and convert id to BigNumber
        if (!id) {
          outputDiv.innerText = "Error: Land ID is required.";
          return;
        }
      
        const idBN = web3.utils.toBN(id);
      
        try {
          const locaid = await contract.methods.isLandRegistered(idBN).call();
          if(locaid){
          outputDiv.innerText =`Land Registerd Already`;
          }else{
            outputDiv.innerText =`Land Not Registerd`;
          }
        } catch (error) {
          outputDiv.innerText = `Error: ${error.message}`;
        }
      });

	
