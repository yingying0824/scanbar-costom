/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-03-03 17:13:16 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-03-03 17:44:23
 */
import requestHttp from "../common/request/request.http";
import { ResponseCode, UserService, UserInterfaceMap } from "../constants";
import { store } from "../app";

class UserAction {

  /**
   * @todo 获取收货地址列表
   *
   * @memberof UserAction
   */
  public addressList = async () => {
    const result = await UserService.addressList();
    if (result.code === ResponseCode.success) {
      store.dispatch({
        type: UserInterfaceMap.reducerInterface.RECEIVE_ADDRESS_LIST,
        payload: result.data
      });
    }
    return result;
  }

  /**
   * 修改收货地址
   *
   * @memberof UserAction
   */
  public addressEdit = async (params: any) => {
    const result = await UserService.addressEdit(params);
    return result;
  }

  /**
   * @todo 添加收货地址
   *
   * @memberof UserAction
   */
  public addressAdd = async (params: any) => {
    const result = await UserService.addressAdd(params);
    return result;
  }

   /**
   * @todo 删除收货地址
   *
   * @memberof UserAction
   */
  public addressDelete = async (params: any) => {
    const result = await requestHttp.delete(`/api/address/remove/${params.id}`, '');
    return result;
  }

  /**
   * @todo 存储用户信息
   *
   * @memberof UserAction
   */
  public userInfoSave = async (params: any) => {
    const result = await UserService.userInfoSave(params);
    return result;
  }
}

export default new UserAction();