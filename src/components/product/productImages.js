import React from 'react'
import { connect } from 'react-redux'
import FavoritesHeart from '../reuseable/favoritesHeart'
import blank_image from "../../resources/images/blank_image.jpg"

const mapStateToProps = state => ({
  state: state.reducer
})

const selectCSS = (index, activeIndex) =>{
  if (index === 0 && index !== activeIndex)
  {
    return 'static_carousel_image_container'
  } else if(index === 0 && index === activeIndex){
    return 'static_carousel_image_container_active'
  } else if(index !== activeIndex){
    return 'carousel_image_container'
  } else {
    return 'carousel_image_container_active'
  }
}

const CarouselImage = ({ image, select, index, activeIndex}) => {

  const imageCSS = selectCSS(index, activeIndex);
  return (
    <div className={imageCSS} onClick={() => select(index)}>
      <img className='carousel_image' src={image} alt='single_product_image' />
    </div>
  )
}

class ProductImages extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: 0
    }
  }
  
  selectImage = index => {
    this.setState({ active: index })
  }

  render () {

    const carouselImages = this.props.images.map((image, index) => (
      
      <CarouselImage
        image={image.url}
        select={this.selectImage}
        key={index}
        index={index}
        activeIndex={this.state.active}
      />
    ))

    if (!this.props.images.length) {
      return (
        <div className='product_page_images'>
          <div className='product_page_image'>
            <img
              className='product_image'
              alt='product_image'
              src={blank_image}
            />
            {this.props.productID && (
            <FavoritesHeart productID={this.props.productID} chooseStyle={false}/>
          )}
          </div>
      </div>
      );
    }
  //  const image =  (product.imageData.length && product.imageData[0].url) ? product.imageData[0].url : blank_image
    const image = this.props.images[this.state.active].url ? this.props.images[this.state.active].url : blank_image;
    return (
      <div className='product_page_images'>
        <div className='product_page_image'>
          <img
            className='product_image'
            alt='product_image'
            src={image}
          />
          {this.props.productID && (
            <FavoritesHeart productID={this.props.productID} chooseStyle={false}/>
          )}
        </div>
        <div className='product_images_carousel'>{carouselImages}</div>
      </div>
    )
  }
}
export default connect(mapStateToProps)(ProductImages)
