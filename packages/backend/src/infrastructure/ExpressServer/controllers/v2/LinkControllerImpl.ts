import { Router } from 'express';
import { Inject, Service } from 'typedi';
import * as Yup from 'yup';
import {
  GetV2LinkIdPathParams,
  GetV2LinkIdResponse,
  GetV2LinksQueryParams,
  GetV2LinksResponse,
  Link as ApiLink,
  PostV2LinksRequestBody,
  PostV2LinksResponse,
} from '../../../../api-types';
import Link from '../../../../app/Links/Link';
import LinkService from '../../../../app/Links/service/LinkService';
import LinkServiceImpl from '../../../../app/Links/service/LinkServiceImpl';
import User from '../../../../app/Users/User';
import ILoggerService, { Logger } from '../../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../../services/LoggerService/LoggerServiceImpl';
import { arrayTransformer } from '../../../../utils/yup';
import asyncRoute from '../../middleware/asyncRoute';
import LinkController from './LinkController';

@Service()
export default class LinkControllerImpl implements LinkController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => LinkServiceImpl) private readonly linkService: LinkService,
  ) {
    this.log = this.logger.child('LinkController');
  }

  private serialiseLink(link: Link): ApiLink {
    let visibility: 'public' | 'internal' | 'private';
    switch (link.visibility) {
      case 'public':
      case 'internal':
      case 'private':
        visibility = link.visibility;
        break;
      default:
        visibility = 'public';
        break;
    }

    return {
      id: link.reference,
      url: link.url,
      tags: link.tags,
      created: link.created?.toISOString(),
      visibility,
      user: {
        name: link.user.name,
      },
    };
  }

  async getLink(currentUser: User, pathParams: GetV2LinkIdPathParams): Promise<GetV2LinkIdResponse> {
    const link = await this.linkService.getLink(currentUser, pathParams.id);
    return {
      link: this.serialiseLink(link),
    };
  }

  async addLink(currentUser: User, body: PostV2LinksRequestBody): Promise<PostV2LinksResponse> {
    const link = await this.linkService.addLink(currentUser, body);
    return {
      link: this.serialiseLink(link),
    };
  }

  async search(
    currentUser: User,
    { tags, after, before, limit, offset }: GetV2LinksQueryParams,
  ): Promise<GetV2LinksResponse> {
    const { links, pagination } = await this.linkService.search(currentUser, {
      tags: tags ?? [],
      created: {
        min: after ? new Date(after) : undefined,
        max: before ? new Date(before) : undefined,
      },
      limit,
      offset,
    });

    return {
      links: links.map((link) => this.serialiseLink(link)),
      pagination,
    };
  }

  router() {
    const router = Router();

    router.get(
      '/',
      asyncRoute<unknown, GetV2LinksResponse, unknown, GetV2LinksQueryParams>(
        {
          query: Yup.object()
            .shape({
              tags: Yup.array().transform(arrayTransformer).of(Yup.string().required()).notRequired(),
              before: Yup.string().notRequired(),
              after: Yup.string().notRequired(),
              limit: Yup.number().notRequired(),
              offset: Yup.number().notRequired(),
            })
            .defined(),
        },
        (req) => this.search(req.user, req.query),
      ),
    );

    router.post(
      '/',
      asyncRoute<PostV2LinksRequestBody, PostV2LinksResponse, unknown, unknown>(
        {
          body: Yup.object()
            .shape({
              url: Yup.string().required(),
              tags: Yup.array().of(Yup.string().required()).required(),
              visibility: Yup.string().oneOf(['public', 'internal', 'private']).required(),
            })
            .defined(),
        },
        (req) => this.addLink(req.user, req.body),
      ),
    );

    router.get(
      '/:id',
      asyncRoute<unknown, GetV2LinkIdResponse, GetV2LinkIdPathParams, unknown>(
        {
          params: Yup.object()
            .shape({
              id: Yup.string().required(),
            })
            .defined(),
        },
        (req) => this.getLink(req.user, req.params),
      ),
    );

    return router;
  }
}
