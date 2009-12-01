require File.dirname(__FILE__) + '/../test_helper'

class GameTest < ActiveRecord::TestCase
  
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