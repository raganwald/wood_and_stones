class Action::MoveController < Action::PlayerActionController
  def create
    @move = Action::Move.create(:game => (@game), :position => (params[:position]))
    render(:status => 403) unless @move.valid?
  end
  def valid
    @move = Action::Move.new(:game => (@game), :position => (params[:position]))
    render(:status => 403) unless @move.valid?
  end
end