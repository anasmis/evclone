'use strict';

/**
 * parking-request service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::parking-request.parking-request');
