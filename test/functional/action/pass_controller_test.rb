require 'test_helper'

class Action::PassControllerTest < ActionController::TestCase

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
      # skipping the first move because there is some debate about whether
      # the first play can be a pass or not, so this test will work either
      # way
      Action::Move.create(:game=>@game, :position => 'aa')
      Action::Move.create(:game=>@game, :position => 'bb')
    end
    
    should "be in the moved state" do
      assert @game.moved?
    end
    
    context "and neither player is signed in" do
      
      context "an attempt to pass" do
        
        setup do
          post :create, :game_id => @game.id
        end
        
        should_respond_with 401 # unauthorized because nobody is signed in
        
        should "not change the game state" do
          assert @game.moved?
        end
        
      end
        
    end
    
    context "and black is signed in" do
      
      setup do
        login_as @game.black
      end
      
      context "an attempt to pass" do
        
        setup do
          post :create, :game_id => @game.id
        end
        
        should_respond_with 401 # unauthorized because it is not black's turn
        
        should "not change the game state" do
          assert @game.moved?
        end
        
      end
      
    end
    
    context "and white is signed in" do
      
      setup do
        login_as @game.white
      end
      
      context "an attempt to pass" do
        
        setup do
          post :create, :game_id => @game.id
          @game.reload
        end
        
        should_respond_with 200 # it is white's turn
        
        should "change the game state" do
          assert @game.passed?
        end
        
      end
      
    end
    
  end
  
end
