class Action::MoveController < Action::GameplayController
  def create
    @move = Action::Move.create(:game => (@game), :position => (params[:position]))
    unless @move.valid? then
      (render(:status => 403, :text => (@move.errors.full_messages.to_sentence)) and return)
    end
    self.assemble_info
    @info[:move] = @move
    respond_to { |format| format.json { render(:json => (@info)) } }
  end
  def valid
    @move = Action::Move.new(:game => (@game), :position => (params[:position]))
    render(:status => 403) unless @move.valid?
  end
end