module Action::AlternatingTurnLogic
  def check_authorization
    unless (self.current_user == @user_to_play) then
      render(:status => 401)
      return false
    end
    true
  end
  def self.included(receiver)
    before_filter(:check_authorization)
  end
end