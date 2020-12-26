import {
  GetV2LinkIdPathParams,
  GetV2LinkIdResponse,
  PostV2LinksRequestBody,
  PostV2LinksResponse,
} from '../../../../api-types';
import User from '../../../../app/Users/User';
import IController from '../Controller';

export default interface ILinkController extends IController {
  getLink(currentUser: User, pathParams: GetV2LinkIdPathParams): Promise<GetV2LinkIdResponse>;
  addLink(currentUser: User, body: PostV2LinksRequestBody): Promise<PostV2LinksResponse>;
}
