import { GetV2TagsQueryParams, GetV2TagsResponse } from '../../../../api-types';
import User from '../../../../app/Users/User';
import IController from '../Controller';

export default interface ITagController extends IController {
  getCommonlyUsedTags(user: User, queryParams: GetV2TagsQueryParams): Promise<GetV2TagsResponse>;
}
