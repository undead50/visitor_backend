var forge = require('node-forge'); // Import Forge library for cryptographic operations
const fs = require('fs'); // Import filesystem module for reading private key file



function getPrivateKey(privateKey) {
    return forge.pki.privateKeyFromPem(privateKey)
  }

  function getPublicKey(publicKey) {
    return forge.pki.publicKeyFromPem(publicKey)
  }

  function rsaSign(data, privateKey) {
    let priv = getPrivateKey(privateKey)
    var md = forge.md.sha256.create()
    md.update(data, 'utf8')

    return forge.util.encode64(priv.sign(md))
  }

  function rsaVerify(data, publicKey, signature) {
    let pub = getPublicKey(publicKey)

    var md = forge.md.sha256.create()
    md.update(data, 'utf8')
    return pub.verify(md.digest().getBytes(), forge.util.decode64(signature))
  }

  function rsaEncrypt(data, publicKey) {
    let pub = getPublicKey(publicKey)

    return forge.util.encode64(pub.encrypt(data, 'RSAES-PKCS1-V1_5'))
  }

  function rsaDecrypt(data, privateKey) {
    let priv = getPrivateKey(privateKey)
    return priv.decrypt(forge.util.decode64(data), 'RSAES-PKCS1-V1_5')
  }

  function aesEncrypt(data, secretKey) {
    var cipher = forge.cipher.createCipher('AES-ECB', secretKey)

    cipher.start()
    cipher.update(forge.util.createBuffer(data))
    cipher.finish()

    return forge.util.encode64(cipher.output.data)
  }

  function aesDecrypt(data, secretKey) {
    var decipher = forge.cipher.createDecipher('AES-ECB', secretKey)

    decipher.start()
    decipher.update(forge.util.createBuffer(forge.util.decode64(data)))
    decipher.finish()

    return decipher.output.data
  }

  function base64Enc(data) {
    return forge.util.encode64(data)
  }

  function base64Dec(data) {
    return forge.util.decode64(data)
  }

  function generateSecret(length) {
    var result = ''
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
  function encryptSigner(data, publicKey, privateKey, clientKey) {
    let secretKey = generateSecret(32)
    let aesEncryptedData = aesEncrypt(data, secretKey)
    let encryptedSecretKey = rsaEncrypt(secretKey, publicKey)
    let signature = rsaSign(aesEncryptedData, privateKey)
    return JSON.stringify({
      data: aesEncryptedData,
      secretKey: encryptedSecretKey,
      signature: signature,
      clientKey: clientKey
    })
  }

  function decryptVerifier(data, publicKey, privateKey) {
    let verified = rsaVerify(data.data, publicKey, data.signature)
    console.log(verified)
    let secretKey = rsaDecrypt(data.secretKey, privateKey)
    return aesDecrypt(data.data, secretKey)
  }

  function readKeyFromFile(filePath) {
    try {
      const privateKey = fs.readFileSync(filePath, 'utf8');
      return privateKey;
    } catch (error) {
      console.error('Error reading private key file:', error);
      return null;
    }
  }
  module.exports = {
    encryptSigner: encryptSigner,
    readKeyFromFile: readKeyFromFile
  };