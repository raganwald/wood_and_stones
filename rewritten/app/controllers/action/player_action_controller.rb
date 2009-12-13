class Action::PlayerActionController < Action::BaseController
  before_filter(:check_player_is_logged_in)
  private
  def check_player_is_logged_in
    unless (self.current_user == @user_to_play) then
      render(:status => 401)
      return false
    end
    true
  end
end