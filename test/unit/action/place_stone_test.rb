require File.dirname(__FILE__) + '/../../test_helper'

class Action::PlaceStoneTest < ActiveRecord::TestCase
  
  context "placements" do
    
    setup do
      @before = Board.create(:dimension => 13)
      @after = Board.create(:dimension => 13)
      @nineteen = Board.create(:dimension => 19)
      @game = Game.create(:dimension => 13)
      @placement = Action::PlaceStone.new(:position => 'A1', :player => 'white', :game => @game)
    end
  
    context "with no boards" do
    
      should "be invalid" do
        assert !@placement.valid?
      end
    
    end
  
    context "with both valid boards of the same dimension" do
      
      setup do
        @placement.before = @before
        @placement.after = @after
      end
      
      should "be valid" do
        assert @placement.valid?
      end
      
    end
    
    context "with both valid boards of different dimensions" do
      
      setup do
        @placement.before = @before
        @placement.after = @nineteen
      end
      
      should "not be valid" do
        assert !@placement.valid?
      end
      
    end
      
    
  end
  
end