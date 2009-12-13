require 'test_helper'

class Action::MoveControllerTest < ActionController::TestCase
  
  CORNER = 'aa'
  STAR_POINT = 'dd'
  
  def make_legal_move
    post :create, :game_id => @game.id, :position => CORNER
    @game.reload
  end
  
  def make_illegal_move
    post :create, :game_id => @game.id, :position => STAR_POINT
    @game.reload
  end
  
  context "given a game where it is white's turn to play" do
    
    setup do
      @adam = User.find_or_create_by_email('adam@garden.org')
      @eve = User.find_or_create_by_email('eve@garden.org')
      @game = Game.create!(
        :dimension => 13,
        :handicap => 4,
        :black => @adam,
        :white => @eve
      )
      @current_board_a = @game.current_board.to_a.clone
    end
    
    should "be empty in the corner" do
      assert @game.current_board[CORNER].open?
    end    
    
    should "have a black stone at the star point" do
      assert @game.current_board[STAR_POINT].black?, @game.current_board.to_a.inspect
    end   
    
    context "when nobody is signed in" do
    
      context "and make a legal move" do
      
        setup do
          make_legal_move
        end
      
        should_respond_with 401 # unauthorized because nobody is signed in
      
        should "not add the stone to the board" do
          assert @game.current_board[CORNER].open?
        end
        
        should "not alter the game board" do
          assert_equal(@current_board_a, @game.current_board.to_a)
        end
      
        should "not have added the stone to the board" do
          assert @game.current_board[STAR_POINT].black?#, @game.current_board.to_a.inspect
        end
      
      end
    
      context "and make an illegal move" do
      
        setup do
          make_illegal_move
        end
      
        should_respond_with 401
      
        should "not have added the stone to the board" do
          assert @game.current_board[STAR_POINT].black?#, @game.current_board.to_a.inspect
        end
      
      end
    
    end
 
    context "where black is signed in" do
      
      setup do
         login_as @adam
      end
    
      context "and make a legal move" do
      
        setup do
          make_legal_move
        end
      
        should_respond_with 401 #forbidden because black is not authorized to play
      
        should "not add the stone to the board" do
          assert @game.current_board[CORNER].open?
        end
      
      end
    
      context "and make an illegal move" do
      
        setup do
          make_illegal_move
        end
      
        should_respond_with 401
      
        should "not have added the stone to the board" do
          assert @game.current_board[STAR_POINT].black?
        end
      
      end
    
    end
    
    context "where white is signed in" do
      
      setup do
        login_as @eve
      end
    
      context "and make a legal move" do
      
        setup do
          make_legal_move
        end
      
        should_respond_with :success
      
        should "add the stone to the board" do
          assert @game.current_board[CORNER].white?
        end
      
      end
    
      context "and make an illegal move" do
      
        setup do
          make_illegal_move
        end
      
        should_respond_with 403 # move is illegal
      
        should "not have added the stone to the board" do
          assert @game.current_board[STAR_POINT].black?
        end
      
      end
    
    end

  end
  
end
