import Taro, { Config } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import TabsSwitch from '../../component/tabs/tabs.switch';
import '../order/index.less'
import { OrderInterface, ResponseCode, UserInterface } from '../../constants';
import { OrderAction } from '../../actions';
import invariant from 'invariant';
import { getOrderList, getOrderListTotal, getOrderCount, getOrderAllStatus, getCurrentType } from '../../reducers/app.order';
import { connect } from '@tarojs/redux';
import OrderItem from '../../component/order/order';
import "../style/product.less";
import Empty from '../../component/empty';
import orderAction from '../../actions/order.action';
import { store } from '../../app';
import { getUserinfo } from '../../reducers/app.user';

const cssPrefix = 'order';

let pageNum: number = 1;
const pageSize: number = 20;

interface Props {
  orderList: OrderInterface.OrderDetail[];
  orderListTotal: number;
  orderCount: OrderInterface.OrderCount;
  orderAllStatus: any[];
  currentType: number;
  userinfo: UserInterface.UserInfo;
}

interface State {
  getUserinfoModal: boolean;
  loginModal: boolean;
}

class Order extends Taro.Component<Props, State> {
  state = {
    getUserinfoModal: false,
    loginModal: false
  }

  config: Config = {
    navigationBarTitleText: '订单',
  }

  async componentDidMount() {
    // this.loginCheck();
  }

  async componentDidShow() {
    const { userinfo } = this.props;
    if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
      return;
    }
    if ((userinfo.phone === undefined || userinfo.phone.length === 0)) {
      return;
    };
    this.init();
  }

  public loginCheck() {
    const { userinfo } = this.props;
    if (userinfo.nickname === undefined || userinfo.nickname.length === 0) {
      // this.setState({ getUserinfoModal: true });
      Taro.navigateTo({ url: '/pages/login/login.userinfo' })
      return false;
    }
    if ((userinfo.phone === undefined || userinfo.phone.length === 0)) {
      Taro.navigateTo({ url: '/pages/login/login' })
      return false;
    };
    return true;
  }

  public onChangeTab = async (tabNum: number) => {
    await store.dispatch({
      type: 'CHANGR_CURRENT_TYPE',
      payload: {
        currentType: tabNum
      }
    });
    this.fetchOrder(1);
    OrderAction.orderCount();
  }

  public init = async () => {
    const { currentType } = this.props;
    pageNum = 1;
    OrderAction.orderList({ pageNum: pageNum++, pageSize, ...orderAction.getFetchType(currentType) });
    OrderAction.orderCount();
  }

  public fetchOrder = async (page?: number) => {
    const { currentType } = this.props;
    try {
      let payload: OrderInterface.OrderListFetchFidle = {
        pageNum: typeof page === 'number' ? page : pageNum,
        pageSize: 20,
        ...orderAction.getFetchType(currentType)
      };

      const result = await OrderAction.orderList(payload);
      invariant(result.code === ResponseCode.success, result.msg || ' ');
      if (typeof page === 'number') {
        pageNum = page;
      } else {
        pageNum += 1;
      }
    } catch (error) {
      Taro.showToast({
        title: error.message,
        icon: 'none'
      });
    }
  }

  // getPhoneNumber = (userinfo: any) => {
  //   if (userinfo.phone === undefined || userinfo.phone.length === 0) {
  //     this.setState({
  //       loginModal: true
  //     });
  //   }
  // }

  render() {
    const { orderList, orderListTotal, orderAllStatus, currentType, userinfo } = this.props;
    const hasMore = orderList.length < orderListTotal;
    // const { getUserinfoModal, loginModal } = this.state;
    return (
      <View className={`container ${cssPrefix}`}>
        <View className={`${cssPrefix}-tabs`}>
          {this.renderTabs()}
        </View>
        {
          orderList && orderList.length > 0
            ? (
              <ScrollView
                scrollY={true}
                className={`${cssPrefix}-scrollview`}
                onScrollToLower={() => {
                  if (hasMore) {
                    this.fetchOrder();
                  }
                }}
              >
                {
                  orderList.map((item: any) => {
                    return (
                      <View className={`${cssPrefix}-scrollview-item`} key={item.orderNo}>
                        <OrderItem data={item} orderAllStatus={orderAllStatus} currentType={currentType} />
                      </View>
                    )
                  })
                }

                {!hasMore && orderList.length > 0 && (
                  <View className={`${cssPrefix}-scrollview-bottom`}>已经到底了</View>
                )}
              </ScrollView>
            )
            : (
              userinfo.nickname === undefined || userinfo.nickname.length === 0 ||
                userinfo.phone === undefined || userinfo.phone.length === 0 ? (
                  <Empty
                    img='//net.huanmusic.com/scanbar-c/v1/img_cart.png'
                    text='完成登录后可享受更多会员服务'
                    button={{
                      title: '去登录',
                      onClick: () => this.loginCheck()
                    }}
                  />
                ) : (
                  < Empty
                    img='//net.huanmusic.com/scanbar-c/v1/img_cart.png'
                    text='还没有订单，快去选购吧'
                    button={{
                      title: '去选购',
                      onClick: () => {
                        Taro.switchTab({
                          url: `/pages/index/index`
                        })
                      }
                    }}
                  />
                )
            )}

        {/* <GetUserinfoModal isOpen={getUserinfoModal} onCancle={() => { this.setState({ getUserinfoModal: false }) }} callback={(userinfo: any) => this.getPhoneNumber(userinfo)} />
        <LoginModal isOpen={loginModal} onCancle={() => { this.setState({ loginModal: false }) }} /> */}

      </View>
    )
  }

  private renderTabs = () => {
    const { orderCount, currentType } = this.props;
    const orderTypes = [
      {
        title: '全部'
      },
      {
        title: '待支付',
        num: orderCount.initNum || 0,
      },
      {
        title: '待发货',
        num: orderCount.waitForDelivery || 0,
      },
      {
        title: '待收货',
        num: orderCount.inTransNum || 0,
      },
      {
        title: '待自提',
        num: orderCount.waitForReceiptNum || 0,
      },
    ];
    return (
      <TabsSwitch
        current={currentType}
        tabs={orderTypes}
        onChangeTab={this.onChangeTab}
      />
    )
  }
}

const select = (state: any) => ({
  orderList: getOrderList(state),
  orderListTotal: getOrderListTotal(state),
  orderCount: getOrderCount(state),
  orderAllStatus: getOrderAllStatus(state),
  currentType: getCurrentType(state),
  userinfo: getUserinfo(state)
});

export default connect(select)(Order);