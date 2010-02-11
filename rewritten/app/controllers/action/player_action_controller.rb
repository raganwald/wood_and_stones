class Action::PlayerActionController < Action::BaseController
  before_filter(:check_player_is_logged_in, :only => :create)
  before_filter(:assemble_info)
  before_filter(:all_actions, :for_game, :before_play, :after_play, :only => :index)
  def index
    render(:layout => (false)) if (params[:layout].to_s == "false")
  end
  def info
    respond_to { |format| format.json { render(:json => (@info)) } }
  end
  protected
  def check_player_is_logged_in
    unless (self.current_user_id == @game.user_to_play_id) then
      render(:text => "You cannot make a move unless you are logged in", :status => 401)
      return false
    end
    true
  end
  def all_actions
    @actions ||= Action::Base.scoped
  end
  def for_game
    (it = params[:game_id] and @actions = @actions.scoped(:conditions => ({ :game_id => (it) })))
  end
  def before_play
    (it = params[:before_play] and @actions = @actions.scoped(:conditions => ({ :cardinality => ((0..(it.to_i - 1))) })))
  end
  def after_play
    (it = params[:after_play] and @actions = @actions.scoped(:conditions => ({ :cardinality => (((it.to_i + 1)..400)) })))
  end
end