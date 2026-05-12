'use strict';

/**
 * evplug-services service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::evplug-service.evplug-service');
