// src/lib/contract.ts
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";

export const CONTRACT_ABI = [
  "function issueCertificate(address studentWallet, string memory studentName, string memory courseName, string memory degree, string memory ipfsHash) public",
  "function verifyCertificate(uint256 certId, string memory studentName, address studentWallet, string memory courseName, string memory degree, string memory ipfsHash) public view returns (bool)",
  "function getStudentCertificateIds(address studentWallet) public view returns (uint256[])",
  "function certificates(uint256) public view returns (uint256 id, string studentName, address studentWallet, string courseName, string degree, uint256 issueDate, string ipfsHash, bytes32 dataHash)",
  "function addUniversity(address universityAddress) public",
  "function revokeUniversity(address universityAddress) public",
  "function hasRole(bytes32 role, address account) public view returns (bool)",
  "event CertificateIssued(uint256 indexed certId, address indexed student, string studentName, string courseName, string degree, uint256 issueDate, string ipfsHash)"
];

export const UNIVERSITY_ROLE = "0x" + Buffer.from("UNIVERSITY_ROLE").toString('hex');

// IPFS Configuration
export const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
export const PINATA_API_KEY = "YOUR_PINATA_API_KEY";
export const PINATA_SECRET_KEY = "YOUR_PINATA_SECRET_KEY";