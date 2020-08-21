import { Certificate } from "@fidm/x509";
import * as EthUtil from "ethereumjs-util";
import Wallet from "ethereumjs-wallet";

export function parsePEM( pem ) {
  return Certificate.fromPEM( Buffer.from( pem ) );
}

export function getIssuer( certificate ) {
  return certificate.issuer.attributes.reduce( ( d, a ) => ( { ...d, [a.name]: a.value } ), {} );
}

export function getSubject( certificate ) {
  return certificate.subject.attributes.reduce( ( d, a ) => ( { ...d, [a.name]: a.value } ), {} );
}
export function getPublicKey( certificate ) {
  const algorithm = certificate.publicKey.algo === '1.3.6.1.4.1.2.267.6.4.3' ? 'Dilithium2' : certificate.publicKey.algo;
  return {
    algo: algorithm,
    value: Buffer.from( certificate.publicKeyRaw ).toString( 'hex' )
  };
}

export function checkSignature( certificate, issuer ) {
  return certificate.isIssuer( issuer );
}

export function getDates( certificate ) {
  return {
    from: certificate.validFrom,
    to: certificate.validTo
  }
}

export function getAddress( certificate ) {
  let publicKey = Buffer.from( certificate.publicKeyRaw ).toString( 'hex' ).slice( -128 );
  try {
    const { extensions } = certificate;
    if( extensions.length > 0 ) {
      publicKey = Buffer.from( extensions[0].value ).toString().substr(3);
    }
    const publicKeyBuffer = EthUtil.toBuffer( `0x${publicKey}` );
    const wallet = Wallet.fromPublicKey( publicKeyBuffer );
    return `0x${wallet.getAddress().toString( 'hex' )}`;
  } catch( e ) {
    console.log(e);
    return null;
  }
}
