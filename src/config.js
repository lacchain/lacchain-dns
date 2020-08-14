export default {
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "did",
          "type": "address"
        }
      ],
      "name": "DIDAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "did",
          "type": "address"
        }
      ],
      "name": "DIDEnabled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "did",
          "type": "address"
        }
      ],
      "name": "DIDRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "did",
          "type": "address"
        }
      ],
      "name": "DIDRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
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
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "did",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "entity",
          "type": "string"
        }
      ],
      "name": "addDID",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
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
      "name": "addresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "did",
          "type": "address"
        }
      ],
      "name": "enableDID",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "did",
          "type": "address"
        }
      ],
      "name": "getDID",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "entity",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "status",
              "type": "bool"
            }
          ],
          "internalType": "struct DNSRegistry.DIDStruct",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getDIDs",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "removeDID",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "did",
          "type": "address"
        }
      ],
      "name": "revokeDID",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  extensions: {
    "1.2.3.4.5.6.7.8": {
      name: 'Post-Quantum Public Key',
      encode: 'base64'
    }
  },
  trustedCAs: {
    idemia: "-----BEGIN CERTIFICATE-----\n" +
      "MIIDfjCCAmYCCQCHWQpi8K9CDTANBgkqhkiG9w0BAQsFADCBgDELMAkGA1UEBhMC\n" +
      "VVMxCzAJBgNVBAgMAkNBMRMwEQYDVQQHDApDYWxpZm9ybmlhMQ8wDQYDVQQKDAZJ\n" +
      "REVNSUExCzAJBgNVBAsMAklUMRMwEQYDVQQDDAppZGVtaWEuY29tMRwwGgYJKoZI\n" +
      "hvcNAQkBFg1jYUBpZGVtaWEuY29tMB4XDTIwMDgxNDAyMzEzNloXDTIzMDYwNDAy\n" +
      "MzEzNlowgYAxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTETMBEGA1UEBwwKQ2Fs\n" +
      "aWZvcm5pYTEPMA0GA1UECgwGSURFTUlBMQswCQYDVQQLDAJJVDETMBEGA1UEAwwK\n" +
      "aWRlbWlhLmNvbTEcMBoGCSqGSIb3DQEJARYNY2FAaWRlbWlhLmNvbTCCASIwDQYJ\n" +
      "KoZIhvcNAQEBBQADggEPADCCAQoCggEBAJ4HFxX2CM4gC72pSAo7G2CaTUh65v8x\n" +
      "XUs3lJIR9gEhI/4eecqPLt9LiRwsZsdDmU2GFXbX4WlTSBBunPvu/2ynoYcVVwmf\n" +
      "JfB25orf+9oC5d8x33hSLTglHAtYfelw2YSssDsKK7Xk5WXt6HDvJJYEUjld9dr5\n" +
      "27C+OMvhZWYZPi0Zui6dRsiJxCt15Z8UKCPip1qu20wB9NWtpbg6WoMOJTyQ1RT/\n" +
      "YQ5bO+uhEbA6nvtRhMe7VtLCP7uBhMXYrbTNkCcCjCInidPh+e30TcA0cz/J7XHT\n" +
      "w6VbsCe8LbPfyVAnsjoECBCBj9Eo364w5R+A/4kYUOxBohf/VprT+j8CAwEAATAN\n" +
      "BgkqhkiG9w0BAQsFAAOCAQEAf7dI1P9opF10IFr73iO2E3/iEDFCVmcDGrLMOBOO\n" +
      "PMS+RfW18Z6Bikb4PLMpGX9O/7qVGmLVLHD+E/P3VLtpYharzy2/02r+idkDUfSg\n" +
      "4zcG1GB26/msPN48UaBjiWas9wpZ0HSbDX+Fs9JWcBZ++1545Vrd/q/TQUn2Iigu\n" +
      "KiWDlau8yBoVF8Sn49Ql8HSi+qhEfKfkT0OcwnHMQ/W+L1/pv5oLf+t3+wpPRZZm\n" +
      "XL3BevC4u+wb72J01R7zhVkDj9x4n0QY4TF3YbXyaPPC8mWBnnT98LaXlYEqE4ee\n" +
      "9nfzRiOHqxHZSG8/8I6R2i9Am8ih/U0FARsogLjKSj7sKw==\n" +
      "-----END CERTIFICATE-----\n"
  }
}
