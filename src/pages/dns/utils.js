import pem from "pem";
import Wallet from "ethereumjs-wallet";

export function verifyChain( cert, root ) {
  return new Promise( ( resolve, reject ) => {
    pem.verifySigningChain( cert, root, ( err, result ) => {
      if( err ) return reject( err );
      resolve( result );
    } );
  } );
}

export function getPublicKey( cert ) {
  return new Promise( ( resolve, reject ) => {
    pem.getPublicKey( cert, ( err, result ) => {
      if( err ) return reject( err );
      const base64 = result.publicKey.replace( '-----BEGIN PUBLIC KEY-----\n', '' )
        .replace( '-----END PUBLIC KEY-----', '' )
        .replace( '\n', '' );
      const hex = new Buffer( base64, 'base64' ).toString( 'hex' );
      const publicKey = hex.slice( -128 );
      resolve( `0x${publicKey}` );
    } );
  } );
}

export function getAddress( publicKey ) {
  const publicKeyBuffer = EthUtil.toBuffer( publicKey );
  const wallet = Wallet.default.fromPublicKey( publicKeyBuffer );
  return `0x${wallet.getAddress().toString( 'hex' )}`;
}

export function getCertificateInfo( cert ) {
  return new Promise( ( resolve, reject ) => {
    pem.readCertificateInfo( cert, ( err, result ) => {
      if( err ) return reject( err );
      resolve( result );
    } );
  } );
}
