import { Request } from 'express';
import { DeleteV2AuthResponse, PostV2AuthRequestBody, PostV2AuthResponse } from '../../../../api-types';
import IController from '../Controller';

export default interface IAuthenticationController extends IController {
  logIn(req: Request, requestBody: PostV2AuthRequestBody): Promise<PostV2AuthResponse>;
  logOut(req: Request): Promise<DeleteV2AuthResponse>;
}
