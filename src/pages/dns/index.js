import React from 'react'
import { Button, Card, Table, Modal, Input } from 'antd'
import { Helmet } from 'react-helmet'
import moment from "moment";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Eth from "ethjs-query";
import EthContract from "ethjs-contract";
import ethers from "ethers";
import DNSModal from "./dns-modal";
import config from "../../config"

const { confirm } = Modal
const { Search } = Input;

const dnsContract = new ethers.Contract(process.env.REACT_APP_CONTRACT, config.abi, new ethers.providers.Web3Provider( window.ethereum ))
const eth = new Eth( window.ethereum );
const Contract = new EthContract(eth)(config.abi);
const signerContract = Contract.at(process.env.REACT_APP_CONTRACT);

class DNS extends React.Component {
  state = {
    loading: true,
    dids: [],
    filtered: []
  }

  columns = [
    {
      title: 'Entity',
      dataIndex: 'entity',
      key: 'entity'
    },
    {
      title: 'DID',
      dataIndex: 'did',
      key: 'did',
      render: text => (
        // <Link className="btn btn-sm btn-light" to={`/did/resolve/did:ethr:lacchain:${text}`}>
        <span>did:ethr:lacchain:{text}</span>
        // </Link>
      ),
    },
    {
      title: 'Expiration Date',
      dataIndex: 'expires',
      key: 'expires',
      render: date => (
        <span>{date.format('DD/MM/YYYY HH:mm')}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value, record) => {
        const className = value ? "font-size-12 badge badge-success" : "font-size-12 badge badge-danger";
        const text = value ? "Active" : "Revoked";

        return (
          <div>
            { moment().isAfter( record.expires ) ?
              <span className="font-size-12 badge badge-warning mr-2">
                Expired
              </span> : ''}
            <span className={className}>
              {text}
            </span>
          </div>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          {record.status ?
            <a href="#" onClick={e => this.revoke( record.did ) && e.preventDefault()} className="btn btn-sm btn-danger">
              <small>
                <i className="fe fe-trash mr-2" />
              </small>
              Revoke
            </a>
            :
            <a href="#" onClick={e => this.enable( record.did ) && e.preventDefault()} className="btn btn-sm btn-success">
              <small>
                <i className="fe fe-check mr-2" />
              </small>
              Enable
            </a>
          }
        </span>
      ),
    },
  ]

  componentDidMount() {
    this.fetchDIDs();
  }

  enable = async did => {
    const { user } = this.props;
    this.setState({ loading: true })
    await signerContract.enableDID(did, 3600, { from: user.account, gasLimit: 210000, gasPrice: 0 });
    this.fetchDIDs();
    return true;
  }

  revoke = async did => {
    const { user } = this.props;

    confirm( {
      title: 'Are you sure revoke this DID?',
      content: 'This action cannot be reverted',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      onOk: async () => {
        this.setState({ loading: true })
        await signerContract.revokeDID(did, { from: user.account, gasLimit: 210000, gasPrice: 0 });
        this.fetchDIDs();
      }
    } )

    return true;
  }

  search = value => {
    this.setState( ({ dids }) => {
      const result = dids.filter( did => did.did.toLowerCase().includes( value.toLowerCase() ) ||
                                         did.entity.toLowerCase().includes( value.toLowerCase() ) );
      return { filtered: result }
    })
  }

  fetchDIDs = async() => {
    const dids = await dnsContract.getDIDs();
    const data = await Promise.all(dids.map( did => dnsContract.getDID( did ) ));
    const result = dids.map( (did, index) => ({
      did,
      key: did,
      entity: data[index].entity,
      expires: moment(data[index].expires.toNumber() * 1000),
      status: data[index].status
    }) );
    this.setState({ dids: result, filtered: result, loading: false })
  }

  showModal = () => {
    this.setState( { isModalVisible: true } )
  };

  hideModal = () => {
    this.setState( { isModalVisible: false } )
  }

  render() {
    const { user } = this.props;
    const { filtered, loading, isModalVisible } = this.state;
    return (
      <div>
        <Helmet title="DNS" />
        <Card className="card" loading={loading}>
          <div className="card-header card-header-flex">
            <div className="d-flex flex-column justify-content-center mr-auto">
              <Search
                placeholder="Search Entity/DID"
                size="medium"
                style={{ width: 400 }}
                onSearch={value => this.search( value )}
                enterButton
              />
            </div>
            <div className="d-flex flex-column justify-content-center">
              <Button onClick={()=>this.showModal()} className="btn btn-primary btn-with-addon">
                <span className="btn-addon">
                  <i className="btn-addon-icon fe fe-arrow-up-circle" />
                </span>
                Register New DID
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="text-nowrap">
              <Table columns={this.columns} dataSource={filtered} pagination={{defaultPageSize: 5}} />
            </div>
          </div>
        </Card>
        <DNSModal visible={isModalVisible} hide={this.hideModal} user={user} />
      </div>
    )
  }
}

const mapStateToProps = ( { user } ) => ( {
  user
} );

export default connect( mapStateToProps )(DNS)
