class Action::MoveController < Action::GameplayController
  
  def create
    @move = Action::Move.create(
      :game => @game,
      :position => params[:position]
    )
    (render(:status => 403, :text => @move.errors.full_messages.to_sentence) and return) unless @move.valid?
    @game.update_notifications(current_user)
    self.assemble_info # it has been updated!
    @info[:move] = @move
    respond_to do |format|
      format.json {
        render :json => @info
      }
      format.html {
        render :action => "create", :layout => false
      }
    end
  end
  
  def valid
    @move = Action::Move.new(
      :game => @game,
      :position => params[:position]
    )
    render :status => 403 unless @move.valid?
  end
  
end