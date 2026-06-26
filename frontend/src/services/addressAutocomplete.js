import axios from 'axios';

const ADDRESS_API_URL = 'https://data.geopf.fr/geocodage/search/';

/**
 * Search addresses
 * @param {string} query - Search text
 * @param {number} limit - Max results (default: 5)
 * @param {'municipality' | 'housenumber'} type - Search type (cities or addresses)
 * @returns {Promise<Array>} Address suggestions
 */
const searchAddresses = async (query, limit = 5, type = 'municipality') => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    // Search via API for cities and postal codes
    const apiParams = {
      q: query,
      limit: Math.max(1, limit),
      timeout: 5000,
    };

    // If postal code (digits only), search without type restriction
    if (/^\d+$/.test(query)) {
      delete apiParams.type;
    } else {
      apiParams.type = type;
    }

    const response = await axios.get(ADDRESS_API_URL, { params: apiParams });

    const apiResults = response.data?.features
      ? response.data.features.map((feature) => ({
          value: feature.properties.label,
          label: feature.properties.label,
          city: feature.properties.city,
          postcode: feature.properties.postcode,
          context: feature.properties.context,
          coordinates: feature.geometry.coordinates,
          type: feature.properties.type,
        }))
      : [];

    // Track API usage
    if (typeof window !== 'undefined' && window._paq && window.__MATOMO__) {
      window._paq.push([
        'trackEvent',
        'AddressAutocomplete',
        'APICall',
        apiResults.length.toString(),
      ]);
    }

    const uniqueResults = apiResults.filter(
      (result, index, self) =>
        index === self.findIndex((r) => r.label === result.label),
    );

    return uniqueResults.slice(0, limit);
  } catch (error) {
    console.error('Error searching addresses:', error);

    // Track API errors
    if (typeof window !== 'undefined' && window._paq && window.__MATOMO__) {
      window._paq.push([
        'trackEvent',
        'AddressAutocomplete',
        'Error',
        'api_error',
      ]);
    }
    return [];
  }
};

export default { searchAddresses };
