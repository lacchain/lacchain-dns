import React, { useState } from "react";
import { Button, Input, Modal, Upload } from "antd";
import Eth from "ethjs-query";
import EthContract from "ethjs-contract";
import { UploadOutlined } from '@ant-design/icons';
import config from "../../config";
// import { getCertificateInfo, getPublicKey, verifyChain, getAddress } from "./utils";

const { TextArea } = Input;

const DNSModal = ( { visible, hide, user } ) => {

  const [certificate, setCertificate] = useState({raw: 'asdasdasdasd'});

  const onOk = async () => {
    const eth = new Eth( window.ethereum );
    const Contract = new EthContract( eth )( config.abi );

    const contract = Contract.at( process.env.REACT_APP_CONTRACT );
    await contract.addDID( '0x00000000000000000000000000000000', 'asdasdasda',
      { from: user.account, gasLimit: 210000, gasPrice: 0 } );
    hide();
  };

  /* const validateCertificate = async( cert, root ) => {
    const isValidChain = await verifyChain( cert, root );
    const info = await getCertificateInfo( cert );
    const publicKey = await getPublicKey( cert );
    const address = getAddress( publicKey );

    console.log( 'isValidChain:', isValidChain );
    console.log( 'info:', info );
    console.log( 'publicKey:', publicKey );
    console.log( 'address:', address );
  } */

  const onSelectFile = async ( file ) => {
    if( !file ){
      return setCertificate( {
        raw: ''
      } );
    }
    const reader = new FileReader();
    reader.onload = e => {
      setCertificate( {
        raw: e.target.result
      } );
    }
    reader.readAsText( file.file );
     // const info = await getCertificateInfo( cert );
     console.log( certificate );
     return "";
  }

  return (
    <Modal
      title="Register New DID"
      width="600px"
      visible={visible}
      onOk={onOk}
      onCancel={() => hide()}
    >
      <div>
        <div className="text-right">
          <Upload onChange={file => onSelectFile( file)} beforeUpload={() => false}>
            <Button className="btn btn-warning">
              <UploadOutlined /> Select Certificate X.509 (PEM)
            </Button>
          </Upload>
        </div>
        <div className="row">
          <div className="col-md-12">
            <b style={{display: 'block', margin: '10px 0 5px 0'}}>DID:</b>
            <Input
              size="default"
              placeholder="0x00000000000000000000000000000000"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <b style={{display: 'block', margin: '10px 0 5px 0'}}>Certificate Info:</b>
            <TextArea rows={10} value={certificate.raw} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DNSModal;
