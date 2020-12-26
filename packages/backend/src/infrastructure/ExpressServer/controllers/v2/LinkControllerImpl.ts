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
import ILogger, { Logger } from '../../../Logger/Logger';
import LoggerImpl from '../../../Logger/LoggerImpl';
import asyncRoute from '../../middleware/asyncRoute';
import LinkController from './LinkController';

@Service()
export default class LinkControllerImpl implements LinkController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => LinkServiceImpl) private readonly linkService: LinkService,
  ) {
    this.log = this.logger.child('LinkController');
  }

  private serialiseLink(link: Link): ApiLink {
    return {
      id: link.reference,
      url: link.url,
      tags: link.tags,
      created: link.created?.toISOString(),
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

  async search(currentUser: User, queryParams: GetV2LinksQueryParams): Promise<GetV2LinksResponse> {
    const links = await this.linkService.search(currentUser, {
      tags: queryParams.tags ?? [],
      created: {
        min: queryParams.after ? new Date(queryParams.after) : undefined,
        max: queryParams.before ? new Date(queryParams.before) : undefined,
      },
    });

    return {
      links: links.map((link) => this.serialiseLink(link)),
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
              tags: Yup.array()
                .transform((value: unknown, originalValue: unknown) => {
                  if (typeof originalValue === 'string') {
                    return [originalValue];
                  }
                  return originalValue;
                })
                .of(Yup.string().required())
                .notRequired(),
              before: Yup.string().notRequired(),
              after: Yup.string().notRequired(),
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
