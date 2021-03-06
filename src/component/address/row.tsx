import Taro from '@tarojs/taro'
import { View, Image, Input } from '@tarojs/components'
import classNames from 'classnames'
import './index.less'

const prefix = 'address-component-row'

type Props = {
  arrow?: boolean;
  isBorder?: boolean;
  isBorderTop?: boolean
  title: string;
  isInput?: boolean;            // 是否显示输入框
  inputDisable?: boolean;
  inputValue?: string;          // 右侧输入框
  inputPlaceHolder?: string;    // 右侧输入框默认值
  inputOnChange?: (value: string) => any; // 输入改变函数
  onClick?: any;
  buttons?: any[];
  className?: string;
  buttonPos?: string;
}

class Item extends Taro.Component<Props> {

  static options = {
    addGlobalClass: true
  };

  defaultProps = {
    onClick: undefined,
    isBorder: true,
    isBorderTop: false,
    arrow: false,
    isInput: false,
    inputValue: '',
    inputPlaceHolder: '',
    inputOnChange: undefined,
    buttons: undefined,
    buttonPos: 'buttonPos'
  }

  render () {
    const { 
      className,
      onClick,
      title,
      isBorder,
      isBorderTop,
      arrow,
      isInput,
      inputValue,
      inputDisable,
      inputPlaceHolder,
      inputOnChange,
      buttons,
      buttonPos
    } = this.props;
    console.log('isBorderTop', isBorderTop)
    return (
      <View className={`${prefix}-view`}>
        <View 
          className={classNames(`${prefix}`, {
            [`${prefix}-border`]: isBorder,
            [`${prefix}-top`]: isBorderTop,
            [`${className}`]: !!className
          })}
          onClick={() => {
            if (!!onClick) {
              onClick();
            }
          }}
        >
          <View className={`${prefix}-title`}>
            {title}
          </View>
          
          <View className={`${prefix}-detail`}>
            {!!arrow && (
              <Image className={`${prefix}-detail-arrow`} src='//net.huanmusic.com/scanbar-c/icon_commodity_into.png' />
            )}
            
            {!!isInput && (
              <Input
                name='row-input'
                value={inputValue}
                disabled={inputDisable}
                placeholder={inputPlaceHolder}
                onInput={({detail: {value}}) => inputOnChange && inputOnChange(value)}
                className={`${prefix}-input`}
                placeholderClass={`${prefix}-input-place`}
              />
            )}

            {buttons && buttons.length > 0 && (
              <View 
                className={classNames(`${prefix}-buttons`, {
                  [`${prefix}-buttons-${buttonPos}`]: !!buttonPos
                })}
              >
                {buttons.map((button) => {
                  return (
                    <View
                      key={button.title}
                      onClick={button.onPress}
                      className={classNames(
                        `${prefix}-buttons-button`, 
                        {
                          [`${prefix}-buttons-button-active`]: button.type === 'confirm' ? true : false,
                        }
                      )}
                    >
                      {button.title}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
        
        {!!buttonPos && buttonPos === 'bottom' && (
          <View 
            className={classNames(`${prefix}-buttons-bottom-view`, {
              [`${prefix}-border`]: true,
            })} 
          />
        )}
      </View>
    )
  }
}

export default Item