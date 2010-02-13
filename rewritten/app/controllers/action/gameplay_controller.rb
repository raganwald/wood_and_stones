class Action::GameplayController < Action::PlayerActionController
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
          @previous_cardinality = (__126609777841935__ = @move.lower_item and __126609777841935__.cardinality)
          @next_cardinality = (__126609777844189__ = @move.higher_item and __126609777844189__.cardinality)
        end
      else
        render(:status => 404)
      end
    end
  end
end