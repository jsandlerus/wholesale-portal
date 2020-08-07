import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import loading from '../../resources/images/loadingBig.svg'
import GCFillInfo from './gcFillInfo'
import GCPay from './gcPay'
import GCProductCard from "./gcProductCard";
const mapStateToProps = state => ({
  state: state.reducer
})

class GoCardless extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      hasClientID: false,
      hasMandate: false,
      hasCheckedUrl: false,
      hasCheckedClient: false
    }
  }

  checkClientCGID = () => {
    console.log('checking client id')
    axios
      .get('/api/gc/checkClientID')
      .then(res => {
        if (res.data) {
          console.log('got client id')
          this.setState({
            hasClientID: true,
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  checkClientMandate = () => {
    axios
      .get('/api/gc/checkClientMandate')
      .then(res => {
        if (res.data) {
          this.setState({
            hasMandate: true,
            loading: false
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  checkForIdOrMandate = async () => {
      await this.checkClientCGID();
      await this.checkClientMandate();
      this.setState({
        hasCheckedClient: true,
        loading: false
      })
  }

  confirmAccount = () => {
    let params = new URLSearchParams(window.location.href)
    /*(!) TO GO LIVE
    const url = 'https://wholesale-portal-testing.herokuapp.com/cart?redirect_flow_id';
    */
    const url = 'http://localhost:3000/cart?redirect_flow_id'
    if (params.has(url)) {
      this.setState({
        loading: true
      })
      const redirect = params.get(url)
      axios
        .post('/api/gc/completeRedirect', redirect)
        .then(res => {
          this.setState({
            hasMandate: true,
            hasClientID: true,
            hasCheckedUrl: true,
            loading: false
          })
          window.open("http://localhost:3000/cart", "_self");
        })
        .catch(err => {
          console.log(err)
          this.setState({
            hasCheckedUrl: true,
            loading: false
          })
          window.open("http://localhost:3000/cart", "_self");
        })
    } else {
      this.setState({
        hasCheckedUrl: true,
        loading: false
      })
    }
  }

  render () {
    const total = this.props.history.location.state.total;
    const products = this.props.history.location.state.products;

    const productsList = products.map((product, index) => {
            return <GCProductCard product={product} key={index}/>
        })

    if (!this.state.hasCheckedClient)
      this.checkForIdOrMandate()

    if (this.state.hasClientID && !this.state.hasCheckedUrl)
      this.confirmAccount()

    return (
      <div className='buy'>
        {(() => {
          if (this.state.loading) {
              return <img src={loading} />
          }
          else if (!this.state.hasMandate) {
            return <GCFillInfo total={total}/>
          } else {
            return <GCPay total={total}/>
         }
        })()}
        <div className="cart_products_payment">
          {productsList}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(GoCardless)
