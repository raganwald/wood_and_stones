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
  def given_game
    (it = params[:game_id] and @game = Game.find(it))
  end
  def assemble_info
    is_active = (it = self.current_user_id and (it == @game.user_to_play_id))
    (current_move = (__12641885538036__ = @game.actions.last and __12641885538036__.cardinality) or 0)
    playing = (id = self.current_user_id and (id == @game.black_id) ? ("black") : ("white" if (id == @game.white_id)))
    @info = { :active => (is_active), :move_number => (current_move), :playing => (playing) }
  end
  private
  def get_const_for(modularized_name)
    modularized_name.split("::").inject(Kernel) do |namespace, name|
      namespace.const_get(name)
    end
  end
end