import React from 'react'
import { Button, Card, Input, Modal, Table } from 'antd'
import { Helmet } from 'react-helmet'
import moment from "moment";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Eth from "ethjs-query";
import EthContract from "ethjs-contract";
import ethers from "ethers";
import DNSModal from "./dns-modal";
import config from "../../config";
import { getAddress, getDates, getExtensions, getIssuer, getPublicKey, getSubject, parsePEM } from "./utils";
import DetailsModal from "./details-modal";

const { confirm } = Modal
const { Search } = Input;

const dnsContract = new ethers.Contract( process.env.REACT_APP_CONTRACT, config.abi, new ethers.providers.Web3Provider( window.ethereum ) )
const eth = new Eth( window.ethereum );
const Contract = new EthContract( eth )( config.abi );
const signerContract = Contract.at( process.env.REACT_APP_CONTRACT );

class DNS extends React.Component {
  state = {
    loading: true,
    dids: [],
    filtered: []
  }

  componentDidMount() {
    this.fetchDIDs();
  }

  enable = async did => {
    const { user } = this.props;
    this.setState( { loading: true } )
    await signerContract.enableDID( did, 3600, { from: user.account, gasLimit: 210000, gasPrice: 0 } );
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
      onOk: async() => {
        this.setState( { loading: true } )
        await signerContract.revokeDID( did, { from: user.account, gasLimit: 210000, gasPrice: 0 } );
        this.fetchDIDs();
      }
    } )

    return true;
  }

  search = value => {
    this.setState( ( { dids } ) => {
      const result = dids.filter( did => did.did.toLowerCase().includes( value.toLowerCase() ) ||
        did.subject.organizationName.toLowerCase().includes( value.toLowerCase() ) );
      return { filtered: result }
    } )
  }

  fetchDIDs = async() => {
    const dids = await dnsContract.getDIDs();
    const data = await Promise.all( dids.map( did => dnsContract.getDID( did ) ) );

    const result = dids.map( ( did, index ) => {
      try {
        const pem = Buffer.from( data[index].entity );
        const crt = parsePEM( pem );
        const subject = getSubject( crt );
        const issuer = getIssuer( crt );
        const publicKey = getPublicKey( crt );
        const dates = getDates( crt );
        const address = getAddress( publicKey );
        const extensions = getExtensions( crt );
        return {
          did: `did:ethr:lacchain:${address}`,
          key: address,
          address,
          subject,
          issuer,
          validity: dates,
          extensions,
          publicKey
        }
      } catch( e ) {
        return {
          did: `did:ethr:lacchain:unknown`,
          key: '-1',
          subject: 'unknown',
          issuer: 'unknown',
          extensions: [],
          validity: { from: 0, to: 0 },
          publicKey: 'unknown'
        }
      }
    } );
    this.setState( { dids: result, filtered: result, loading: false } )
  }

  showDetails = selectedCertificate => {
    console.log('show details');
    this.setState( { selectedCertificate, isDetailsVisible: true } )
  };

  hideDetails = () => {
    this.setState( { isDetailsVisible: false } )
  }

  showModal = () => {
    this.setState( { isModalVisible: true } )
  };

  hideModal = () => {
    this.setState( { isModalVisible: false } )
  }

  render() {
    const columns = [
      {
        title: 'Organization',
        dataIndex: 'subject',
        key: 'subject',
        render: subject => (
          <span>{subject.organizationName}</span>
        ),
      },
      {
        title: 'Country',
        dataIndex: 'issuer',
        key: 'country',
        render: issuer => (
          <span>{issuer.countryName}</span>
        ),
      },
      {
        title: 'DID',
        dataIndex: 'did',
        key: 'did',
        render: did => (
          <span>{did}</span>
        ),
      },
      {
        title: 'Expiration Date',
        dataIndex: 'validity',
        key: 'validity',
        render: validity => (
          <span>{moment(validity.to).format( 'DD/MM/YYYY HH:mm' )}</span>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: ( value, record ) => {
          const className = true ? "font-size-12 badge badge-success" : "font-size-12 badge badge-danger";
          const text = true ? "Active" : "Revoked";

          return (
            <div>
              {moment().isAfter( record.validity.to ) ?
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
            <a
              href="#"
              onClick={e => {
                this.showDetails( record );
                return e.preventDefault();
              }}
              className="btn btn-sm btn-success"
            >
              <small>
                <i className="fe fe-check mr-2" />
              </small>
              Details
            </a>
          </span>
        ),
      },
    ];
    const { user } = this.props;
    const { filtered, loading, isModalVisible, isDetailsVisible, selectedCertificate } = this.state;
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
              <Button onClick={() => this.showModal()} className="btn btn-primary btn-with-addon">
                <span className="btn-addon">
                  <i className="btn-addon-icon fe fe-arrow-up-circle" />
                </span>
                Register New DID
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="text-nowrap">
              <Table columns={columns} dataSource={filtered} pagination={{ defaultPageSize: 5 }} />
            </div>
          </div>
        </Card>
        <DNSModal visible={isModalVisible} hide={this.hideModal} user={user} />
        <DetailsModal visible={isDetailsVisible} hide={this.hideDetails} certificate={selectedCertificate} />
      </div>
    )
  }
}

const mapStateToProps = ( { user } ) => ( {
  user
} );

export default connect( mapStateToProps )( DNS )
