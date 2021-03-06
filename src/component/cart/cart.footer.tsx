import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import '../../pages/product/component/index.less'
import '../product/product.less'
import "./index.less"

const cssPrefix = 'component-product';
const prefix = 'product-detail-component'

interface Props {
  buttonType?: string;
  buttonTitle: string;
  buttonClick: () => void;

  priceTitle: string;
  priceSubtitle: string;
  price: string;
  priceOrigin: string;
  priceDiscount?: string;
}

class Footer extends Taro.Component<Props> {

  public renderStepper = () => {
    const { buttonType, buttonTitle, buttonClick } = this.props;
    return (
      <View className={`${prefix}-cart-right`}>
        <View
          className={`${prefix}-cart-right-button ${prefix}-cart-right-button-pay`}
          onClick={() => buttonClick()}
        >
          {buttonTitle}
        </View>
      </View>
    )
  }

  public renderPrice = () => {
    const { priceTitle, priceSubtitle, price, priceOrigin, priceDiscount } = this.props;
    return (
      <View>
        <View className={`${cssPrefix}-normal component-cart-text`}>
          {/* <Text className={`${cssPrefix}-price-title`}>{priceTitle}</Text> */}
          {priceSubtitle && (
            <Text className={`${cssPrefix}-price-bge `}>{priceSubtitle}</Text>
          )}
          {price && (
            <Text className={`${cssPrefix}-price component-cart-text-price`}>{price.split('.')[0]}</Text>
          )}
          {price && (
            <Text className={`${cssPrefix}-price-bge ${cssPrefix}-price-pos `}>{`.${price.split('.')[1]}`}</Text>
          )}
          {/* {priceOrigin && ( 
          <Text className={`${cssPrefix}-price-origin `}>{priceOrigin}</Text>
          )} */}

        </View>
        {
          priceDiscount && (
            <Text className={`${cssPrefix}-price-discount `}>{priceDiscount}</Text>
          )
        }
      </View>

    )
  }

  render() {
    return (
      <View className={`${prefix}-cart`}>
        <View className={`${prefix}-cart-box`}>
          <View className={`${prefix}-cart-left`}>
            {this.renderPrice()}
          </View>
          {this.renderStepper()}
        </View>
      </View>
    )
  }
}

export default Footer