require File.dirname(__FILE__) + '/../test_helper'

class GameTest < ActiveRecord::TestCase
  
  context "a new game" do
    
    setup do
      @game = Game.create(:dimension => 9)
    end
    
    context "that is about to repeat itself" do
      
      setup do
        Action::Move.create!(:game => @game, :player => 'white', :position => 'aa')
        Action::Move.create!(:game => @game, :player => 'black', :position => 'cb')
        Action::Move.create!(:game => @game, :player => 'white', :position => 'bb')
        Action::Move.create!(:game => @game, :player => 'black', :position => 'da')
        Action::Move.create!(:game => @game, :player => 'white', :position => 'ca')
        @game.reload
      end

      should "produce a valid game" do
        assert @game.valid?
      end
      
      should "produce a set of five before_boards for the game" do
        assert_equal(5, @game.before_boards.size)
      end
      
      context "starting with a capture in ko" do
        
        setup do
          Action::Move.create!(:game => @game, :player => 'black', :position => 'ba')
        end
        
        should "produce the correct board" do
          assert_equal [
            ["white", nil,     nil, nil, nil, nil, nil, nil, nil],
            ["black", "white", nil, nil, nil, nil, nil, nil, nil], 
            [nil,     "black", nil, nil, nil, nil, nil, nil, nil], 
            ["black", nil,     nil, nil, nil, nil, nil, nil, nil], 
            [nil,     nil,     nil, nil, nil, nil, nil, nil, nil],
            [nil,     nil,     nil, nil, nil, nil, nil, nil, nil], 
            [nil,     nil,     nil, nil, nil, nil, nil, nil, nil], 
            [nil,     nil,     nil, nil, nil, nil, nil, nil, nil], 
            [nil,     nil,     nil, nil, nil, nil, nil, nil, nil]
          ], @game.current_board.to_a
        end

        should "produce a valid game" do
          assert @game.valid?
        end
        
        should "leaving an open place" do
          assert @game.current_board['ca'].open?
        end
      
        context "an attempt to play into ko" do
        
          setup do
            @current_board = @game.current_board
            @move_into_ko = Action::Move.create(:game => @game, :player => 'white', :position => 'ca')
          end
        
          should "be invalid" do
            assert !@move_into_ko.valid?
          end
        
          should "not update the current board" do
            assert_equal(@current_board, @game.current_board)
          end

          should "not invalidate the game" do
            assert @game.valid?
          end
        
        end
        
      end
      
    end
    
  end
  
  context "initializing games for real" do
    
    context "a new game" do
      
      context "with a valid dimension" do
        
        setup do
           assert_nothing_raised(Game::InvalidInitialization) { 
             @game = Game.create(:dimension => 19) 
            }
        end
        
        should "be valid" do
          assert @game.valid?, @game.errors.full_messages.inspect
        end
        
        should "have a valid current_board" do
          assert @game.current_board.valid?, @game.current_board.errors.full_messages.inspect
        end
        
      end
      
      should "require a dimension" do
        assert_raise(Game::InvalidInitialization) { Game.create }
      end
      
      should "barf when given an invalid dimension" do
        assert !Game.new(:dimension => 6).valid?
      end
      
    end
    
  end
  
end