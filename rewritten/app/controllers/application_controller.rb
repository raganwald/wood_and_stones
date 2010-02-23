require("ostruct")
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
    current_move = @game.current_move_number
    playing, opponent = nil, nil
    (id = self.current_user_id and if (id == @game.black_id) then
      playing, opponent = "black", "white"
    else
      playing, opponent = "white", "black" if (id == @game.white_id)
    end)
    @info = { :is_users_turn => (is_active), :move_number => (current_move), :playing => (playing), :opponent => (opponent), :to_play => (@game.to_play), :game_state => (@game.state) }
  end
  def all_tile_paths
    Rails.root.join("public", "images", "board", "temporary").entries.map(&:to_s).select do |e|
      e =~ /png$/
    end.map do |e|
      "/images/board/temporary/#{e}"
    end
  end
  private
  def get_const_for(modularized_name)
    modularized_name.split("::").inject(Kernel) do |namespace, name|
      namespace.const_get(name)
    end
  end
end
