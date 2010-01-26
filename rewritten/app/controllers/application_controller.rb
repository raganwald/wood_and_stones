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
    playing = (id = self.current_user_id and (id == @game.black_id) ? ("black") : ("white" if (id == @game.white_id)))
    @info = OpenStruct.new(:active => (is_active), :move_number => (current_move), :playing => (playing), :create_move_js => ("function (position) { return '#{create_move_url(:game_id => (@game.id), :position => "zzzzz")}'.replace('zzzzz', position);}"), :get_updates_js => ("function (current_move_number) { return '#{get_updates_url(:game_id => (@game.id), :after_move => "zzzzz", :layout => "false")}'.replace('zzzzz', current_move_number);}"), :get_history_js => ("function (current_move_number) { return '#{get_history_url(:game_id => (@game.id), :before_move => "zzzzz", :layout => "false")}'.replace('zzzzz', current_move_number);}"), :move_info_url => (move_info_url(:game_id => (@game.id))))
  end
  private
  def get_const_for(modularized_name)
    modularized_name.split("::").inject(Kernel) do |namespace, name|
      namespace.const_get(name)
    end
  end
end
