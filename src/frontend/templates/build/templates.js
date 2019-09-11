function createTemplates() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['greeting'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"headline\">\n    Welcome "
    + container.escapeExpression(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"username","hash":{},"data":data}) : helper)))
    + ".<br>Here are your tasks for today.\n</span>";
},"useData":true});
templates['tasklist'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"task-box\" data-completed=\""
    + alias4(((helper = (helper = helpers.completed || (depth0 != null ? depth0.completed : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"completed","hash":{},"data":data}) : helper)))
    + "\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n        <table>\n        <tr class=\"task-checkbox-col\">\n            <!--The checkbox to complete it for the day-->\n            <td>\n                <span class=\"daily-task-checkbox\">\n                    <input type=\"checkbox\">\n                    <span class=\"checkmark\"></span>\n                </span>\n            </td>\n        </tr>\n        \n        <!--Task description-->\n        <tr class=\"task-desc-col\">\n            <span class=\"task-description\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper)))
    + "</span>\n        </tr>\n\n        <!--Task size indicator-->\n        <tr class=\"task-size-col\">\n            <span class=\"task-size-container\" data-size=\""
    + alias4(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size","hash":{},"data":data}) : helper)))
    + "\">\n                <span class=\"size-circle-left\"></span>\n                <span class=\"size-circle-middle\"></span>\n                <span class=\"size-circle-large\"></span>\n            </span>\n        </tr>\n\n        <!--Task date-->\n        <tr class=\"task-date-col\">\n            <span class=\"task-date-container\">\n                "
    + alias4(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"date","hash":{},"data":data}) : helper)))
    + "\n            </span>\n        </tr>\n        </table>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
}

module.exports = createTemplates;