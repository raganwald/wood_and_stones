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
      assert_valid @game
    end
    
    context "a single pass" do
        
      setup do
        @pass_one = Action::Pass.create(:game => @game)
      end
        
      should "be a valid" do
        assert_valid @pass_one
      end
      
      should "produce a board with the identical configuration" do
        assert @pass_one.after
        assert_equal(@pass_one.before.to_a, @pass_one.after.to_a)
      end
        
      should "not end the game" do
        assert !@game.ended?
      end
      
      context "followed immediately by another pass" do
        
        setup do
          @pass_two = Action::Pass.create(:game => @game)
        end
        
        should "be valid" do
          assert_valid @pass_two
        end
        
        should "end the game" do
          assert @game.ended?
        end
        
        context "followed by a third pass" do
        
          setup do
            @pass_three = Action::Pass.create(:game => @game)
          end
        
          should "not be valid" do
            assert !@pass_three.valid?
          end
        
          should "not un-end the game" do
            assert @game.ended?
          end
        
        end
        
        # context "followed by another move"
      
      end
      
      context "followed immediately by a move and then another pass" do
        
        setup do
          Action::Move.create(:game=>@game, :position => 'bb')
          @pass_two = Action::Pass.create(:game => @game)
        end
        
        should "be valid" do
          assert_valid @pass_two
        end
        
        should "not end the game" do
          assert !@game.ended?
        end
        
        context "followed by a third pass pass" do
        
          setup do
            @pass_three = Action::Pass.create(:game => @game)
          end
        
          should "be valid" do
            assert_valid @pass_three
          end
        
          should "end the game" do
            assert @game.ended?
          end
        end
        
        # context "followed by another move"
      
      end
      
    end
    
  end
  
end