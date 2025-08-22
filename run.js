const { ethers } = require('ethers');
const readline = require('readline');
require('dotenv').config();

const RPC_URL = "https://rpc.testnet.citrea.xyz";
const CHAIN_ID = 5115;
const MARKETPLACE_CA = "0xdb6bFA2e6184EbdE089c314B1550f21C7FD93662";
const NFT_CA = "0xccf3715b40c7a8144ff58d5a3b488222a3bea9bc";
const TARGET_PRICE = ethers.parseEther("0.0001");

const MARKETPLACE_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "initialOwner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "initialFee",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        name: "OwnableInvalidOwner",
        type: "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error"
    },
    {
        inputs: [],
        name: "ReentrancyGuardReentrantCall",
        type: "error"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "listingId",
                type: "uint256"
            }
        ],
        name: "ListingCancelled",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "listingId",
                type: "uint256"
            },
            {
                indexed: true,
                internalType: "address",
                name: "nftContract",
                type: "address"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256"
            },
            {
                indexed: true,
                internalType: "address",
                name: "seller",
                type: "address"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256"
            }
        ],
        name: "ListingCreated",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "listingId",
                type: "uint256"
            },
            {
                indexed: true,
                internalType: "address",
                name: "buyer",
                type: "address"
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256"
            }
        ],
        name: "ListingSold",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address"
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address"
            }
        ],
        name: "OwnershipTransferred",
        type: "event"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "listingId",
                type: "uint256"
            }
        ],
        name: "cancelListing",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "nftContract",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "price",
                type: "uint256"
            }
        ],
        name: "createListing",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "listingId",
                type: "uint256"
            }
        ],
        name: "getListing",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "listingId",
                        type: "uint256"
                    },
                    {
                        internalType: "address",
                        name: "nftContract",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    },
                    {
                        internalType: "address",
                        name: "seller",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "price",
                        type: "uint256"
                    },
                    {
                        internalType: "bool",
                        name: "isActive",
                        type: "bool"
                    }
                ],
                internalType: "struct Marketplace.Listing",
                name: "",
                type: "tuple"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getListingIdCounter",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "listings",
        outputs: [
            {
                internalType: "uint256",
                name: "listingId",
                type: "uint256"
            },
            {
                internalType: "address",
                name: "nftContract",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256"
            },
            {
                internalType: "address",
                name: "seller",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "price",
                type: "uint256"
            },
            {
                internalType: "bool",
                name: "isActive",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "marketplaceFee",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "listingId",
                type: "uint256"
            }
        ],
        name: "purchaseListing",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address"
            }
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
];

const NFT_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function approve(address to, uint256 tokenId) external",
    "function getApproved(uint256 tokenId) view returns (address)",
    "function isApprovedForAll(address owner, address operator) view returns (bool)"
];

const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const marketplace = new ethers.Contract(MARKETPLACE_CA, MARKETPLACE_ABI, wallet);
const nftContract = new ethers.Contract(NFT_CA, NFT_ABI, wallet);

let latestListingId = 0;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MANUAL_GAS_LIMITS = {
    approve: 100000n,
    createListing: 350000n, 
    purchaseListing: 250000n
};

const BASE_GAS_PRICE = ethers.parseUnits('0.01', 'gwei');

async function getGasPrice() {
    try {
        return BASE_GAS_PRICE;
    } catch (error) {
        console.log('Menggunakan gas price default');
        return BASE_GAS_PRICE;
    }
}

async function getListing(listingId) {
    try {
        return await marketplace.getListing(listingId);
    } catch (error) {
        console.error(`Error getting listing ${listingId}:`, error.message);
        return null;
    }
}

async function purchaseListing(listingId, price) {
    try {
        const gasPrice = await getGasPrice();
        const gasLimit = MANUAL_GAS_LIMITS.purchaseListing;
        
        const tx = await marketplace.purchaseListing(listingId, {
            value: price,
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            type: 0 
        });
        
        console.log(`Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
        return true;
    } catch (error) {
        console.error(`Error purchasing listing ${listingId}:`, error.message);
        return false;
    }
}

async function getOwnedNFTs() {
    try {
        const balance = await nftContract.balanceOf(wallet.address);
        console.log(`Jumlah NFT dimiliki: ${balance}`);
        
        const nfts = [];
        for (let i = 0; i < balance; i++) {
            const tokenId = await nftContract.tokenOfOwnerByIndex(wallet.address, i);
            nfts.push(tokenId.toString());
        }
        
        return nfts;
    } catch (error) {
        console.error('Error getting owned NFTs:', error.message);
        return [];
    }
}

async function isApprovedForAll() {
    try {
        return await nftContract.isApprovedForAll(wallet.address, MARKETPLACE_CA);
    } catch (error) {
        console.error('Error checking approval for all:', error.message);
        return false;
    }
}

async function approveNFT(tokenId) {
    try {
        const approved = await nftContract.getApproved(tokenId);
        if (approved === MARKETPLACE_CA) {
            console.log(`NFT ${tokenId} sudah di-approve`);
            return true;
        }
        
        const approvedForAll = await isApprovedForAll();
        if (approvedForAll) {
            console.log(`Marketplace sudah di-approve untuk semua NFT`);
            return true;
        }
        
        const gasPrice = await getGasPrice();
        const gasLimit = MANUAL_GAS_LIMITS.approve;
        
        const tx = await nftContract.approve(MARKETPLACE_CA, tokenId, {
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            type: 0 
        });
        
        console.log(`Approve transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log(`NFT ${tokenId} approved untuk marketplace`);
        
        const newApproved = await nftContract.getApproved(tokenId);
        if (newApproved === MARKETPLACE_CA) {
            console.log(`Verifikasi approve berhasil untuk NFT ${tokenId}`);
            return true;
        } else {
            console.log(`Approve gagal untuk NFT ${tokenId}`);
            return false;
        }
    } catch (error) {
        console.error(`Error approving NFT ${tokenId}:`, error.message);
        return false;
    }
}

async function createListing(nftContractAddress, tokenId, price) {
    try {
        const approved = await approveNFT(tokenId);
        if (!approved) {
            console.log('Gagal approve NFT, tidak dapat membuat listing');
            return null;
        }
        
        const gasPrice = await getGasPrice();
        const gasLimit = MANUAL_GAS_LIMITS.createListing;
        
        const tx = await marketplace.createListing(
            nftContractAddress, 
            tokenId, 
            price,
            {
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                type: 0 
            }
        );
        
        console.log(`Create listing transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
        
        for (const log of receipt.logs) {
            try {
                const parsedLog = marketplace.interface.parseLog(log);
                if (parsedLog && parsedLog.name === "ListingCreated") {
                    const listingId = parsedLog.args.listingId;
                    console.log(`Listing created dengan ID: ${listingId}`);
                    
                    const listing = await getListing(listingId);
                    if (listing && listing.isActive) {
                        console.log(`Listing ${listingId} berhasil dibuat dan aktif`);
                        return listingId;
                    } else {
                        console.log(`Listing ${listingId} tidak aktif atau tidak ditemukan`);
                        return null;
                    }
                }
            } catch (e) {
            }
        }
        
        try {
            const latestId = await marketplace.getListingIdCounter();
            const newListingId = latestId - 1n;
            console.log(`Mendapatkan listing ID dari counter: ${newListingId}`);
            
            const listing = await getListing(newListingId);
            if (listing && listing.isActive) {
                console.log(`Listing ${newListingId} berhasil dibuat dan aktif`);
                return newListingId;
            } else {
                console.log(`Listing ${newListingId} tidak aktif atau tidak ditemukan`);
                return null;
            }
        } catch (e) {
            console.log('Tidak bisa mendapatkan listing ID dari counter');
            return null;
        }
    } catch (error) {
        console.error('Error creating listing:', error.message);
        return null;
    }
}

async function checkBalance() {
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} CBTC`);
    return balance;
}

async function monitorNewListings() {
    console.log("Starting to monitor for new listings...");
    
    try {
        latestListingId = await marketplace.getListingIdCounter();
        console.log(`Current latest listing ID: ${latestListingId}`);
    } catch (error) {
        console.error("Error getting initial listing ID:", error.message);
        latestListingId = 0;
    }
    
    await checkBalance();
    
    const monitorInterval = setInterval(async () => {
        try {
            const currentListingId = await marketplace.getListingIdCounter();
            
            if (currentListingId > latestListingId) {
                console.log(`Found ${currentListingId - latestListingId} new listing(s)`);
                
                for (let listingId = latestListingId; listingId < currentListingId; listingId++) {
                    const listing = await getListing(listingId);
                    
                    if (listing && listing.isActive) {
                        const price = listing.price;
                        console.log(`Listing ${listingId}: Price = ${ethers.formatEther(price)} CBTC`);
                        
                        if (price === TARGET_PRICE) {
                            console.log(`Target price found! Attempting to purchase listing ${listingId}`);
                            
                            const balance = await checkBalance();
                            const totalCost = price + (price * 10n / 1000n);
                            
                            if (balance >= totalCost) {
                                const success = await purchaseListing(listingId, price);
                                if (success) {
                                    console.log(`Successfully purchased listing ${listingId}`);
                                }
                            } else {
                                console.log(`Insufficient balance for listing ${listingId}`);
                            }
                        }
                    }
                }
                latestListingId = currentListingId;
            }
        } catch (error) {
            console.error("Error in monitoring loop:", error.message);
        }
    }, 5000);
    
    setTimeout(() => {
        clearInterval(monitorInterval);
        console.log("\nMonitoring stopped after 1 minute");
        showMenu();
    }, 60000);
}

function showMenu() {
    console.log("\n=== Marketplace Bot ===");
    console.log("1. Monitor new listings (purchase auto - 1 minute)");
    console.log("2. Purchase specific listing");
    console.log("3. Create new listing dengan NFT yang dimiliki");
    console.log("4. Check balance");
    console.log("5. Check owned NFTs");
    console.log("6. Exit");
    
    rl.question("Select option (1-6): ", async (choice) => {
        switch (choice) {
            case '1':
                await monitorNewListings();
                break;
            case '2':
                rl.question("Enter listing ID: ", async (listingId) => {
                    const listing = await getListing(parseInt(listingId));
                    if (listing && listing.isActive) {
                        await purchaseListing(parseInt(listingId), listing.price);
                    } else {
                        console.log("Listing tidak ditemukan atau tidak aktif");
                    }
                    showMenu();
                });
                break;
            case '3':
                try {
                    const ownedNFTs = await getOwnedNFTs();
                    if (ownedNFTs.length === 0) {
                        console.log("Tidak ada NFT yang dimiliki");
                        showMenu();
                        return;
                    }
                    
                    console.log("\nNFT yang dimiliki:");
                    ownedNFTs.forEach((nft, index) => {
                        console.log(`${index + 1}. Token ID: ${nft}`);
                    });
                    
                    rl.question("\nPilih NFT berdasarkan nomor (0 untuk batal): ", async (choice) => {
                        const index = parseInt(choice) - 1;
                        if (index >= 0 && index < ownedNFTs.length) {
                            const tokenId = ownedNFTs[index];
                            console.log(`Membuat listing untuk Token ID: ${tokenId} dengan harga 0.0001 CBTC`);
                            
                            const listingId = await createListing(NFT_CA, tokenId, TARGET_PRICE);
                            if (listingId !== null) {
                                console.log(`Berhasil membuat listing dengan ID: ${listingId}`);
                                
                                try {
                                    const owner = await nftContract.ownerOf(tokenId);
                                    if (owner === wallet.address) {
                                        console.log("NFT masih dimiliki oleh wallet (listing tidak mentransfer kepemilikan)");
                                    } else if (owner === MARKETPLACE_CA) {
                                        console.log("NFT telah ditransfer ke kontrak marketplace");
                                    } else {
                                        console.log(`NFT sekarang dimiliki oleh: ${owner}`);
                                    }
                                } catch (error) {
                                    console.error("Error checking NFT ownership:", error.message);
                                }
                            } else {
                                console.log("Gagal membuat listing");
                            }
                        } else if (choice === '0') {
                            console.log("Dibatalkan");
                        } else {
                            console.log("Pilihan tidak valid");
                        }
                        showMenu();
                    });
                } catch (error) {
                    console.error("Error:", error.message);
                    showMenu();
                }
                break;
            case '4':
                await checkBalance();
                showMenu();
                break;
            case '5':
                await getOwnedNFTs();
                showMenu();
                break;
            case '6':
                rl.close();
                process.exit(0);
                break;
            default:
                console.log("Invalid option");
                showMenu();
        }
    });
}

process.on('SIGINT', () => {
    console.log('\nShutting down bot...');
    rl.close();
    process.exit(0);
});

console.log("Marketplace Bot dimulai...");
console.log(`Wallet address: ${wallet.address}`);
showMenu();
