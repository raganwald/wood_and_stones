class Action::BaseController < ApplicationController
  before_filter(:get_game)
  def get_game
    ((game = (it = params[:game_id] and Game.find(it)) and (@game = game
    @colour_to_play = game.to_play
    @user_to_play = game.send(game.to_play))) or (render(:status => 404)
    return false))
  end
end