import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import loading from '../../resources/images/loadingBig.svg'
import GCFillInfo from './gcFillInfo'
import GCPay from './gcPay'
import GCProductCard from "./gcProductCard";
import store from "../../redux/store";
import Swal from "sweetalert2";
import {getPriceByQuantity} from "../reuseable/getPriceByQuantity";

const mapStateToProps = state => ({
  state: state.reducer
})

class GoCardless extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bankInfo: {}
    }
    this.confirmAccount()
  }

  componentDidMount() {
    axios.get('/api/gc/oneBank')
        .then(res => {
          this.setState({
            bankInfo: res.data,
          })
          console.log(res.data);
        })
        .catch(err => {
          console.log(err)
        })
  }

  confirmAccount = () => {
    let params = new URLSearchParams(window.location.href)
    /*(!) TO GO LIVE
    const url = 'https://wholesale-portal-testing.herokuapp.com/buy?redirect_flow_id';
    */
    const url = 'http://localhost:3000/buy?redirect_flow_id'
    console.log(params.has(url));
    if (params.has(url)) {
      const redirect = params.get(url)
      this.props.history.replace('/buy')
      axios
        .post('/api/gc/completeRedirect', {redirect: redirect})
        .then(res => {
          store.dispatch({
            type: 'CHANGE_MANDATE_STATUS'
          })
          Swal.fire({
            title: '<span class="swal_title"> SUCCESS',
            text: "Your payment method has been updated!",
            icon: 'success',
            background: '#1E1F26',
            customClass: {
              confirmButton: 'swal_confirm_button'
            }
          })
        })
        .catch(err => {
          Swal.fire({
            title: '<span class="swal_title"> ERROR',
            text: "Something went wrong trying to change you payment method, please try again!",
            icon: 'error',
            background: '#1E1F26',
            customClass: {
              confirmButton: 'swal_confirm_button'
            }
          })
        })
     }
  }

  render () {
    let total = 0;
    const products = this.props.state.cart.map((cartProduct, index) => {
      //only give price to product available
      if (!cartProduct.deleted) {
        const productTotal = getPriceByQuantity(
            cartProduct.priceTiers,
            cartProduct.quantity,
            cartProduct.price
        )
        total += productTotal
        return {
          product: cartProduct,
          price: productTotal,
          quantity: cartProduct.quantity
        }
      }})

    const productsList = products.map((product, index) => {
            return <GCProductCard product={product} key={index}/>
        })
    return (
      <div className='buy'>
        {(() => {
          if (!this.props.state.hasMandate) {
            return <GCFillInfo total={total}/>
          } else {
            return <GCPay total={total}/>
         }
        })()}
        <div className="cart_products_payment">
          <div className='gc_info_card'>
            <div className='order_info_title'>Payment Method</div>
            <div className='order_info_split'>
              <div className='order_info_content'>Account Holder: </div>
              <div className='order_info_content'>{this.state.bankInfo.account_holder_name}</div>
            </div>
            <div className='order_info_split'>
              <div className='order_info_content'>Account Number:</div>
              <div className='order_info_content'>********{this.state.bankInfo.account_number}</div>
            </div>
            <div className='order_info_split'>
              <div className='order_info_content'>Account Type:</div>
              <div className='order_info_content'>{this.state.bankInfo.account_type}</div>
            </div>
            <div className='order_info_split'>
              <div className='order_info_content'>Bank Name:</div>
              <div className='order_info_content'>{this.state.bankInfo.bank_name}</div>
            </div>
          </div>
          {productsList}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(GoCardless)
