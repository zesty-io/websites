/**
 * Zesty.io Rest API Fetch Wrapper
 * Used to simply remote authenticated requests to the Zesty Auth, Accounts, and Instances API
 * 
 * More info at https://github.com/zesty-io/websites/fetch-api-wrapper/
 */
const instanceAPIEndpoints = {
    models: "/content/models",
    fields: "/content/models/MODEL_ZUID/fields",
    itemsPublishing: "/content/models/MODEL_ZUID/items/ITEM_ZUID/publishings",
    itemsVersions: "/content/models/MODEL_ZUID/items/ITEM_ZUID/versions",
    items: "/content/models/MODEL_ZUID/items",
    views: "/web/views", // ?action=publish&purge_cache=true
    settings: "/env/settings",
    stylesheets: "/web/stylesheets", // ?action=publish&purge_cache=true
    stylesheetsVersions: "/web/stylesheets/STYLESHEET_ZUID/versions",
    scriptsVersions: "/web/scripts/SCRIPT_ZUID/versions/VERSION_NUMBER",
    scripts: "/web/scripts", // publish by adding: ?action=publish&purge_cache=true",
    headers: "/web/headers",
    nav: "/env/nav",
    headtags: "/web/headtags",
    audits: "/env/audits"
}

class ZestyioRestFetchWrapper {
    constructor(instanceZUID, authToken, options={}) {
        this.instanceZUID = instanceZUID;
        this.authToken = authToken;
        this.instancesAPIEndpoints = instanceAPIEndpoints;
       
          this.accountsAPIEndpoints = {
            instanceGET: "/instances/INSTANCE_ZUID",
            instanceUsersGET: "/instances/INSTANCE_ZUID/users/roles",
            userGET: "/users/USER_ZUID",
            instances: "/instances",
          };
      
          this.sitesServiceEndpoints = {
            schedulePublishPOST: "/content/items/ITEM_ZUID/publish-schedule",
            scheduleUnpublishPATCH:
              "/content/items/ITEM_ZUID/publish-schedule/PUBLISHING_ZUID",
            itemsDELETE: "/content/sets/MODEL_ZUID/items/ITEM_ZUID"
          };
      
          this.mediaAPIEndpoints = {
            binsGETAll: "/media-manager-service/site/SITE_ID/bins",
            binsGET: "/media-manager-service/bin/BIN_ID",
            binsPATCH: "/media-manager-service/bin/BIN_ID",
            filesPOST: "/media-storage-service/upload/STORAGE_DRIVER/STORAGE_NAME",
            filesGET: "/media-manager-service/file/FILE_ID",
            filesGETAll: "/media-manager-service/bin/BIN_ID/files",
            filesPATCH: "/media-manager-service/file/FILE_ID",
            filesDELETE: "/media-manager-service/file/FILE_ID",
            groupsGET: "/media-manager-service/group/GROUP_ID",
            groupsGETAll: "/media-manager-service/bin/BIN_ID/groups",
            groupsPOST: "/media-manager-service/group",
            groupsPATCH: "/media-manager-service/group/GROUP_ID",
            groupsDELETE: "/media-manager-service/group/GROUP_ID"
          };
      
          this.instancesAPIURL = options.hasOwnProperty("instancesAPIURL")
            ? options.instancesAPIURL
            : "https://INSTANCE_ZUID.api.zesty.io/v1";
          this.accountsAPIURL = options.hasOwnProperty("accountsAPIURL")
            ? options.accountsAPIURL
            : "https://accounts.api.zesty.io/v1";
          this.mediaAPIURL = options.hasOwnProperty("mediaAPIURL")
            ? options.mediaAPIURL
            : "https://svc.zesty.io";
          this.sitesServiceURL = options.hasOwnProperty("sitesServiceURL")
            ? options.sitesServiceURL
            : "https://svc.zesty.io/sites-service/INSTANCE_ZUID";
          this.logErrors = options.hasOwnProperty("logErrors")
            ? options.logErrors
            : false;
          this.logResponses = options.hasOwnProperty("logResponses")
            ? options.logResponses
            : false;
      
         
         
          this.instancesAPIURL = this.makeInstanceZUIDURL(
            this.instancesAPIURL,
            instanceZUID
          );
          this.sitesServiceURL = this.makeInstanceZUIDURL(
            this.sitesServiceURL,
            instanceZUID
          );
    }
    makeInstanceZUIDURL(url, zuid) {
      return this.replaceInURL(url, { INSTANCE_ZUID: zuid });
    }

    buildAPIURL(uri, api = "instances") {
      switch (api) {
        case "accounts":
          return `${this.accountsAPIURL}${uri}`;
        case "instances":
          return `${this.instancesAPIURL}${uri}`;
        case "sites-service":
          return `${this.sitesServiceURL}${uri}`;
        case "media":
          return `${this.mediaAPIURL}${uri}`;
        default:
          return "";
      }
    }

    replaceInURL(url, replacementObject) {
      for (const key in replacementObject) {
        url = url.replace(key, replacementObject[key]);
      }

      return url;
    }

    async makeRequest(url, method='GET', body='', options={}){
      
      if(method != 'GET') options.body = body

      options.method = method
      options.headers = {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${this.authToken}`
      }
      options.credentials = 'same-origin'

      try {
        const res = await fetch(url,options)
        const json = await res.json()
        return json
      } catch (err) {
        console.error('Error:', err);
        return err
      }
      
      
    }
     async getInstances( ){
      let url = this.accountsAPIURL + accountsAPIEndpoints.instances
      return await this.makeRequest(url)
    }
   
    async getModels( ){
      let url = this.instancesAPIURL + instanceAPIEndpoints.models
      return await this.makeRequest(url)
    }

    async getViews( ){
      let url = this.instancesAPIURL + instanceAPIEndpoints.views
      return await this.makeRequest(url)
    }

    async createView(fileName,code='',type="snippet"){
      let payload = JSON.stringify({
        "code": code,
        "fileName": fileName,
        "type": type
      });
      let url = this.instancesAPIURL + instanceAPIEndpoints.views
      return await this.makeRequest(url,'POST',payload)
    }

    async updateView(viewZUID,code){
      let payload = JSON.stringify({
        "code": code
      });
      let url = this.instancesAPIURL + instanceAPIEndpoints.views + '/' + viewZUID
      return await this.makeRequest(url,'PUT',payload)
    }

}