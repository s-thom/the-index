import { PostV2LinksRequestBody, PostV2LinksResponse } from '../../../../api-types';
import User from '../../../../app/Users/User';
import IController from '../Controller';

export default interface ILinkController extends IController {
  addLink(currentUser: User, body: PostV2LinksRequestBody): Promise<PostV2LinksResponse>;
}
