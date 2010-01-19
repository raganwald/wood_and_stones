class Action::MoveController < Action::PlayerActionController
  def create
    @move = Action::Move.create(:game => (@game), :position => (params[:position]))
    render(:status => 403) unless @move.valid?
  end
  def valid
    @move = Action::Move.new(:game => (@game), :position => (params[:position]))
    render(:status => 403) unless @move.valid?
  end
  def show
    @cardinality = params[:cardinality]
    @game = (it = params[:game_id] and Game.find(it))
    unless @move then
      if (@cardinality and @game) then
        if (@cardinality == 0) then
          @move = nil
          @board = @game.initial_board
          @previous_cardinality = nil
          @next_cardinality = (@game.actions.count > 0) ? (1) : (nil)
        else
          @move = @game.actions.find(:conditions => ({ :cardinality => (@cardinality) }))
          @board = @move.after
          @previous_cardinality = (__126393647466720__ = @move.lower_item and __126393647466720__.cardinality)
          @next_cardinality = (__126393647463166__ = @move.higher_item and __126393647463166__.cardinality)
        end
      else
        render(:status => 404)
      end
    end
  end
end