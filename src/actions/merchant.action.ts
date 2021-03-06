/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-03-03 17:19:06 
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-04-07 18:11:45
 */
import { 
  MerchantService, 
  MerchantInterface, 
  MerchantInterfaceMap, 
} from "../constants";
import { ResponseCode } from '../constants/index';
import { BASE_PARAM } from '../common/util/config';
import { store } from '../app';

class MerchantAction {

  public activityInfoList = async () => {
    const merchantId = store.getState().merchant.currentMerchantDetail.id;
    const result = await MerchantService.activityInfoList(merchantId);
    if (result.code === ResponseCode.success) {

      let data: any[] = [];

      if (result.data.rows.length > 0) {
        result.data.rows.map((item) => {
          const row = {
            ...item,
            rule: !!item.rule && item.rule.length > 0 ? JSON.parse(item.rule) : item.rule,
          };
          data.push(row);
        });
      }
      
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ACTIVITYLIST,
        payload: data
      })
    }
    return result;
  }

  /**
   * @todo 根据商户id获取商户详情
   *
   * @memberof MerchantAction
   */
  public merchantDetail = async (params: MerchantInterface.merchantDetailFetchField) => {
    const result = await MerchantService.merchantInfoDetail(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DETAIL,
        payload: result.data
      });
    }
    return result;
  }

  /**
   * @todo 获取门店列表
   *
   * @memberof MerchantAction
   */
  public merchantList = async () => {
    const result = await MerchantService.merchantList();
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_LIST,
        payload: result.data.rows
      });
      if (result.data.rows && result.data.rows.length > 0) {
        store.dispatch({
          type: MerchantInterfaceMap.reducerInterface.RECEIVE_CURRENT_MERCHANT_DETAIL,
          payload: result.data.rows.filter(val => val.id ===  BASE_PARAM.MCHID)[0] || {merchantId: BASE_PARAM.MCHID}
        });
        this.advertisement({merchantId: BASE_PARAM.MCHID});
      }
    }
    return result;
  }

  /**
   * @todo 获取商户距离
   *
   * @memberof MerchantAction
   */
  public merchantDistance = async (params: MerchantInterface.merchantDistanceFetchField) => {
    const result = await MerchantService.merchantDistance(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_DISTANCE,
        payload: result.data
      })
    }
    return result;
  }

  public advertisement = async(params: MerchantInterface.merchantDetailFetchField) => {
    const result = await MerchantService.advertisement(params);
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: MerchantInterfaceMap.reducerInterface.RECEIVE_MERCHANT_ADVERTISEMENT,
        payload: result.data.rows
      });
    }
    return result;
  }
}

export default new MerchantAction();