class ApplicationController < ActionController::Base
  layout("iphone")
  include(Authenticatable::ControllerMethods)
  helper(:all)
  protect_from_forgery
  before_filter(:set_instance)
  def set_instance(name = self.class.name.demodulize.underscore[/^(.*)_controller$/, 1], model_class = (it = self.class.name[/^(.*)Controller$/, 1] and get_const_for(it)))
    (it = (params["#{name}_id"] or params[:id]) and instance_variable_set(("@" + name), model_class.find(it)))
  end
  protected
  def assemble_info
    is_active = (@game.user_to_play == self.current_user)
    (current_move = (__126412615159457__ = @game.actions.last and __126412615159457__.cardinality) or 0)
    if self.current_user then
      playing = if (self.current_user == @game.black) then
        "black"
      else
        "white" if (self.current_user == @game.white)
      end
      email = self.current_user.email
    else
      playing = email = nil
    end
    @info = { :active => (is_active), :move_number => (current_move), :playing => (playing), :email => (email) }
  end
  private
  def get_const_for(modularized_name)
    modularized_name.split("::").inject(Kernel) do |namespace, name|
      namespace.const_get(name)
    end
  end
end