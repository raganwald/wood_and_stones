require File.dirname(__FILE__) + '/../test_helper'

class AboutControllerTest < ActionController::TestCase
  
  context "Basic about page" do
    
    setup do
      get :index
    end
    
    should_respond_with :success
    should_render_template :index
    should_not_set_the_flash

  end
  
end