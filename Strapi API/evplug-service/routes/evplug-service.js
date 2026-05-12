'use strict';

/**
 * evplug-services router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::evplug-service.evplug-service');
