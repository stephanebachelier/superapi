var urlize = {
  paramsPattern: /:(\w+)/g,

  url: function(baseUrl, resource) {
    var url = baseUrl || "";

    // from time being it"s a simple map
    if (resource) {
      var path;

      if (typeof resource === "string") {
        path = resource;
      }

      if (typeof resource === "object" && resource.path !== undefined) {
        path = resource.path;
      }

      if (!path) {
        throw new Error("path is not defined");
      }

      if (path.match(/^https?:\/\//)) {
        url = path;
      }
      else {
        url += path[0] === "/" ? path : "/" + path;
      }
    }

    return url;
  },

  replaceUrl: function(url, params, pattern) {
    if (!url || !(url.match && (typeof url.match === "function"))) {
      return false;
    }
    var tokens = url.match(pattern || this.paramsPattern);

    if (!tokens || !tokens.length) {
      return url;
    }

    for (var i = 0, len = tokens.length; i < len; i += 1) {
      var token = tokens[i];
      var name = token.substring(1);
      if (params[name]) {
        url = url.replace(token, params[name]);
      }
    }
    return url;
  },

  buildUrlQuery: function(query) {
    if (!query) {
      return "";
    }

    var queryString;

    if (typeof query === "string") {
      queryString = query;
    } else {
      var queryArgs = [];
      for (var queryArg in query) {
        queryArgs.push(queryArg + "=" + query[queryArg]);
      }
      queryString = queryArgs.join("&");
    }

    if (!queryString.length) {
      return "";
    }

    return queryString.charAt(0) === "?" ? queryString : "?" + queryString;
  },

  urlize: function(opts) {
    if (!opts) {
      throw new Error("Invalid url parameters.");
    }

    var url = this.url(opts.baseUrl, opts.resource);

    if (opts.params) {
      var pattern = opts.paramsPattern || false;
      url = this.replaceUrl(url, opts.params, pattern);
    }

    if (opts.query) {
      url += this.buildUrlQuery(opts.query);
    }

    return url;
  }
};

export default urlize;
