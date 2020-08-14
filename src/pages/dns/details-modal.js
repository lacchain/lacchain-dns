import React from "react";
import { Card, Modal } from "antd";

const DetailsModal = ( { visible, hide, certificate } ) => {

  if( !certificate ) return <div> </div>;

  return (
    <Modal
      title="DID Details"
      width="600px"
      visible={visible}
      onCancel={() => hide()}
    >
      <div>
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
      </div>
    </Modal>
  )
}

export default DetailsModal;
