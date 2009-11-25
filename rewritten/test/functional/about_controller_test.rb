require("/Users/raganwald/projects/go/test/test_helper.rb")
class AboutControllerTest < ActionController::TestCase
  context("Basic about page") do
    setup { get(:index) }
    should_respond_with(:success)
    should_render_template(:index)
    should_not_set_the_flash
  end
end
