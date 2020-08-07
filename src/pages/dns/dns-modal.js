import React, { useState } from "react";
import { Alert, Button, Card, Modal, Upload } from "antd";
import Eth from "ethjs-query";
import EthContract from "ethjs-contract";
import { UploadOutlined } from '@ant-design/icons';
import config from "../../config";
import { getIssuer, getSubject, getPublicKey, getAddress } from "./utils";

const DNSModal = ( { visible, hide, user } ) => {

  const [certificate, setCertificate] = useState(null);

  const onOk = async () => {
    const eth = new Eth( window.ethereum );
    const Contract = new EthContract( eth )( config.abi );

    const contract = Contract.at( process.env.REACT_APP_CONTRACT );
    await contract.addDID( '0x00000000000000000000000000000000', 'asdasdasda',
      { from: user.account, gasLimit: 210000, gasPrice: 0 } );
    hide();
  };

  const onSelectFile = async ( file ) => {
    console.log(file.file);
    if( !(file.file instanceof File) ){
      setCertificate( null );
    } else {
      const reader = new FileReader();
      reader.onload = e => {
        const pem = e.target.result;
        try {
          const subject = getSubject( pem );
          const issuer = getIssuer( pem );
          const publicKey = getPublicKey( pem );
          const address = getAddress( publicKey );
          setCertificate( {
            raw: pem,
            subject,
            issuer,
            address
          } );
        } catch(error) {
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
                  <div className="pl-2">
                    <div><b>{key}:</b> {certificate.subject[key]}</div>
                  </div>
                ) )}
              </Card>
            </div>
            <div className="col-md-6">
              <Card size="small" title="Issuer">
                {Object.keys(certificate.issuer).map( key => (
                  <div className="pl-2">
                    <div><b>{key}:</b> {certificate.issuer[key]}</div>
                  </div>
                ) )}
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <b style={{display: 'block', margin: '10px 0 5px 0'}}>PEM:</b>
              <pre>
                {`${certificate.raw}`}
              </pre>
            </div>
          </div>
        </>
        }
      </div>
    </Modal>
  )
}

export default DNSModal;
