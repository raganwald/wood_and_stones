class ApplicationController < ActionController::Base
  layout("iphone")
  include(Authenticatable::ControllerMethods)
  helper(:all)
  protect_from_forgery
  before_filter(:set_instance)
  def set_instance(name = self.class.name.demodulize.underscore[/^(.*)_controller$/, 1])
    (it = (params["#{name}_id"] or params[:id]) and set_instance_variable(name, it))
  end
end