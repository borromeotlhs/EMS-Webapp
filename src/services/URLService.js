'use strict';

angular.module('mms')
.provider('URLService', function URLServiceProvider() {
    var baseUrl = '/alfresco/service';
    
    this.setBaseUrl = function(base) {
        baseUrl = base;
    };
    
    this.$get = [function URLServiceFactory() {
        return urlService(baseUrl);
    }];
});

/**
 * @ngdoc service
 * @name mms.URLService
 * 
 * @description
 * This utility service gives back url paths for use in other services in communicating
 * with the server, arguments like workspace, version are expected to be strings and
 * not null or undefined. This service is usually called by higher level services and
 * should rarely be used directly by applications.
 *
 * To configure the base url of the ems server, you can use the URLServiceProvider
 * in your application module's config. By default, the baseUrl is '/alfresco/service' 
 * which assumes your application is hosted on the same machine as the ems. 
 *  <pre>
        angular.module('myApp', ['mms'])
        .config(function(URLServiceProvider) {
            URLServiceProvider.setBaseUrl('https://ems.jpl.nasa.gov/alfresco/service');
        });
    </pre>
 * (You may run into problems like cross origin security policy that prevents it from
 *  actually getting the resources from a different server, solution TBD)
 */
function urlService(baseUrl) {
    var root = baseUrl;
    var ticket;
    /**
     * @ngdoc method
     * @name mms.URLService#isTimestamp
     * @methodOf mms.URLService
     * 
     * @description
     * self explanatory
     *
     * @param {string} version A version string or timestamp
     * @returns {boolean} Returns true if the string has '-' in it
     */
    var isTimestamp = function(version) {
        if(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[+]?-\d{4}$/.test(version.trim()))
            return true;
        return false;
        
        // if (String(version).indexOf('-') >= 0)
        //     return true;
        // return false;
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getMmsVersionURL
     * @methodOf mms.URLService
     * 
     * @description
     * self explanatory
     *
     * @returns {object} Returns object with mmsversion
     */
    var getMmsVersionURL = function() {
        return addTicket(root + "/mmsversion");
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getConfigSnapshotsURL
     * @methodOf mms.URLService
     *
     * @description
     * Gets url that gets or posts snapshots for a configuration in a site
     *
     * @param {string} id Id of the configuration
     * @param {string} workspace Workspace name
     * @returns {string} The url
     */
    var getConfigSnapshotsURL = function(id, workspace) {
        return root + "/workspaces/" + workspace +
                      "/configurations/" + id +
                      "/snapshots";                
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getProductSnapshotsURL
     * @methodOf mms.URLService
     *
     * @description
     * Gets url that gets or creates snapshots for a product in a site
     *
     * @param {string} id Id of the product
     * @param {string} site Site name
     * @param {string} workspace Workspace name
     * @returns {string} The url
     */
    var getProductSnapshotsURL = function(id, site, workspace) {
        return addTicket(root + "/workspaces/" + workspace +
                      "/sites/" + site +
                      "/products/" + id +
                      "/snapshots");                
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getHtmlToPdfURL
     * @methodOf mms.URLService
     *
     * @description
     * Gets url that to convert HTML to PDF
     *
     * @param {string} docId Id of the document
     * @param {string} site Site name
     * @param {string} workspace Workspace name
     * @returns {string} The url
     */
    var getHtmlToPdfURL = function(docId, site, workspace) {
        return addTicket(root + "/workspaces/" + workspace +
                      "/sites/" + site +
                      "/documents/" + docId +
                      "/htmlToPdf/123456789");  
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getCheckLoginURL
     * @methodOf mms.URLService
     *
     * @description
     * Gets url that checks the login
     *
     * @returns {string} The url
     */
    var getCheckLoginURL = function() {
        return root + "/checklogin";
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getSiteConfigsURL
     * @methodOf mms.URLService
     *
     * @description
     * Gets url that gets or creates configurations in a site
     *
     * @param {string} workspace Workspace name
     * @returns {string} The url
     */
    var getConfigsURL = function(workspace) {
        return addTicket(root + "/workspaces/" + workspace +
                      "/configurations");
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getConfigProductsURL
     * @methodOf mms.URLService
     *
     * @description
     * Gets url that gets or posts products in a configuration
     *
     * @param {string} id Id of the configuration
     * @param {string} site Site name
     * @param {string} workspace Workspace name
     * @returns {string} The url
     */
    var getConfigProductsURL = function (id, site, workspace) {
        return root + "/workspaces/" + workspace +
                      "/sites/" + site +
                      "/configurations/" + id +
                      "/products";                        
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getConfigURL
     * @methodOf mms.URLService
     *
     * @description
     * Gets url that gets a configuration
     *
     * @param {string} id Id of the configuration
     * @param {string} workspace Workspace name
     * @returns {string} The url
     */
    var getConfigURL = function(id, workspace) {
        return addTicket(root + "/workspaces/" + workspace + 
                      "/configurations/" + id);
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getSnapshotURL
     * @methodOf mms.URLService
     *
     * @description
     * Gets url that gets a snapshot
     *
     * @param {string} id Id of the snapshot
     * @param {string} workspace Workspace name
     * @returns {string} The url
     */
    var getSnapshotURL = function(id, workspace) {
        return addTicket(root + "/workspaces/" + workspace + 
                      "/snapshots/" + id);
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getConfigProductsURL
     * @methodOf mms.URLService
     *
     * @description
     * Gets url that gets products in a site
     *
     * @param {string} site Site name
     * @param {string} workspace Workspace name
     * @param {string} version timestamp
     * @returns {string} The url
     */
    var getSiteProductsURL = function(site, workspace, version, extended) {
        var r = root + "/workspaces/" + workspace + 
                      "/sites/" + site + 
                      "/products";
        return addExtended(addTicket(addVersion(r, version)), extended);
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getImageURL
     * @methodOf mms.URLService
     * 
     * @description
     * Gets the url for querying an image url 
     * (this is not the actual image path)
     * 
     * @param {string} id The id of the image
     * @param {string} workspace Workspace name
     * @param {string} version Timestamp or version number
     * @returns {string} The path for image url queries.
     */
    var getImageURL = function(id, ext, workspace, version) {
        var r = root + '/workspaces/' + workspace + '/artifacts/' + id + '?extension=' + ext;
        return addTicket(addVersion(r, version));
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getSiteDashboardURL
     * @methodOf mms.URLService
     * 
     * @description
     * Gets the path for a site dashboard.
     * 
     * @param {string} site Site name (not title!).
     * @returns {string} The path for site dashboard.
     */
    var getSiteDashboardURL = function(site) {
        return addTicket("/share/page/site/" + site + "/dashboard");
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getElementURL
     * @methodOf mms.URLService
     * 
     * @description
     * Gets the path for an element
     * 
     * @param {string} id The element id.
     * @param {string} workspace Workspace name
     * @param {string} version Timestamp or version number
     * @returns {string} The url.
     */
    var getElementURL = function(id, workspace, version, extended) {        
        var r = root + '/workspaces/' + workspace + '/elements/' + id;
        return addExtended(addTicket(addVersion(r, version)), extended);
    };

    var getOwnedElementURL = function(id, workspace, version, depth, extended) {
        var recurseString = 'recurse=true';
        if (depth && depth > 0)
            recurseString = 'depth=' + depth;
        var r = root + '/workspaces/' + workspace + '/elements/' + id;
        r = addVersion(r, version);
        if (r.indexOf('?') > 0)
            r += '&' + recurseString;
        else
            r += '?' + recurseString;
        return addExtended(r, extended);        
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getDocumentViewsURL
     * @methodOf mms.URLService
     * 
     * @description
     * Gets the url to get all views in a document
     * 
     * @param {string} id The document id.
     * @param {string} workspace Workspace name
     * @param {string} version Timestamp or version number
     * @param {boolean} simple Whether to get simple views (without specialization, for performance reasons)
     * @returns {string} The url.
     */
    var getDocumentViewsURL = function(id, workspace, version, simple, extended) {
        //var r = root + "/javawebscripts/products/" + id + "/views";
        var r = root + "/workspaces/" + workspace + "/products/" + id + "/views";
        r = addVersion(r, version);
        if (simple) {
            if (r.indexOf('?') > 0)
                r += '&simple=true';
            else
                r += '?simple=true';
        }
        return addExtended(addTicket(r), extended);
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getViewElementsURL
     * @methodOf mms.URLService
     * 
     * @description
     * Gets the url to get all elements referenced in a view
     * 
     * @param {string} id The view id.
     * @param {string} workspace Workspace name
     * @param {string} version Timestamp or version number
     * @returns {string} The url.
     */
    var getViewElementsURL = function(id, workspace, version, extended) {
        //var r = root + "/javawebscripts/views/" + id + "/elements";
        var r = root + "/workspaces/" + workspace + "/views/" + id + "/elements";
        return addExtended(addTicket(addVersion(r, version)), extended);
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getElementVersionsURL
     * @methodOf mms.URLService
     * 
     * @description
     * Gets the url to query for element history
     * 
     * @param {string} id The element id.
     * @param {string} workspace Workspace name
     * @returns {string} The url.
     */
    var getElementVersionsURL = function(id, workspace) {
        return addTicket(root + '/workspaces/' + workspace + '/history/' + id);
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getPostElementsURL
     * @methodOf mms.URLService
     * 
     * @description
     * Gets the path for posting element changes.
     * 
     * @param {string} workspace Workspace name
     * @returns {string} The post elements url.
     */
    var getPostElementsURL = function(workspace) {
        return addTicket(root + '/workspaces/' + workspace + '/elements');
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getPutElementsURL
     * @methodOf mms.URLService
     * 
     * @description
     * Gets the path for getting multiple elements (using put with body).
     * 
     * @param {string} workspace Workspace name
     * @param {string} version timestamp
     * @returns {string} The post elements url.
     */
    var getPutElementsURL = function(workspace, version, extended) {
        var r = root + '/workspaces/' + workspace + '/elements';
        return addExtended(addTicket(addVersion(r, version)), extended);
    };

    var getPostElementsWithSiteURL = function(workspace, site) {
        if (root && workspace && site) {
            // TODO maybe move this check elsewhere to keep this method simple
            if (site === 'no-site') {
                site = 'no_site';
            }
            return addTicket(root + '/workspaces/' + workspace + '/sites/' + site + '/elements');
        }
    };

    /**
     * @ngdoc method
     * @name mms.URLService#handleHttpStatus
     * @methodOf mms.URLService
     * 
     * @description
     * Utility for setting the state of a deferred object based on the status
     * of http error. The arguments are the same as angular's $http error 
     * callback
     * 
     * @param {Object} data The http response
     * @param {number} status Http return status
     * @param {Object} header Http return header
     * @param {Object} config Http config
     * @param {Object} deferred A deferred object that would be rejected 
     *      with this object based on the http status: 
     *      ```
     *          {
     *              status: status,
     *              message: http status message,
     *              data: data
     *          }
     *      ```
     */
    var handleHttpStatus = function(data, status, header, config, deferred) {
        var result = {status: status, data: data};
        if (status === 404)
            result.message = "Not Found";
        else if (status === 500) {
            if (angular.isString(data) && data.indexOf("ENOTFOUND") >= 0)
                result.message = "Network Error (Please check network)";
            else
                result.message = "Server Error";
        } else if (status === 401 || status === 403)
            result.message = "Permission Error";
        else if (status === 409)
            result.message = "Conflict";
        else if (status === 400)
            result.message = "Bad Request";
        else if (status === 410)
            result.message = "Deleted";
        else if (status === 408)
            result.message = "Timed Out";
        else
            result.message = "Timed Out (Please check network)";
        deferred.reject(result);
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getSitesURL
     * @methodOf mms.URLService
     * 
     * @description
     * Gets the url to query sites.
     * 
     * @param {string} workspace the workspace
     * @param {string} version timestamp
     * @returns {string} The url.
     */
    var getSitesURL = function(workspace, version) {
        var r = root + '/workspaces/' + workspace + '/sites';
        return addTicket(addVersion(r, version));
    };

    /**
     * @ngdoc method
     * @name mms.URLService#getElementSearchURL
     * @methodOf mms.URLService
     * 
     * @description
     * Gets the url for element keyword search.
     * 
     * @param {string} query Keyword query
     * @param {Array.<string>} filters if not null, put in filters
     * @param {string} propertyName if not null put in propertyName
     * @param {integer} page page to get
     * @param {integer} items items per page
     * @param {string} workspace Workspace name to search under
     * @returns {string} The post elements url.
     */
    var getElementSearchURL = function(query, filters, propertyName, page, items, workspace, extended) {
        var r = root + '/workspaces/' + workspace + '/search?keyword=' + query;
        if (filters) {
            var l = filters.join();
            r += '&filters=' + l;
        }
        if (propertyName) {
            r += '&propertyName=' + propertyName;
        }
        if (items && items > 0) {
            r += "&maxItems=" + items;
            if (page >= 0)
                r += '&skipCount=' + page;
        }
        return addExtended(addTicket(r), true);
    };

    var getWorkspacesURL = function() {
        return addTicket(root + '/workspaces');
    };

    var getWorkspaceURL = function(ws) {
        return addTicket(root + '/workspaces/' + ws);
    };

    var getWsDiffURL = function(ws1, ws2, ws1time, ws2time, recalc) {
        var diffUrl =  root + '/diff/' + ws1 + '/' + ws2 + '/' + ws1time + '/' + ws2time  + '?background=true';
        if(recalc === true) diffUrl += '&recalculate=true';
        
        return addTicket(diffUrl);
        /*if (ws1time && ws1time !== 'latest')
            r += '&timestamp1=' + ws1time;
        if (ws2time && ws2time !== 'latest')
            r += '&timestamp2=' + ws2time;
        return r;*/
    };

    var getPostWsDiffURL = function(sourcetime) {
        var r = root + '/diff';
        if (sourcetime && isTimestamp(sourcetime))
            r += '?timestamp2=' + sourcetime;
        return addTicket(r);
    };
    
    var getJobs = function(id) {
        return addTicket(root + '/workspaces/master/jobs/' + id + '?recurse=1');
    };
    var getJob = function(jobSyml){
        return addTicket(root + '/workspaces/master/jobs/' + jobSyml);
    };
    var getJenkinsRun = function(jobSyml) {
        return addTicket(root + '/workspaces/master/jobs/'+ jobSyml + '/execute');
    };
    
    var getCreateJob = function() {
        var link = '/alfresco/service/workspaces/master/jobs';
        return addTicket(root + '/workspaces/master/jobs');
    };

    var getLogoutURL = function() {
        return addTicket(root + '/api/login/ticket/' + ticket);
    };
    
    var getCheckTicketURL = function(t) {
        return root + '/mms/login/ticket/' + t;//+ '?alf_ticket=' + t; //TODO remove when server returns 404
    };
    
    var addVersion = function(url, version) {
        if (version === 'latest')
            return url;
        if (isTimestamp(version)) {
            if (url.indexOf('?') > 0)
                return url + '&timestamp=' + version;
            else
                return url + '?timestamp=' + version;
        } else
            return url + '/versions/' + version;
    };
    var addTicket = function(url) {
        var r = url;
        if (!ticket)
            return r;
        if (r.indexOf('timestamp') > 0)
            return r;
        if (r.indexOf('?') > 0)
            r += '&alf_ticket=' + ticket;
        else
            r += '?alf_ticket=' + ticket;
        return r;    
    };
    var addExtended = function(url, extended) {
        var r = url;
        if (!extended)
            return r;
        if (r.indexOf('?') > 0)
            r += '&extended=true';
        else
            r += '?extended=true';
        return r;
    };

    var getRoot = function() {
        return root;
    };

    var setTicket = function(t) {
        ticket = t;
    };
    
    var getJMSHostname = function(){
        return root + '/connection/jms';
    };
    return {
        getMmsVersionURL: getMmsVersionURL,
        getSiteDashboardURL: getSiteDashboardURL,
        getElementURL: getElementURL,
        getOwnedElementURL: getOwnedElementURL,
        getElementVersionsURL: getElementVersionsURL,
        getPostElementsURL: getPostElementsURL,
        getPostElementsWithSiteURL: getPostElementsWithSiteURL,
        handleHttpStatus: handleHttpStatus,
        getSitesURL: getSitesURL,
        getElementSearchURL: getElementSearchURL,
        getImageURL: getImageURL,
        getProductSnapshotsURL: getProductSnapshotsURL,
        getHtmlToPdfURL: getHtmlToPdfURL,
        getConfigSnapshotsURL: getConfigSnapshotsURL,
        getSiteProductsURL: getSiteProductsURL,
        getConfigURL: getConfigURL,
        getSnapshotURL: getSnapshotURL,
        getConfigsURL: getConfigsURL,
        getConfigProductsURL : getConfigProductsURL,
        getDocumentViewsURL: getDocumentViewsURL,
        getViewElementsURL: getViewElementsURL,
        getWsDiffURL: getWsDiffURL,
        getPostWsDiffURL: getPostWsDiffURL,
        getJobs: getJobs,
        getJob: getJob,
        getJenkinsRun: getJenkinsRun,
        getCreateJob: getCreateJob,
        getPutElementsURL: getPutElementsURL,
        getWorkspacesURL: getWorkspacesURL,
        getWorkspaceURL: getWorkspaceURL,
        getCheckLoginURL: getCheckLoginURL,
        getCheckTicketURL: getCheckTicketURL,
        getLogoutURL: getLogoutURL,
        isTimestamp: isTimestamp,
        getRoot: getRoot,
        setTicket: setTicket,
        getJMSHostname: getJMSHostname
    };

}