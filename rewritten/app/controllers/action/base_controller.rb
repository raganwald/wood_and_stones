class Action::BaseController < ApplicationController
  before_filter(:given_game)
end