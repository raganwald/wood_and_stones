class GameController < ApplicationController
  def create
    @black = (it = params[:black] and User.find_or_create_by_email(it))
    @white = (it = params[:white] and User.find_or_create_by_email(it))
    if (self.current_user and ((not (@black == self.current_user)) and (not (@white == self.current_user)))) then
      render(:status => 401)
    else
      Game.transaction do
        @game = Game.create(:black => (@black), :white => (@white), :dimension => (params[:dimension]), :handicap => (params[:handicap]))
        redirect_to(:action => :show, :id => (@game.id)) if @game.valid?
      end
    end
  end
  def show
    # do nothing
  end
  def new
    # do nothing
  end
end