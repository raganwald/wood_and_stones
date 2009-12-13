require File.dirname(__FILE__) + '/../../test_helper'

class Action::PassTest < ActiveRecord::TestCase
  
  context "a game with a few moves" do
    
    setup do
      @before = Board.create(:dimension => 9)
      @adam = User.find_or_create_by_email('adam@garden.org')
      @eve = User.find_or_create_by_email('eve@garden.org')
      @game = Game.create(:dimension => 9, :black => @adam, :white => @eve, :handicap => 3)
      Action::Move.create(:game=>@game, :position => 'ab')
      Action::Move.create(:game=>@game, :position => 'aa')
      Action::Move.create(:game=>@game, :position => 'ba')
    end
    
    should "be a valid game" do
      assert @game.valid?, @game.errors.full_messages.to_sentence
    end
    
    context "a single pass" do
        
      setup do
        @pass_one = Action::Pass.create(:game => @game)
      end
        
      should "be a valid" do
        assert @pass_one.valid?
      end
      
      should "produce a board with the identical configuration" do
        assert @pass_one.after
        assert_equal(@pass_one.before.to_a, @pass_one.after.to_a)
      end
      
    end
    
  end
  
end