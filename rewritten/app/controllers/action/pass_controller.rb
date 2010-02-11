class Action::PassController < Action::PlayerActionController
  def create
    @pass = Action::Pass.create(:game => (@game))
    render(:status => 403) unless @pass.valid?
  end
  def valid
    @pass = Action::Pass.new(:game => (@game), :position => (params[:position]))
    render(:status => 403) unless @pass.valid?
  end
end