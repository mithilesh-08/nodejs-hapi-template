import { Op } from 'sequelize';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import server from '@config/server';
import { models } from '@models';
import { TIMESTAMP, ACCESS_DENIED } from '@utils/constants';
import { strippedUUID } from '@utils';
import { unauthorized } from '@utils/responseInterceptors';
import { getMetaDataByOAuthClientId } from '@daos/oauthClientsDao';
import { convertDbResponseToRawResponse } from '@utils/transformerUtils';

const ttl = server.app.options.oauth.access_token_ttl;
const BEARER = 'Bearer';

export const createAccessToken = async (
  oauthClientId,
  timeToLive = ttl,
  userId = null,
) => {
  try {
    const metadata = await getMetaDataByOAuthClientId(oauthClientId).catch(
      (error) => {
        console.error('Error getting OAuth client metadata:', error);
        return { scope: {}, resources: [] };
      },
    );

    if (isEmpty(metadata)) {
      throw unauthorized(ACCESS_DENIED);
    }

    // Add userId to metadata if provided
    const metadataWithUserId = userId ? { ...metadata, userId } : metadata;

    return models.oauthAccessTokens
      .create({
        accessToken: strippedUUID(),
        oauthClientId,
        expiresIn: timeToLive,
        expiresOn: moment().add(timeToLive, 'seconds').format(TIMESTAMP),
        tokenType: BEARER,
        metadata: JSON.stringify(metadataWithUserId),
        createdAt: moment(),
      })
      .then((accessToken) => convertDbResponseToRawResponse(accessToken));
  } catch (error) {
    console.error('Error creating access token:', error);
    throw error;
  }
};

/**
 * Find access token
 * @date 2020-03-21
 * @param {any} accessToken
 * @returns {any}
 */
export const findAccessToken = (accessToken) =>
  models.oauthAccessTokens
    .findOne({
      attributes: [
        'accessToken',
        'metadata',
        'expiresIn',
        'expiresOn',
        'oauthClientId',
      ],
      where: {
        accessToken,
        expiresOn: {
          [Op.gt]: moment().format(TIMESTAMP),
        },
      },
      include: [
        {
          model: models.oauthClients,
          as: 'oauthClient',
          include: [
            {
              model: models.oauthClientResources,
              as: 'oauthClientResources',
            },
            {
              model: models.oauthClientScopes,
              as: 'oauthClientScope',
            },
          ],
        },
      ],
      underscoredAll: false,
    })
    .then((token) => {
      if (token) {
        const convertedToken = convertDbResponseToRawResponse(token);
        // Parse metadata JSON if it exists and is a string
        // if (
        //   convertedToken.metadata &&
        //   typeof convertedToken.metadata === 'string'
        // ) {
        //   try {
        //     const parsedMetadata = JSON.parse(convertedToken.metadata);
        //     convertedToken.metadata = parsedMetadata;

        //     // Also add userId directly to credentials for easy access
        //     if (parsedMetadata.userId) {
        //       convertedToken.userId = parsedMetadata.userId;
        //     }
        //   } catch (error) {
        //     console.error('Error parsing token metadata:', error);
        //   }
        // }

        return convertedToken;
      }
      return token;
    });

export const updateAccessToken = (accessToken, timeToLive) =>
  models.oauthAccessTokens.update(
    {
      accessToken,
      expiresIn: ttl,
      expiresOn: moment().add(timeToLive, 'seconds').format(TIMESTAMP),
    },
    {
      where: {
        accessToken,
      },
      underscoredAll: false,
    },
  );
