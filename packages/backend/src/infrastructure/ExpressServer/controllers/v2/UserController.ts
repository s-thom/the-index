import { GetV2UserIdPathParams, GetV2UserIdResponse } from '../../../../api-types';
import User from '../../../../app/Users/User';
import IController from '../Controller';

export default interface IUserController extends IController {
  getByName(currentUser: User, pathParams: GetV2UserIdPathParams): Promise<GetV2UserIdResponse>;
}
