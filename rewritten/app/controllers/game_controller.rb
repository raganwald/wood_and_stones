class GameController < ApplicationController
  before_filter(:assemble_info, :only => :show)
  def create
    @black = (it = params[:black] and User.find_or_create_by_email(it))
    @white = (it = params[:white] and User.find_or_create_by_email(it))
    if (self.current_user and ((not (@black == self.current_user)) and (not (@white == self.current_user)))) then
      render(:status => 401)
    else
      Game.transaction do
        @game = Game.new(:black => (@black), :white => (@white), :dimension => (params[:dimension].to_i), :handicap => (params[:handicap].to_i))
        if @game.save then
          secret = Secret.first(:conditions => ({ :target_type => (@game.class.name), :target_id => (@game.id), :user_id => (self.current_user_id) }))
          respond_to do |format|
            format.json do
              render(:json => (if secret.present? then
                { :url => (show_game_url(:secret => (secret.secret))) }
              else
                {  }
              end))
            end
          end
        else
          respond_to do |format|
            format.text do
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