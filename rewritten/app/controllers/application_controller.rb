class ApplicationController < ActionController::Base
  layout("iphone")
  include(Authenticatable::ControllerMethods)
  helper(:all)
  protect_from_forgery
  before_filter(:set_instance)
  def set_instance(name = self.class.name.demodulize.underscore[/^(.*)_controller$/, 1], model_class = (it = self.class.name[/^(.*)Controller$/, 1] and Kernel.const_get(it)))
    (it = (params["#{name}_id"] or params[:id]) and instance_variable_set(("@" + name), model_class.find(it)))
  end
end