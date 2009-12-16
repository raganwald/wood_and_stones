require File.dirname(__FILE__) + '/../test_helper'

class GameControllerTest < ActionController::TestCase
  
  context "creating a game" do
    
    setup do
      Game.delete_all
      Delayed::Job.delete_all
      @adam = User.find_or_create_by_email('adam@garden.org')
      @eve = User.find_or_create_by_email('eve@garden.org')
      @serpent = User.find_or_create_by_email('jake@the-snake.com')
    end
    
    should "not be any games between any of these players" do
      assert_equal(0, Game.played_by(@adam).played_by(@eve).count)
      assert_equal(0, Game.played_by(@adam).played_by(@serpent).count)
      assert_equal(0, Game.played_by(@eve).played_by(@serpent).count)
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
      
      should "enqueue jobs to invite the players" do
        assert_equal(2, Delayed::Job.all.size)
      end
      
      
    end
  
    context "when a user is signed in" do
      
      setup do
        login_as @adam
      end
      
      context "and the game features the user" do
      
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
        
        context "the new secrets for each player" do
      
          setup do
            @adams_secret = @game.secrets.for_user(@adam).first
            @eves_secret = @game.secrets.for_user(@eve).first
          end
          
          should "exist" do
            assert_not_nil(@adams_secret)
            assert_not_nil(@eves_secret)
          end
        
          should "create notifications for each player" do
            assert_equal(2, Delayed::Job.all.size)
          end
        
        end
      
      end
      
      context "and the game does not feature the user" do
        
        setup do
          post :create, :black => @serpent.email, :white => @eve.email, :dimension => 19, :handicap => 0
          @game = Game.played_by(@serpent).played_by(@eve).first
        end
        
        should_respond_with 401
      
        should "not create a new game" do
          assert_nil @game
        end
        
      end
      
    end
  
  end
  
end