import React  from "react";
import { DatePicker, Form, Input, Modal } from "antd";
import Eth from "ethjs-query";
import EthContract from "ethjs-contract";
import moment from "moment";
import config from "../../config";

const DNSModal = ( {visible, hide, user} ) => {

  const [form] = Form.useForm();

  const onOk = () => {
    form.submit();
  };

  const onFinish = async ( data ) => {
    const eth = new Eth( window.ethereum );
    const Contract = new EthContract(eth)(config.abi);

    const contract = Contract.at(process.env.REACT_APP_CONTRACT);
    await contract.addDID( data.did, moment(data.expires).diff( moment(), 'seconds' ), data.entity,
      { from: user.account, gasLimit: 210000, gasPrice: 0 } );
    hide();
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
        <Form form={form} onFinish={onFinish} layout="vertical">
          <div className="row">
            <div className="col-md-12">
              <Form.Item
                name="did"
                label="Address of DID"
                rules={[{ required: true, message: 'Please input the DID address' }]}
              >
                <Input
                  size="default"
                  placeholder="0x00000000000000000000000000000000"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <Form.Item
                name="entity"
                label="Entity"
                rules={[{ required: true, message: 'Please specify the entity name' }]}
              >
                <Input
                  size="default"
                  placeholder="Name of the entity/organization"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item
                name="expires"
                label="Expiration"
                rules={[{ required: true, message: 'Please select the expiration date' }, () => ({
                  validator(rule, value) {
                    if (moment().isBefore(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The selected date must be after today'));
                  },
                })]}
              >
                <DatePicker className="width-100p" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default DNSModal;
