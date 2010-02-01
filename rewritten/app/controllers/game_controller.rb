class GameController < ApplicationController
  before_filter(:assemble_info, :only => :show)
  def create
    @black = (it = params[:black] and User.find_or_create_by_email(it))
    @white = (it = params[:white] and User.find_or_create_by_email(it))
    if (self.current_user and ((not (@black == self.current_user)) and (not (@white == self.current_user)))) then
      render(:status => 401)
    else
      Game.transaction do
        @game = Game.new(:black => (@black), :white => (@white), :dimension => (params[:dimension]), :handicap => (params[:handicap]))
        if @game.save then
          respond_to do |format|
            format.html { redirect_to(:action => :show, :id => (@game.id)) }
          end
        else
          respond_to do |format|
            format.js do
              render(:text => (@game.errors.full_messages.to_sentence), :status => 403)
            end
          end
        end
      end
    end
  end
  def show
    # do nothing
  end
  def new
    # do nothing
  end
  def valid_moves
    # do nothing
  end
end