import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import productImg from "../../resources/images/product_1.png"
import BuyNowButton from "./buyNowButton";

class ProductCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="product_card">
                <img src = {productImg}/>
                <div className="product_name">
                    {this.props.product.name}
                </div>
                <div className="products_metadata">
                    <span>
                        CBD<br/>
                        <sub>
                            92.3%
                        </sub>
                    </span> | 
                    <span>
                        THC<br/>
                        <sub>
                            12.34%
                        </sub>
                    </span> | 
                    <span>
                        CT<br/>
                        <sub>
                            18%
                        </sub>
                    </span>
                </div>
                <BuyNowButton product = {this.props.product}/>
            </div>
        );
    }
}
export default ProductCard;