import React, { useState } from "react";
import { Alert, Button, Card, Modal, Upload } from "antd";
import Eth from "ethjs-query";
import EthContract from "ethjs-contract";
import { UploadOutlined } from '@ant-design/icons';
import config from "../../config";
import { getIssuer, getSubject, getPublicKey, getAddress, parsePEM, getExtensions, checkSignature } from "./utils";

const DNSModal = ( { visible, hide, user } ) => {

  const [certificate, setCertificate] = useState(null);

  const onOk = async () => {
    const eth = new Eth( window.ethereum );
    const Contract = new EthContract( eth )( config.abi );

    const contract = Contract.at( process.env.REACT_APP_CONTRACT );
    const result = await contract.addDID( certificate.address, certificate.raw,
      { from: user.account, gasLimit: 210000, gasPrice: 0 } );
    console.log('Tx Receipt:', result);
    hide();
  };

  const onSelectFile = async ( file ) => {
    if( !(file.file instanceof File) ){
      setCertificate( null );
    } else {
      const reader = new FileReader();
      reader.onload = e => {
        const pem = e.target.result;
        try {
          const crt = parsePEM( pem );
          const subject = getSubject( crt );
          const issuer = getIssuer( crt );
          const publicKey = getPublicKey( crt );
          const address = getAddress( publicKey );
          const extensions = getExtensions( crt );
          const validIssuer = checkSignature( crt, parsePEM( config.trustedCAs.idemia ) );
          setCertificate( {
            raw: pem,
            subject,
            issuer,
            extensions,
            address,
            validIssuer
          } );
        } catch(error) {
          console.log(error);
          setCertificate( { address: null } );
        }
      }
      reader.readAsText( file.file );
    }
  }

  return (
    <Modal
      title="Register New DID"
      width="600px"
      okText="Register"
      visible={visible}
      onOk={onOk}
      onCancel={() => hide()}
    >
      <div>
        <div className="text-center mb-2">
          <Upload onChange={file => onSelectFile( file)} beforeUpload={() => false} showUploadList={false}>
            <Button className="btn btn-warning">
              <UploadOutlined /> Select Certificate X.509 (PEM)
            </Button>
          </Upload>
        </div>
        {certificate && !certificate.address &&
        <Alert message="Selected certificate is not valid for LACChain DNS" type="error" />
        }
        {certificate && !certificate.validIssuer &&
        <Alert message="Certificate was not issued by a valid Root CA" type="error" />
        }
        {certificate && certificate.address &&
        <>
          <div className="row">
            <div className="col-md-12">
              <b>Ethereum Address:</b> {certificate.address}
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Card size="small" title="Subject">
                {Object.keys(certificate.subject).map( key => (
                  <div className="pl-2" key={key}>
                    <div><b>{key}:</b> {certificate.subject[key]}</div>
                  </div>
                ) )}
              </Card>
            </div>
            <div className="col-md-6">
              <Card size="small" title="Issuer">
                {Object.keys(certificate.issuer).map( key => (
                  <div className="pl-2" key={key}>
                    <div><b>{key}:</b> {certificate.issuer[key]}</div>
                  </div>
                ) )}
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Card size="small" title="Extensions">
                <ul>
                  {certificate.extensions.map( e => <li key={e.name}><b>{e.name}</b>: {e.value.match(/.{0,2}/g).join(':')}</li> )}
                </ul>
              </Card>
            </div>
          </div>
        </>
        }
      </div>
    </Modal>
  )
}

export default DNSModal;
