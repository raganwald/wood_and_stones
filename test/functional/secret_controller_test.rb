require File.dirname(__FILE__) + '/../test_helper'

class SecretControllerTest < ActionController::TestCase
  
  context "given a secret link to a game" do
    
    setup do
      @adam = User.find_or_create_by_email('adam@garden.org')
      @eve = User.find_or_create_by_email('eve@garden.org')
      @game = Game.create!(
        :dimension => 9,
        :black => @adam,
        :even => @eve
      )
      @secret = Secret.create(
        :user => @adam,
        :target => @game
      )
    end
    
    should "resolve to a secret" do
      assert_not_nil(@secret.secret)
    end
    
    context "getting that secret" do
      
      setup do
        get :go, :secret => @secret.secret
      end
    
      should "redirect to the game" do
        assert_redirected_to :controller => :game, :action => :show, :id => @game.id
      end
    
      should "log the user in" do
        assert_equal @adam.id, @request.session[:user_id]
      end
      
    end
    
  end
  
end