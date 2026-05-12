'use strict';

/**
 * evplug-charging-stations service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::evplug-charging-station.evplug-charging-station');
