import { Certificate } from "@fidm/x509";
import * as EthUtil from "ethereumjs-util";
import Wallet from "ethereumjs-wallet";

export function getIssuer( pem ) {
  const certificate = Certificate.fromPEM( Buffer.from( pem ) );
  return certificate.issuer.attributes.reduce( ( d, a ) => ( { ...d, [a.name]: a.value } ), {} );
}

export function getSubject( pem ) {
  const certificate = Certificate.fromPEM( Buffer.from( pem ) );
  return certificate.subject.attributes.reduce( ( d, a ) => ( { ...d, [a.name]: a.value } ), {} );
}

export function getPublicKey( pem ) {
  const certificate = Certificate.fromPEM( Buffer.from( pem ) );
  return Buffer.from( certificate.publicKeyRaw ).toString( 'hex' ).slice( -128 );
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
