import { Certificate } from "@fidm/x509";
import * as EthUtil from "ethereumjs-util";
import Wallet from "ethereumjs-wallet";
import config from "../../config";

export function parsePEM( pem ) {
  return Certificate.fromPEM( Buffer.from( pem ) );
}

export function getIssuer( certificate ) {
  return certificate.issuer.attributes.reduce( ( d, a ) => ( { ...d, [a.name]: a.value } ), {} );
}

export function getSubject( certificate ) {
  return certificate.subject.attributes.reduce( ( d, a ) => ( { ...d, [a.name]: a.value } ), {} );
}

export function getExtensions( certificate ){
  const { extensions } = config;
  return certificate.extensions.map( ext => ({
      name: [(extensions[ext.name] || ext).name],
      value: Buffer.from( ext.value ).toString('hex')
  }) );
}

export function checkSignature( certificate, issuer ) {
  return certificate.isIssuer( issuer );
}

export function getPublicKey( certificate ) {
  return Buffer.from( certificate.publicKeyRaw ).toString( 'hex' ).slice( -128 );
}

export function getDates( certificate ) {
  return {
    from: certificate.validFrom,
    to: certificate.validTo
  }
}

export function getAddress( publicKey ) {
  try {
    const publicKeyBuffer = EthUtil.toBuffer( `0x${publicKey}` );
    const wallet = Wallet.fromPublicKey( publicKeyBuffer );
    return `0x${wallet.getAddress().toString( 'hex' )}`;
  } catch( e ) {
    return null;
  }
}
