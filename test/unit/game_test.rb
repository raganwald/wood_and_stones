require File.dirname(__FILE__) + '/../test_helper'

class GameTest < ActiveRecord::TestCase
  
  context "initializing games for real" do
    
    context "a new game" do
      
      should "require a dimension" do
        assert_raise(Game::InvalidInitialization) { Game.create }
      end
      
      should "initialize a new game with a new board when given a dimension" do
        assert_nothing_raised(Game::InvalidInitialization) { Game.create(:dimension => 19) }
      end
      
      should "barf when given an invalid dimension" do
        assert !Game.new(:dimension => 6).valid?
      end
      
    end
    
  end
  
end