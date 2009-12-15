require File.dirname(__FILE__) + '/../test_helper'

class GameControllerTest < ActionController::TestCase
  
  context "creating a game" do
    
    setup do
      @adam = User.find_or_create_by_email('adam@garden.org')
      @eve = User.find_or_create_by_email('eve@garden.org')
      @serpent = User.find_or_create_by_email('jake@the-snake.com')
    end
    
    should "not be any games between these two players" do
      assert_equal(0, Game.played_by(@adam).played_by(@eve).count)
    end
  
    context "when nobody is signed in" do
      
      setup do
        post :create, :black => @adam.email, :white => @eve.email, :dimension => 19, :handicap => 0
        @game = Game.played_by(@adam).played_by(@eve).first
      end
      
      should_redirect_to "the page showing a game" do
        {:method => :show}
      end
      
      should "create a new game" do
        assert_not_nil @game
      end
      
      should "create new secrets for each player" do
        assert_not_nil @game.secrets.for_user(@adam).first
        assert_not_nil @game.secrets.for_user(@eve).first
      end
      
      should "create an email invite for the black player" do
      end
      
      should "create an email invite for the white player" do
      end
      
      
    end
  
    context "when a user is signed in" do
      
      setup do
        login_as @adam
      end
      
      # context "and the game features the user as black" do
      # end
      # 
      # context "and the game features the user as white" do
      # end
      
      context "and the game does not feature the user" do
        
        setup do
          post :create, :black => @serpent.email, :white => @eve.email, :dimension => 19, :handicap => 0
        end
        
        should_respond_with 401
        
      end
      
    end
  
  end
  
end