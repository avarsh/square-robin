function createTemplates() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['subtasks'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"subtask-box\" data-completed=\""
    + alias4(((helper = (helper = helpers.completed || (depth0 != null ? depth0.completed : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"completed","hash":{},"data":data,"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":58}}}) : helper)))
    + "\" data-id=\""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":2,"column":69},"end":{"line":2,"column":79}}}) : helper)))
    + "\">\n        <table>\n            <tr>\n                <td class=\"task-checkbox-col\">\n                    <div class=\"checkbox-container\">\n                    </div>\n                </td>\n\n                <td class=\"task-desc-col\">\n                    <div class=\"task-description\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":11,"column":50},"end":{"line":11,"column":65}}}) : helper)))
    + "</div>\n                </td>\n            </tr>\n        </table>\n    </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.subtasks : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":16,"column":9}}})) != null ? stack1 : "")
    + "\n<div class=\"subtask-add\">\n    <table>\n        <tr>\n            <td class=\"subtask-add-col\">\n                <div class=\"subtask-add-button\"></div>\n            </td>\n\n            <td class=\"task-input\">\n                <input type=\"text\" placeholder=\"Add a task\">\n            </td>\n        </tr>\n    </table>\n</div>\n";
},"useData":true});
templates['tasklist'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"task-box\" data-completed=\""
    + alias4(((helper = (helper = helpers.completed || (depth0 != null ? depth0.completed : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"completed","hash":{},"data":data,"loc":{"start":{"line":2,"column":42},"end":{"line":2,"column":55}}}) : helper)))
    + "\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":2,"column":66},"end":{"line":2,"column":72}}}) : helper)))
    + "\" data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data,"loc":{"start":{"line":2,"column":87},"end":{"line":2,"column":97}}}) : helper)))
    + "\">\n        <table>\n            <tr>\n                <!--The checkbox to complete it for the day-->\n                <td class=\"task-checkbox-col\">\n                    <div class=\"checkbox-container\">\n                    </div>\n                </td>\n                \n                <!--Task description-->\n                <td class=\"task-desc-col\">\n                    <divs class=\"task-description\">"
    + alias4(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":13,"column":51},"end":{"line":13,"column":66}}}) : helper)))
    + "</div>\n                </td>\n\n                <!--Task size indicator-->\n                <td class=\"task-size-col\">\n                    <div class=\"task-size-container\" data-size=\""
    + alias4(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"size","hash":{},"data":data,"loc":{"start":{"line":18,"column":64},"end":{"line":18,"column":72}}}) : helper)))
    + "\">\n                        <div class=\"size-circle-left\"></div>\n                        <div class=\"size-circle-middle\"></div>\n                        <div class=\"size-circle-large\"></div>\n                    </div>\n                </td>\n\n                <!--Task date-->\n                <td class=\"task-date-col\">\n                    <div class=\"task-date-container\">\n                        "
    + alias4(((helper = (helper = helpers["date-formatted"] || (depth0 != null ? depth0["date-formatted"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"date-formatted","hash":{},"data":data,"loc":{"start":{"line":28,"column":24},"end":{"line":28,"column":42}}}) : helper)))
    + "\n                    </div>\n                </td>\n            </tr>\n        </table>\n\n        <div class=\"subtask-container\">\n"
    + ((stack1 = container.invokePartial(partials.subtasks,depth0,{"name":"subtasks","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "        </div>\n    </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":38,"column":9}}})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
}

module.exports = createTemplates;