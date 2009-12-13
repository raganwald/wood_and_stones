class Action::MoveController < ApplicationController
  before_filter(:get_game)
  before_filter(:check_authorization, :only => :create)
  def create
    @move = Action::Move.create(:game => (@game), :position => (params[:position]))
    render(:status => 403) unless @move.valid?
  end
  private
  def get_game
    ((game = (it = params[:game_id] and Game.find(it)) and (@game = game
    @colour_to_play = game.to_play
    @user_to_play = game.send(game.to_play))) or (render(:status => 404)
    return false))
  end
  def check_authorization
    unless (self.current_user == @user_to_play) then
      render(:status => 401)
      return false
    end
    true
  end
end